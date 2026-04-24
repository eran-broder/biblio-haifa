import { FetchResultSchema, type FetchResult, type ResultCache } from '@biblio/core';

const KEY = 'biblio.last-result';

function readRaw(): unknown {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function createLocalResultCache(): ResultCache {
  return {
    async load(): Promise<FetchResult | null> {
      const parsed = FetchResultSchema.safeParse(readRaw());
      return parsed.success ? parsed.data : null;
    },
    async save(result: FetchResult): Promise<void> {
      localStorage.setItem(KEY, JSON.stringify(result));
    },
    async clear(): Promise<void> {
      localStorage.removeItem(KEY);
    },
  };
}
