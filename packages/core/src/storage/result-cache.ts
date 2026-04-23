import type { FetchResult } from '../schemas.js';

export interface ResultCache {
  load(): Promise<FetchResult | null>;
  save(result: FetchResult): Promise<void>;
  clear(): Promise<void>;
}
