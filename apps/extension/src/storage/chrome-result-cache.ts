import { FetchResultSchema, type FetchResult, type ResultCache } from '@biblio/core';

const KEY = 'biblio.last-result';

export function createChromeResultCache(): ResultCache {
  return {
    async load(): Promise<FetchResult | null> {
      const data = await chrome.storage.local.get(KEY);
      const parsed = FetchResultSchema.safeParse(data[KEY]);
      return parsed.success ? parsed.data : null;
    },
    async save(result: FetchResult): Promise<void> {
      await chrome.storage.local.set({ [KEY]: result });
    },
    async clear(): Promise<void> {
      await chrome.storage.local.remove(KEY);
    },
  };
}
