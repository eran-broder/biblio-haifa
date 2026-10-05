import {
  FetchErrorCode,
  FetchErrorSchema,
  FetchResultSchema,
  LibraryNetworkError,
  errorFromCode,
  type Credentials,
  type FetchResult,
} from '@biblio/core';

const DEFAULT_ENDPOINT =
  'https://zn0cu76k04.execute-api.il-central-1.amazonaws.com/fetch-books';

const ENDPOINT = import.meta.env.VITE_BIBLIO_API_URL ?? DEFAULT_ENDPOINT;

export async function runScrapeViaHttp(creds: Credentials): Promise<FetchResult> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
  } catch (err) {
    throw new LibraryNetworkError(err instanceof Error ? err.message : 'Network error');
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new LibraryNetworkError('Invalid response from server.');
  }

  if (!response.ok) {
    const parsed = FetchErrorSchema.safeParse(body);
    const message = parsed.success ? parsed.data.error : `Request failed (${response.status}).`;
    const code = parsed.success ? parsed.data.code : FetchErrorCode.Unknown;
    throw errorFromCode(code, message);
  }

  const parsed = FetchResultSchema.safeParse(body);
  if (!parsed.success) throw new LibraryNetworkError('Unexpected response shape.');
  return parsed.data;
}
