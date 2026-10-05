import { LibraryUnexpectedResponseError } from '../errors.js';
import { parseMemberName } from './member-name.js';

export function assertPersonalAreaPage(html: string): void {
  if (parseMemberName(html) !== null) return;
  throw new LibraryUnexpectedResponseError(
    'The library returned an unexpected borrowed-books page — the site may have changed.',
  );
}
