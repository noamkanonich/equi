import { NextResponse } from "next/server";
import { searchStocks } from "@/utils/financial-data/searchStocks";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  if (query.length > 64) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const response = await searchStocks(query);
  return NextResponse.json(response);
};
