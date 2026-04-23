import { relativeTimeSince } from './relative-time.js';

interface Props {
  totalBooks: number;
  readerCount: number;
  fetchedAt: string;
  isRefreshing: boolean;
}

export function Hero({ totalBooks, readerCount, fetchedAt, isRefreshing }: Props) {
  const readers = readerCount === 1 ? 'קורא/ת אחד/ת' : `${readerCount} קוראים`;
  const metaClass = isRefreshing ? 'hero-meta hero-meta-refreshing' : 'hero-meta';
  const metaText = isRefreshing ? 'מתעדכן עכשיו…' : `עודכן ${relativeTimeSince(fetchedAt)}`;

  return (
    <div className="hero">
      <div className="hero-stack">
        <div className="hero-digit">{totalBooks}</div>
        <div className="hero-underline" aria-hidden="true" />
        <div className="hero-label">ספרים מושאלים · {readers}</div>
      </div>
      <div className={metaClass}>{metaText}</div>
    </div>
  );
}
