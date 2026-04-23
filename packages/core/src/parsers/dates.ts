export function parseLibraryDate(dateStr: string): Date | null {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((p) => parseInt(p, 10));
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

export function daysUntilReturn(returnDate: string, today: Date = new Date()): number | null {
  const d = parseLibraryDate(returnDate);
  if (!d) return null;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((d.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
}
