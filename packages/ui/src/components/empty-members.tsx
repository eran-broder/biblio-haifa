import type { Member } from '@biblio/core';

interface Props {
  members: readonly Member[];
}

export function EmptyMembers({ members }: Props) {
  if (members.length === 0) return null;
  return (
    <div className="empty-chip">
      <span className="empty-chip-label">ללא ספרים</span>
      <span className="empty-chip-names">{members.map((m) => m.name).join(' · ')}</span>
    </div>
  );
}
