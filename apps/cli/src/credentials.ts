import type { Credentials } from '@biblio/core';

export class MissingCredentialsError extends Error {
  constructor() {
    super(
      'Missing credentials. Pass as args: `pnpm cli <username> <password>`, ' +
        'or set the BIBLIO_USER and BIBLIO_PASS environment variables.',
    );
    this.name = 'MissingCredentialsError';
  }
}

export function resolveCredentials(argv: readonly string[]): Credentials {
  const username = argv[2] ?? process.env.BIBLIO_USER;
  const password = argv[3] ?? process.env.BIBLIO_PASS;
  if (!username || !password) throw new MissingCredentialsError();
  return { username, password };
}
