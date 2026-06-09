export const isFmpArrayResponse = <T>(data: unknown): data is T[] =>
  Array.isArray(data);

export const isFmpObjectResponse = (
  data: unknown,
): data is Record<string, unknown> =>
  typeof data === "object" && data !== null && !Array.isArray(data);

export const isFmpErrorResponse = (data: unknown): boolean => {
  if (!isFmpObjectResponse(data)) {
    return false;
  }
  return (
    "Error Message" in data ||
    "error" in data ||
    (typeof data.message === "string" &&
      data.message.toLowerCase().includes("legacy"))
  );
};

export const getFmpErrorMessage = (data: unknown): string | undefined => {
  if (!isFmpObjectResponse(data)) {
    return undefined;
  }
  const legacy = data["Error Message"];
  if (typeof legacy === "string") {
    return legacy;
  }
  if (typeof data.error === "string") {
    return data.error;
  }
  if (typeof data.message === "string") {
    return data.message;
  }
  return undefined;
};
