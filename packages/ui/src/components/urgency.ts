import { StampTone } from '@biblio/core';

const TONE_MODIFIER: Record<StampTone, string> = {
  [StampTone.Overdue]: 'overdue',
  [StampTone.Urgent]: 'urgent',
  [StampTone.Soon]: 'soon',
  [StampTone.Safe]: '',
};

export function toneForDays(days: number | null): StampTone {
  if (days === null) return StampTone.Safe;
  if (days < 0) return StampTone.Overdue;
  if (days <= 3) return StampTone.Urgent;
  if (days <= 7) return StampTone.Soon;
  return StampTone.Safe;
}

export function dueChipClass(days: number | null): string {
  const modifier = TONE_MODIFIER[toneForDays(days)];
  return modifier ? `due-chip ${modifier}` : 'due-chip';
}
