import type { FetchResult, Member } from '../schemas.js';
import { daysUntilReturn } from '../parsers/dates.js';
import { booksByReturnDate, membersByActivity } from './sorts.js';

function urgencySuffix(days: number | null): string {
  if (days === null) return '';
  if (days < 0) return ' ⚠️ באיחור';
  if (days <= 3) return ' 🔴';
  if (days <= 7) return ' 🟡';
  return '';
}

function memberLines(member: Member): string[] {
  const lines: string[] = [`👤 ${member.name} (${member.books.length})`];
  for (const book of booksByReturnDate(member.books)) {
    const days = daysUntilReturn(book.returnDate);
    lines.push(`  • ${book.title} — עד ${book.returnDate}${urgencySuffix(days)}`);
  }
  lines.push('');
  return lines;
}

export function formatPlainText(result: FetchResult): string {
  const header = `📚 ספרים מושאלים — ${new Date(result.fetchedAt).toLocaleDateString('he-IL')}`;
  const active = membersByActivity(result).filter((m) => m.books.length > 0);

  if (active.length === 0) {
    return [header, '', 'אין ספרים מושאלים כרגע 🎉'].join('\n');
  }

  const body = active.flatMap(memberLines);
  return [header, '', ...body, `סה"כ: ${result.totalBooks} ספרים`].join('\n');
}
