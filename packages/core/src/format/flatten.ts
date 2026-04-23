import type { Book, FetchResult } from '../schemas.js';
import { parseLibraryDate } from '../parsers/dates.js';

export interface BookWithOwner {
  book: Book;
  ownerName: string;
  ownerId: string;
  ownerIsPrimary: boolean;
}

function dueTime(book: Book): number {
  const d = parseLibraryDate(book.returnDate);
  return d ? d.getTime() : Number.POSITIVE_INFINITY;
}

export function flattenByDueDate(result: FetchResult): BookWithOwner[] {
  const all: BookWithOwner[] = [];
  for (const member of result.members) {
    for (const book of member.books) {
      all.push({
        book,
        ownerName: member.name,
        ownerId: member.id,
        ownerIsPrimary: member.isPrimary,
      });
    }
  }
  all.sort((a, b) => {
    const diff = dueTime(a.book) - dueTime(b.book);
    if (diff !== 0) return diff;
    if (a.ownerIsPrimary !== b.ownerIsPrimary) return a.ownerIsPrimary ? -1 : 1;
    return a.ownerName.localeCompare(b.ownerName, 'he');
  });
  return all;
}
