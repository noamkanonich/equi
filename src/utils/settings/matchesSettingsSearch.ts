export const normalizeSettingsSearchQuery = (query: string): string =>
  query.trim().toLowerCase();

export const matchesSettingsSearch = (
  query: string,
  searchableText: string[],
): boolean => {
  const normalizedQuery = normalizeSettingsSearchQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  const haystack = searchableText.join(" ").toLowerCase();
  return haystack.includes(normalizedQuery);
};
