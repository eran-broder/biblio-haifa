export const ANSI = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
} as const;

export function colorForDays(days: number | null): string {
  if (days === null) return ANSI.dim;
  if (days < 0) return ANSI.red + ANSI.bold;
  if (days <= 3) return ANSI.red;
  if (days <= 7) return ANSI.yellow;
  return ANSI.green;
}
