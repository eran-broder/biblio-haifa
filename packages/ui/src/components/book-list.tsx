import { daysUntilReturn, type BookWithOwner } from '@biblio/core';
import { dueChipClass } from './urgency.js';
import { dueBadgeText } from './due-label.js';

interface Props {
  entries: readonly BookWithOwner[];
}

function isNewDate(entries: readonly BookWithOwner[], i: number): boolean {
  if (i === 0) return false;
  return entries[i].book.returnDate !== entries[i - 1].book.returnDate;
}

export function BookList({ entries }: Props) {
  return (
    <ol className="book-flat-list">
      {entries.map((entry, i) => (
        <BookRow
          key={`${entry.book.itemNumber}-${entry.ownerId}`}
          entry={entry}
          index={i}
          dateBreak={isNewDate(entries, i)}
        />
      ))}
    </ol>
  );
}

function BookRow({
  entry,
  index,
  dateBreak,
}: {
  entry: BookWithOwner;
  index: number;
  dateBreak: boolean;
}) {
  const days = daysUntilReturn(entry.book.returnDate);
  const classes = ['book-flat-row'];
  if (dateBreak) classes.push('date-break');
  if (entry.ownerIsPrimary) classes.push('by-primary');
  return (
    <li className={classes.join(' ')} style={{ '--i': index } as React.CSSProperties}>
      <span className="book-title" title={entry.book.title}>
        {entry.book.title}
      </span>
      <span className="book-owner">{entry.ownerName}</span>
      <span className={dueChipClass(days)}>
        <span className="due-chip-dot" aria-hidden="true" />
        <span>{dueBadgeText(days, entry.book.returnDate)}</span>
      </span>
    </li>
  );
}
