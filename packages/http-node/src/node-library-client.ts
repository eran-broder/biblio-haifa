import {
  LIBRARY_HOST,
  LIBRARY_USER_AGENT,
  LibraryAuthError,
  LibraryNetworkError,
  LibraryPath,
  extractUserId,
  loginBody,
  personalAreaBody,
  type LibraryClient,
  type LoggedIn,
} from '@biblio/core';
import { httpsRequest } from './request.js';

interface NodeSession extends LoggedIn {
  readonly sessionId: string;
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

async function openSession(): Promise<string | null> {
  const res = await httpsRequest({
    hostname: LIBRARY_HOST,
    path: LibraryPath.Root,
    method: 'GET',
    headers: { 'User-Agent': LIBRARY_USER_AGENT },
  });
  return res.sessionId;
}

async function postLogin(
  username: string,
  password: string,
  priorSessionId: string | null,
): Promise<{ body: string; sessionId: string | null }> {
  const body = loginBody(username, password);
  const res = await httpsRequest(
    {
      hostname: LIBRARY_HOST,
      path: LibraryPath.Login,
      method: 'POST',
      headers: formHeaders(body, priorSessionId),
    },
    body,
  );
  return { body: res.body, sessionId: res.sessionId ?? priorSessionId };
}

export function createNodeLibraryClient(): LibraryClient {
  return {
    async login(username, password) {
      const initialSessionId = await openSession().catch((e: unknown) => {
        throw new LibraryNetworkError(e instanceof Error ? e.message : 'Network error');
      });

      const { body, sessionId } = await postLogin(username, password, initialSessionId).catch(
        (e: unknown) => {
          throw new LibraryNetworkError(e instanceof Error ? e.message : 'Network error');
        },
      );

      const userId = extractUserId(body);
      if (!userId) throw new LibraryAuthError();
      if (!sessionId) throw new LibraryNetworkError('Login succeeded but no PHPSESSID was issued.');

      const session: NodeSession = { userId, sessionId };
      return session;
    },

    async fetchPersonalArea(session, familyItemId) {
      const { sessionId } = session as NodeSession;
      const body = personalAreaBody(session.userId, familyItemId);
      const res = await httpsRequest(
        {
          hostname: LIBRARY_HOST,
          path: LibraryPath.PersonalArea,
          method: 'POST',
          headers: formHeaders(body, sessionId),
        },
        body,
      ).catch((e: unknown) => {
        throw new LibraryNetworkError(e instanceof Error ? e.message : 'Network error');
      });
      return res.body;
    },
  };
}
