import { FetchErrorCode } from './enums.js';

export class LibraryAuthError extends Error {
  readonly code = FetchErrorCode.InvalidCredentials;
  constructor(message = 'Login failed — incorrect username or password.') {
    super(message);
    this.name = 'LibraryAuthError';
  }
}

export class LibraryUnexpectedResponseError extends Error {
  readonly code = FetchErrorCode.UnexpectedResponse;
  constructor(message = 'The library site returned an unexpected page — it may have changed.') {
    super(message);
    this.name = 'LibraryUnexpectedResponseError';
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
  if (err instanceof LibraryUnexpectedResponseError) return FetchErrorCode.UnexpectedResponse;
  if (err instanceof LibraryNetworkError) return FetchErrorCode.Network;
  return FetchErrorCode.Unknown;
}

export function errorFromCode(code: FetchErrorCode, message: string): Error {
  switch (code) {
    case FetchErrorCode.InvalidCredentials:
      return new LibraryAuthError(message);
    case FetchErrorCode.UnexpectedResponse:
      return new LibraryUnexpectedResponseError(message);
    case FetchErrorCode.Network:
      return new LibraryNetworkError(message);
    case FetchErrorCode.Unknown:
      return new Error(message);
  }
}

export function errorMessage(err: unknown, fallback = 'Unknown error'): string {
  return err instanceof Error ? err.message : fallback;
}
