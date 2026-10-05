import {
  LIBRARY_ORIGIN,
  LibraryNetworkError,
  LibraryPath,
  LibraryUnexpectedResponseError,
  loginBody,
  personalAreaBody,
  userIdFromLoginResponse,
  type LibraryClient,
  type LoggedIn,
} from '@biblio/core';

const FORM_HEADERS: HeadersInit = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

function assertUsable(response: Response, path: LibraryPath): void {
  if (response.redirected) {
    throw new LibraryUnexpectedResponseError(
      `The library redirected ${path} to ${response.url} — the site may have changed.`,
    );
  }
  if (!response.ok) {
    throw new LibraryNetworkError(`Library responded ${response.status}`);
  }
}

async function postForm(path: LibraryPath, body: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${LIBRARY_ORIGIN}${path}`, {
      method: 'POST',
      headers: FORM_HEADERS,
      body,
      credentials: 'include',
    });
  } catch (e) {
    throw new LibraryNetworkError(e instanceof Error ? e.message : 'Network error');
  }
  assertUsable(response, path);
  return response.text();
}

async function openSession(): Promise<void> {
  try {
    await fetch(`${LIBRARY_ORIGIN}${LibraryPath.Root}`, {
      method: 'GET',
      credentials: 'include',
    });
  } catch (e) {
    throw new LibraryNetworkError(e instanceof Error ? e.message : 'Network error');
  }
}

export function createFetchLibraryClient(): LibraryClient {
  return {
    async login(username, password): Promise<LoggedIn> {
      await openSession();
      const body = await postForm(LibraryPath.Login, loginBody(username, password));
      return { userId: userIdFromLoginResponse(body) };
    },

    async fetchPersonalArea(session, familyItemId) {
      return postForm(LibraryPath.PersonalArea, personalAreaBody(session.userId, familyItemId));
    },
  };
}
