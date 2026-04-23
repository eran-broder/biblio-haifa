import type { Book, FetchResult, Member } from '../schemas.js';
import { parseLibraryDate } from '../parsers/dates.js';

function compareReturnDates(a: string, b: string): number {
  const da = parseLibraryDate(a);
  const db = parseLibraryDate(b);
  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return da.getTime() - db.getTime();
}

export function booksByReturnDate(books: readonly Book[]): Book[] {
  return [...books].sort((a, b) => compareReturnDates(a.returnDate, b.returnDate));
}

export function flattenSorted(result: FetchResult): Array<Book & { memberName: string }> {
  const all: Array<Book & { memberName: string }> = [];
  for (const m of result.members) {
    for (const b of m.books) {
      all.push({ ...b, memberName: m.name });
    }
  }
  all.sort((a, b) => compareReturnDates(a.returnDate, b.returnDate));
  return all;
}

export function membersByActivity(result: FetchResult): Member[] {
  return [...result.members].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return b.books.length - a.books.length;
  });
}
