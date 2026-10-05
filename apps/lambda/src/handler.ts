import { FetchErrorCode, errorMessage, scrape, toFetchErrorCode } from '@biblio/core';
import { createNodeLibraryClient } from '@biblio/http-node';
import { HttpApiEventSchema, HttpMethod, decodeBody } from './event.js';
import { parseCredentials } from './parse-credentials.js';
import {
  emptyResponse,
  errorResponse,
  resultResponse,
  type HttpResponse,
} from './responses.js';

const client = createNodeLibraryClient();

export async function handler(rawEvent: unknown): Promise<HttpResponse> {
  const event = HttpApiEventSchema.safeParse(rawEvent);
  if (!event.success) return errorResponse(FetchErrorCode.Unknown, 'Malformed request.', 400);

  const method = event.data.requestContext.http.method;
  if (method === HttpMethod.Options) return emptyResponse(204);
  if (method !== HttpMethod.Post) return errorResponse(FetchErrorCode.Unknown, 'Method not allowed.', 405);

  const creds = parseCredentials(decodeBody(event.data));
  if (!creds) return errorResponse(FetchErrorCode.Unknown, 'Missing username or password.', 400);

  try {
    return resultResponse(await scrape({ ...creds, client }));
  } catch (err) {
    return errorResponse(toFetchErrorCode(err), errorMessage(err, 'Unknown error.'));
  }
}
