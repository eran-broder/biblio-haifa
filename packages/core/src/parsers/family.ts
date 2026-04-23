import { stripHtml } from './html.js';

export interface FamilyRef {
  id: string;
  name: string;
}

const ROW_RE = /<tr[^>]*id="Row_Family_(\d+)"[^>]*>([\s\S]*?)<\/tr>/gi;
const NAME_RE = /openNewFamily\('\d+'\);?\s*"\s*>([\s\S]*?)<\/div>/;

export function parseFamilyMembers(html: string): FamilyRef[] {
  const refs: FamilyRef[] = [];
  const re = new RegExp(ROW_RE.source, ROW_RE.flags);
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const id = match[1];
    const rowHtml = match[2];
    const nameMatch = rowHtml.match(NAME_RE);
    const name = nameMatch ? stripHtml(nameMatch[1]) : `Family ${id}`;
    refs.push({ id, name });
  }
  return refs;
}
