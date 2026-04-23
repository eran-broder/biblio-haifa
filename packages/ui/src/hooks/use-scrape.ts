import { useCallback, useState } from 'react';
import type { Credentials, FetchResult, ProgressEvent } from '@biblio/core';
import { FetchErrorCode, LibraryAuthError } from '@biblio/core';
import { ViewKind } from '../enums.js';
import type { ViewState } from '../view-state.js';

export type ScrapeRunner = (
  creds: Credentials,
  onProgress: (event: ProgressEvent) => void,
) => Promise<FetchResult>;

function friendlyMessage(err: unknown): string {
  if (err instanceof LibraryAuthError) return 'שם משתמש או סיסמה שגויים.';
  if (err instanceof Error) {
    const withCode = err as Error & { code?: FetchErrorCode };
    if (withCode.code === FetchErrorCode.InvalidCredentials) {
      return 'שם משתמש או סיסמה שגויים.';
    }
    return err.message;
  }
  return 'שגיאה לא צפויה. נסה שוב.';
}

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
