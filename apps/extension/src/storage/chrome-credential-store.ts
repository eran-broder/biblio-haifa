import { CredentialsSchema, type CredentialStore, type Credentials } from '@biblio/core';

const KEY = 'biblio.creds';

export function createChromeCredentialStore(): CredentialStore {
  return {
    async load(): Promise<Credentials | null> {
      const data = await chrome.storage.local.get(KEY);
      const parsed = CredentialsSchema.safeParse(data[KEY]);
      return parsed.success ? parsed.data : null;
    },
    async save(creds: Credentials): Promise<void> {
      await chrome.storage.local.set({ [KEY]: creds });
    },
    async clear(): Promise<void> {
      await chrome.storage.local.remove(KEY);
    },
  };
}
