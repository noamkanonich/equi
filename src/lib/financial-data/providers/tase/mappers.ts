import "server-only";

import type { Asset, AssetType } from "@/data/market/market.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";

const ROW_ARRAY_KEYS = [
  "data",
  "items",
  "result",
  "results",
  "value",
  "Value",
  "records",
];

const NESTED_ROW_CONTAINER_KEYS = ["companiesList", "funds"];

type RowRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is RowRecord =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeText = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
};

const findText = (row: RowRecord, keys: string[]): string => {
  for (const key of keys) {
    const value = normalizeText(row[key]);
    if (value) {
      return value;
    }
  }

  return "";
};

const getRowKeysWarning = (productName: string, data: unknown): void => {
  if (!isRecord(data)) {
    logFinancialDataDebug("tase.rows.unknownShape", {
      product: productName,
      shape: Array.isArray(data) ? "array" : typeof data,
    });
    return;
  }

  logFinancialDataDebug("tase.rows.unknownShape", {
    product: productName,
    topLevelKeys: Object.keys(data),
  });
};

export const extractTaseRows = (data: unknown, productName: string): RowRecord[] => {
  if (Array.isArray(data)) {
    return data.filter(isRecord);
  }

  if (!isRecord(data)) {
    getRowKeysWarning(productName, data);
    return [];
  }

  for (const key of ROW_ARRAY_KEYS) {
    const rows = data[key];
    if (Array.isArray(rows)) {
      return rows.filter(isRecord);
    }
  }

  for (const containerKey of NESTED_ROW_CONTAINER_KEYS) {
    const container = data[containerKey];
    if (!isRecord(container)) {
      continue;
    }

    for (const key of ROW_ARRAY_KEYS) {
      const rows = container[key];
      if (Array.isArray(rows)) {
        return rows.filter(isRecord);
      }
    }
  }

  getRowKeysWarning(productName, data);
  return [];
};

const resolveProviderSymbol = (row: RowRecord): string =>
  findText(row, [
    "securityId",
    "securityID",
    "securityNo",
    "securityNumber",
    "security_id",
    "security_id_num",
    "issuerId",
    "issuerID",
    "fundId",
    "fundID",
    "fundNo",
    "fundNumber",
    "indexId",
    "indexID",
    "indexCode",
    "taseId",
    "id",
    "Id",
    "corporateId",
    "isin",
    "ISIN",
    "symbol",
    "Symbol",
  ]);

const resolveName = (row: RowRecord): string =>
  findText(row, [
    "companyFullName",
    "fundLongName",
    "name",
    "Name",
    "securityName",
    "securityNameEn",
    "securityNameHeb",
    "securityLongName",
    "companyName",
    "companyNameEn",
    "companyNameHeb",
    "fundName",
    "fundNameEn",
    "fundNameHeb",
    "indexName",
    "indexname",
    "indexNameEn",
    "indexNameHeb",
    "shortName",
  ]);

const resolveDisplaySymbol = (row: RowRecord, providerSymbol: string): string =>
  findText(row, [
    "symbol",
    "Symbol",
    "tradeSymbol",
    "tradingSymbol",
    "securitySymbol",
    "ticker",
    "companyName",
    "indexname",
    "fundName",
    "isin",
    "ISIN",
  ]) || providerSymbol;

const resolveNestedLabel = (row: RowRecord, objectKey: string): string => {
  const nested = row[objectKey];
  if (!isRecord(nested)) {
    return "";
  }

  return findText(nested, ["value", "Value", "name", "Name"]);
};

const resolveFundTypeLabel = (row: RowRecord): string => {
  const fundTypes = row.fundType;
  if (!Array.isArray(fundTypes) || fundTypes.length === 0) {
    return "";
  }

  const firstType = fundTypes[0];
  if (!isRecord(firstType)) {
    return "";
  }

  return findText(firstType, ["value", "Value"]);
};

