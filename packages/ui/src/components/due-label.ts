const RELATIVE_THRESHOLD_DAYS = 14;

function compactDate(returnDate: string): string {
  const parts = returnDate.split('.');
  if (parts.length < 2) return returnDate;
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  return `${day}.${month}`;
}

export function dueBadgeText(days: number | null, returnDate: string): string {
  if (days === null) return returnDate;
  if (days < 0) return `${-days}ד׳ באיחור`;
  if (days === 0) return 'היום';
  if (days === 1) return 'מחר';
  if (days <= RELATIVE_THRESHOLD_DAYS) return `עוד ${days}ד׳`;
  return compactDate(returnDate);
}
