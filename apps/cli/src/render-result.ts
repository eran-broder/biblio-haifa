import {
  booksByReturnDate,
  daysUntilReturn,
  type Book,
  type FetchResult,
  type Member,
} from '@biblio/core';
import { ANSI, colorForDays } from './ansi.js';
import { header } from './log.js';

function dueLabel(returnDate: string, days: number | null): string {
  if (days === null) return returnDate;
  if (days < 0) return `${returnDate} (overdue ${-days}d)`;
  return `${returnDate} (${days}d)`;
}

function renderBook(book: Book): void {
  const days = daysUntilReturn(book.returnDate);
  console.log(`    ${book.title}  ${colorForDays(days)}${dueLabel(book.returnDate, days)}${ANSI.reset}`);
}

function renderMember(member: Member): void {
  const star = member.isPrimary ? '★' : ' ';
  console.log(`${ANSI.bold}${star} ${member.name}${ANSI.reset} ${ANSI.dim}(${member.books.length})${ANSI.reset}`);
  for (const book of booksByReturnDate(member.books)) {
    renderBook(book);
  }
  console.log();
}

export function renderResult(result: FetchResult): void {
  console.log();
  header('— summary —');
  console.log();
  for (const member of result.members) {
    renderMember(member);
  }
  console.log(
    `${ANSI.bold}total:${ANSI.reset} ${result.totalBooks} books across ${result.members.length} members`,
  );
}
