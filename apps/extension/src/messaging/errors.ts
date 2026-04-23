import {
  errorMessage,
  FetchErrorCode,
  LibraryAuthError,
  LibraryNetworkError,
  toFetchErrorCode,
} from '@biblio/core';

export function serializeError(err: unknown): { message: string; code: FetchErrorCode } {
  return {
    message: errorMessage(err, 'Unknown error'),
    code: toFetchErrorCode(err),
  };
}

export function deserializeError(message: string, code: FetchErrorCode): Error {
  switch (code) {
    case FetchErrorCode.InvalidCredentials:
      return new LibraryAuthError(message);
    case FetchErrorCode.Network:
      return new LibraryNetworkError(message);
    case FetchErrorCode.Unknown:
      return new Error(message);
  }
}
