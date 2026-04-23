const NAME_RE = /שם המנוי:\s*([^&<\n]+)/;

export function parseMemberName(html: string): string {
  const m = html.match(NAME_RE);
  return m ? m[1].trim() : 'Unknown';
}