export const resolveTaseSector = (row: RowRecord): string =>
  findText(row, ["taseSector"]) ||
  resolveNestedLabel(row, "classificationMain") ||
  resolveNestedLabel(row, "classificationMajor");

export const resolveTaseIndustry = (row: RowRecord): string => {
  if (row.isDual === true) {
    return "Dual-listed";
  }

  return (
    resolveNestedLabel(row, "classificationMajor") ||
    resolveFundTypeLabel(row) ||
    findText(row, ["exposureProfile"])
  );
};

export const resolveTaseMetadataFromRaw = (
  raw: unknown,
): { sector?: string; industry?: string } => {
  if (!isRecord(raw)) {
    return {};
  }

  const sector = resolveTaseSector(raw);
  const industry = resolveTaseIndustry(raw);

  return {
    ...(sector ? { sector } : {}),
    ...(industry ? { industry } : {}),
  };
};

const inferSecurityAssetType = (row: RowRecord): AssetType => {
  if (findText(row, ["issuerId", "issuerID", "companyName", "companyFullName"])) {
    return "stock";
  }

  const typeText = findText(row, [
    "assetType",
    "securityType",
    "securityTypeDesc",
    "securityTypeDescription",
    "type",
    "subType",
    "instrumentType",
  ]).toLowerCase();

  if (typeText.includes("bond") || typeText.includes("debenture")) {
    return "bond";
  }

  if (typeText.includes("etf") || typeText.includes("tracking")) {
    return "etf";
  }

  if (typeText.includes("fund")) {
    return "fund";
  }

  if (typeText.includes("share") || typeText.includes("stock") || typeText.includes("equity")) {
    return "stock";
  }

  return "unknown";
};

const buildTaseAsset = (
  row: RowRecord,
  assetType: AssetType,
): Asset | null => {
  const providerSymbol = resolveProviderSymbol(row);
  if (!providerSymbol) {
    return null;
  }

  const displaySymbol = resolveDisplaySymbol(row, providerSymbol);
  const name = resolveName(row) || displaySymbol;
  const sector = resolveTaseSector(row);
  const industry = resolveTaseIndustry(row);

  return {
    id: `IL:TASE:${providerSymbol}`,
    symbol: providerSymbol,
    displaySymbol,
    name,
    market: "IL",
    exchange: "TASE",
    currency: "ILS",
    assetType,
    provider: "tase",
    providerSymbol,
    ...(sector ? { sector } : {}),
    ...(industry ? { industry } : {}),
    raw: row,
  };
};

const dedupeAssets = (assets: Asset[]): Asset[] => {
  const byId = new Map<string, Asset>();

  for (const asset of assets) {
    if (!byId.has(asset.id)) {
      byId.set(asset.id, asset);
    }
  }

  return [...byId.values()];
};

export const normalizeTaseSecurities = (data: unknown): Asset[] => {
  const rows = extractTaseRows(data, "securities");
  logFinancialDataDebug("tase.product.received", {
    product: "securities",
    count: rows.length,
  });
  const assets = rows
    .map((row) => buildTaseAsset(row, inferSecurityAssetType(row)))
    .filter((asset): asset is Asset => Boolean(asset));

  return dedupeAssets(assets);
};

export const normalizeTaseIndices = (data: unknown): Asset[] => {
  const rows = extractTaseRows(data, "indices");
  logFinancialDataDebug("tase.product.received", {
    product: "indices",
    count: rows.length,
  });
  const assets = rows
    .map((row) => buildTaseAsset(row, "index"))
    .filter((asset): asset is Asset => Boolean(asset));

  return dedupeAssets(assets);
};

export const normalizeTaseFunds = (data: unknown): Asset[] => {
  const rows = extractTaseRows(data, "funds");
  logFinancialDataDebug("tase.product.received", {
    product: "funds",
    count: rows.length,
  });
  const assets = rows
    .map((row) => buildTaseAsset(row, "fund"))
    .filter((asset): asset is Asset => Boolean(asset));

  return dedupeAssets(assets);
};
