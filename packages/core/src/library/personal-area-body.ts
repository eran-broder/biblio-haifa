import { CARD, SITE_NAME } from './endpoints.js';

function formEncode(entries: ReadonlyArray<readonly [string, string]>): string {
  return entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

export function personalAreaBody(userId: string, familyItemId: string | null): string {
  const entries: Array<[string, string]> = [];
  if (familyItemId !== null) entries.push(['familyItemID', familyItemId]);
  entries.push(['ItemID', userId]);
  entries.push(['Card', CARD]);
  entries.push(['SiteName', SITE_NAME]);
  return formEncode(entries);
}

export function loginBody(username: string, password: string): string {
  return formEncode([
    ['uname', username],
    ['pswd', password],
  ]);
}

const CNUMBER_RE = /CNumber=(\d+)/;

export function extractUserId(loginResponseBody: string): string | null {
  const m = loginResponseBody.match(CNUMBER_RE);
  return m ? m[1] : null;
}
