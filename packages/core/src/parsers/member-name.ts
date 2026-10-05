const NAME_RE = /שם המנוי:\s*([^&<\n]+)/;

export function parseMemberName(html: string): string | null {
  const m = html.match(NAME_RE);
  return m ? m[1].trim() : null;
}
