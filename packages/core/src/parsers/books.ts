import type { Book } from '../schemas.js';
import { stripHtml } from './html.js';

const ROW_RE = /<tr[^>]*id="Row_Borrowed_\d+"[^>]*>([\s\S]*?)<\/tr>/gi;
const CELL_RE = /<td[^>]*>([\s\S]*?)<\/td>/gi;
const TITLE_PREFIX_RE = /^כותר\s*:\s*/;

function rowToBook(rowHtml: string): Book | null {
  const cells: string[] = [];
  let m: RegExpExecArray | null;
  const cellRe = new RegExp(CELL_RE.source, CELL_RE.flags);
  while ((m = cellRe.exec(rowHtml)) !== null) {
    cells.push(stripHtml(m[1]));
  }
  if (cells.length < 5) return null;
  return {
    title: cells[1].replace(TITLE_PREFIX_RE, '').trim(),
    itemNumber: cells[2],
    loanDate: cells[3],
    returnDate: cells[4],
    notes: cells[5] ?? '',
  };
}

export function parseBooks(html: string): Book[] {
  const books: Book[] = [];
  const rowRe = new RegExp(ROW_RE.source, ROW_RE.flags);
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html)) !== null) {
    const book = rowToBook(m[1]);
    if (book) books.push(book);
  }
  return books;
}
