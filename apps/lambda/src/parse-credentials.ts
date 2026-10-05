import { CredentialsSchema, type Credentials } from '@biblio/core';

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return null;
  }
}

export function parseCredentials(raw: string): Credentials | null {
  const parsed = CredentialsSchema.safeParse(parseJson(raw));
  return parsed.success ? parsed.data : null;
}
