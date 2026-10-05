import { LibraryNetworkError, LibraryUnexpectedResponseError } from '@biblio/core';
import type { RawResponse } from './request.js';

function isRedirect(statusCode: number): boolean {
  return statusCode >= 300 && statusCode < 400;
}

function isSuccess(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

export function assertUsable(res: RawResponse, path: string): RawResponse {
  if (isRedirect(res.statusCode)) {
    throw new LibraryUnexpectedResponseError(
      `The library redirected ${path} to ${res.location ?? 'an unknown location'} — the site may have changed.`,
    );
  }
  if (!isSuccess(res.statusCode)) {
    throw new LibraryNetworkError(`Library responded ${res.statusCode}`);
  }
  return res;
}
