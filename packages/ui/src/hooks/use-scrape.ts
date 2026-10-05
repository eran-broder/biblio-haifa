import { useCallback, useState } from 'react';
import type { Credentials, FetchResult, ProgressEvent } from '@biblio/core';
import { ViewKind } from '../enums.js';
import type { ViewState } from '../view-state.js';
import { friendlyMessage } from './friendly-message.js';

export type ScrapeRunner = (
  creds: Credentials,
  onProgress: (event: ProgressEvent) => void,
) => Promise<FetchResult>;

export interface UseScrape {
  state: ViewState;
  progress: ProgressEvent | null;
  run: (creds: Credentials) => Promise<void>;
  reset: () => void;
}

export function useScrape(runner: ScrapeRunner): UseScrape {
  const [state, setState] = useState<ViewState>({ kind: ViewKind.Idle });
  const [progress, setProgress] = useState<ProgressEvent | null>(null);

  const run = useCallback(
    async (creds: Credentials) => {
      setState({ kind: ViewKind.Loading });
      setProgress(null);
      try {
        const result = await runner(creds, setProgress);
        setState({ kind: ViewKind.Result, result });
      } catch (err) {
        setState({ kind: ViewKind.Error, message: friendlyMessage(err) });
      }
    },
    [runner],
  );

  const reset = useCallback(() => {
    setState({ kind: ViewKind.Idle });
    setProgress(null);
  }, []);

  return { state, progress, run, reset };
}
