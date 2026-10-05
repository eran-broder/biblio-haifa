import { errorMessage, toFetchErrorCode, type FetchErrorCode } from '@biblio/core';

export function serializeError(err: unknown): { message: string; code: FetchErrorCode } {
  return {
    message: errorMessage(err, 'Unknown error'),
    code: toFetchErrorCode(err),
  };
}
