import { FetchErrorCode } from './enums.js';

export class LibraryAuthError extends Error {
  readonly code = FetchErrorCode.InvalidCredentials;
  constructor(message = 'Login failed — incorrect username or password.') {
    super(message);
    this.name = 'LibraryAuthError';
  }
}

export class LibraryNetworkError extends Error {
  readonly code = FetchErrorCode.Network;
  constructor(message: string) {
    super(message);
    this.name = 'LibraryNetworkError';
  }
}

export function toFetchErrorCode(err: unknown): FetchErrorCode {
  if (err instanceof LibraryAuthError) return FetchErrorCode.InvalidCredentials;
  if (err instanceof LibraryNetworkError) return FetchErrorCode.Network;
  return FetchErrorCode.Unknown;
}

export function errorMessage(err: unknown, fallback = 'Unknown error'): string {
  return err instanceof Error ? err.message : fallback;
}
