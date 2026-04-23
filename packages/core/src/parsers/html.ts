const ENTITIES: ReadonlyArray<[RegExp, string]> = [
  [/&nbsp;/g, ' '],
  [/&amp;/g, '&'],
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
  [/&quot;/g, '"'],
];

export function stripHtml(html: string): string {
  let out = html.replace(/<[^>]+>/g, '');
  for (const [pattern, replacement] of ENTITIES) {
    out = out.replace(pattern, replacement);
  }
  return out.trim();
}
