import {
  LIBRARY_HOST,
  LIBRARY_USER_AGENT,
  LibraryNetworkError,
  LibraryPath,
  loginBody,
  personalAreaBody,
  userIdFromLoginResponse,
  type LibraryClient,
  type LoggedIn,
} from '@biblio/core';
import { httpsRequest, type RawResponse } from './request.js';
import { assertUsable } from './assert-usable.js';

interface NodeSession extends LoggedIn {
  readonly sessionId: string;
}

function toNetworkError(e: unknown): never {
  throw new LibraryNetworkError(e instanceof Error ? e.message : 'Network error');
}

function formHeaders(body: string, sessionId: string | null): Record<string, string | number> {
  const headers: Record<string, string | number> = {
    'User-Agent': LIBRARY_USER_AGENT,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(body),
  };
  if (sessionId) headers.Cookie = `PHPSESSID=${sessionId}`;
  return headers;
}

async function postForm(
  path: LibraryPath,
  body: string,
  sessionId: string | null,
): Promise<RawResponse> {
  const res = await httpsRequest(
    { hostname: LIBRARY_HOST, path, method: 'POST', headers: formHeaders(body, sessionId) },
    body,
  ).catch(toNetworkError);
  return assertUsable(res, path);
}

async function openSession(): Promise<string | null> {
  const res = await httpsRequest({
    hostname: LIBRARY_HOST,
    path: LibraryPath.Root,
    method: 'GET',
    headers: { 'User-Agent': LIBRARY_USER_AGENT },
  }).catch(toNetworkError);
  return res.sessionId;
}

export function createNodeLibraryClient(): LibraryClient {
  return {
    async login(username, password) {
      const initialSessionId = await openSession();
      const res = await postForm(LibraryPath.Login, loginBody(username, password), initialSessionId);
      const userId = userIdFromLoginResponse(res.body);
      const sessionId = res.sessionId ?? initialSessionId;
      if (!sessionId) throw new LibraryNetworkError('Login succeeded but no PHPSESSID was issued.');
      const session: NodeSession = { userId, sessionId };
      return session;
    },

    async fetchPersonalArea(session, familyItemId) {
      const { sessionId } = session as NodeSession;
      const body = personalAreaBody(session.userId, familyItemId);
      const res = await postForm(LibraryPath.PersonalArea, body, sessionId);
      return res.body;
    },
  };
}
