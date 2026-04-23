export function Loading() {
  return (
    <div className="loading-wrap">
      <Spinner />
      <div className="loading-label pulse-soft">טוען…</div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="spin-slow">
      <circle
        cx="11"
        cy="11"
        r="8"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray="32 24"
      />
    </svg>
  );
}
