import { FetchErrorCode, type FetchErrorPayload, type FetchResult } from '@biblio/core';

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const STATUS_BY_CODE: Record<FetchErrorCode, number> = {
  [FetchErrorCode.InvalidCredentials]: 401,
  [FetchErrorCode.UnexpectedResponse]: 502,
  [FetchErrorCode.Network]: 502,
  [FetchErrorCode.Unknown]: 500,
};

export function resultResponse(result: FetchResult): HttpResponse {
  return { statusCode: 200, headers: HEADERS, body: JSON.stringify(result) };
}

export function errorResponse(code: FetchErrorCode, error: string, statusCode?: number): HttpResponse {
  const payload: FetchErrorPayload = { error, code };
  return {
    statusCode: statusCode ?? STATUS_BY_CODE[code],
    headers: HEADERS,
    body: JSON.stringify(payload),
  };
}

export function emptyResponse(statusCode: number): HttpResponse {
  return { statusCode, headers: HEADERS, body: '' };
}
