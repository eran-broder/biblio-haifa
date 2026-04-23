const SESSION_RE = /PHPSESSID=([^;]+)/;

export function extractSessionId(setCookie: readonly string[] | undefined): string | null {
  if (!setCookie) return null;
  for (const cookie of setCookie) {
    const m = cookie.match(SESSION_RE);
    if (m) return m[1];
  }
  return null;
}
