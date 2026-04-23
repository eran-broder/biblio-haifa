const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

export function relativeTimeSince(iso: string, now: Date = new Date()): string {
  const elapsed = now.getTime() - new Date(iso).getTime();
  if (elapsed < MINUTE) return 'עכשיו';
  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE);
    return minutes === 1 ? 'לפני דקה' : `לפני ${minutes} דקות`;
  }
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    return hours === 1 ? 'לפני שעה' : `לפני ${hours} שעות`;
  }
  const days = Math.floor(elapsed / DAY);
  return days === 1 ? 'אתמול' : `לפני ${days} ימים`;
}
