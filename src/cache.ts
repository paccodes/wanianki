const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export const isCacheExpired = (cachedData: { cachedAt: number }): boolean =>
  Date.now() - cachedData.cachedAt > CACHE_TTL_MS;
