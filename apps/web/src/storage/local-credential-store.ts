import { CredentialsSchema, type CredentialStore, type Credentials } from '@biblio/core';

const KEY = 'biblio.creds';

function readRaw(): unknown {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function createLocalCredentialStore(): CredentialStore {
  return {
    async load(): Promise<Credentials | null> {
      const parsed = CredentialsSchema.safeParse(readRaw());
      return parsed.success ? parsed.data : null;
    },
    async save(creds: Credentials): Promise<void> {
      localStorage.setItem(KEY, JSON.stringify(creds));
    },
    async clear(): Promise<void> {
      localStorage.removeItem(KEY);
    },
  };
}
