import { NextResponse } from "next/server";
import type { StockDataBundlesResponse } from "@/data/financial-data/financial-data.types";
import { getStockDataBundles } from "@/utils/financial-data/getStockDataBundles";
import {
  stockBundleScopeSchema,
  stockBundleSectionsQuerySchema,
  stockBundlesQuerySchema,
} from "@/utils/financial-data/stock-bundle.schema";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const rawSymbols = searchParams.get("symbols");

  if (!rawSymbols) {
    return NextResponse.json(
      { error: "Missing symbols query parameter" },
      { status: 400 },
    );
  }

  const parsed = stockBundlesQuerySchema.safeParse(rawSymbols);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid symbols" },
      { status: 400 },
    );
  }

  const scopeResult = stockBundleScopeSchema.safeParse(
    searchParams.get("scope") ?? "display",
  );

  if (!scopeResult.success) {
    return NextResponse.json(
      { error: "Invalid scope parameter" },
      { status: 400 },
    );
  }

  const sectionsResult = stockBundleSectionsQuerySchema.safeParse(
    searchParams.get("sections") ?? undefined,
  );

  if (!sectionsResult.success) {
    return NextResponse.json(
      { error: "Invalid sections parameter" },
      { status: 400 },
    );
  }

  const bundles = await getStockDataBundles(parsed.data, {
    scope: scopeResult.data,
    sections: sectionsResult.data,
  });
  const response: StockDataBundlesResponse = { bundles };

  return NextResponse.json(response);
};
