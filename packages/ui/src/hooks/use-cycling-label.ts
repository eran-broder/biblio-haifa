import { useEffect, useState } from 'react';

export function useCyclingLabel(labels: readonly string[], intervalMs: number): string {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (labels.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % labels.length), intervalMs);
    return () => clearInterval(id);
  }, [labels, intervalMs]);
  return labels[index] ?? '';
}
