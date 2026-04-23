import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CredentialStore,
  Credentials,
  ProgressEvent,
  ResultCache,
} from '@biblio/core';
import { FetchErrorCode, LibraryAuthError } from '@biblio/core';
import { ViewKind } from '../enums.js';
import type { ViewState } from '../view-state.js';
import type { ScrapeRunner } from './use-scrape.js';

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

export interface UseAutoScrape {
  state: ViewState;
  progress: ProgressEvent | null;
  hasStoredCreds: boolean;
  isRefreshing: boolean;
  run: (creds: Credentials) => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
  signOut: () => Promise<void>;
}

export interface UseAutoScrapeOptions {
  runner: ScrapeRunner;
  credentialStore: CredentialStore;
  resultCache: ResultCache;
}

export function useAutoScrape(options: UseAutoScrapeOptions): UseAutoScrape {
  const { runner, credentialStore, resultCache } = options;
  const [state, setState] = useState<ViewState>({ kind: ViewKind.Idle });
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [hasStoredCreds, setHasStoredCreds] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const activeRef = useRef(true);

  const executeScrape = useCallback(
    async (creds: Credentials, opts: { showLoading: boolean }): Promise<void> => {
      if (opts.showLoading) {
        setState({ kind: ViewKind.Loading });
      } else {
        setIsRefreshing(true);
      }
      setProgress(null);
      try {
        const result = await runner(creds, setProgress);
        if (!activeRef.current) return;
        setState({ kind: ViewKind.Result, result });
        await Promise.all([credentialStore.save(creds), resultCache.save(result)]);
        setHasStoredCreds(true);
      } catch (err) {
        if (!activeRef.current) return;
        setState({ kind: ViewKind.Error, message: friendlyMessage(err) });
        if ((err as { code?: FetchErrorCode }).code === FetchErrorCode.InvalidCredentials) {
          await credentialStore.clear();
          setHasStoredCreds(false);
        }
      } finally {
        if (activeRef.current) setIsRefreshing(false);
      }
    },
    [runner, credentialStore, resultCache],
  );

  useEffect(() => {
    activeRef.current = true;
    (async () => {
      const [cached, storedCreds] = await Promise.all([
        resultCache.load(),
        credentialStore.load(),
      ]);
      if (!activeRef.current) return;

      if (cached) setState({ kind: ViewKind.Result, result: cached });
      if (storedCreds) {
        setHasStoredCreds(true);
        void executeScrape(storedCreds, { showLoading: !cached });
      }
    })();
    return () => {
      activeRef.current = false;
    };
  }, [executeScrape, resultCache, credentialStore]);

  const run = useCallback(
    (creds: Credentials) => executeScrape(creds, { showLoading: true }),
    [executeScrape],
  );

  const refresh = useCallback(async () => {
    const creds = await credentialStore.load();
    if (!creds) return;
    await executeScrape(creds, { showLoading: false });
  }, [credentialStore, executeScrape]);

  const reset = useCallback(() => {
    setState({ kind: ViewKind.Idle });
    setProgress(null);
  }, []);

  const signOut = useCallback(async () => {
    await Promise.all([credentialStore.clear(), resultCache.clear()]);
    setHasStoredCreds(false);
    setState({ kind: ViewKind.Idle });
    setProgress(null);
  }, [credentialStore, resultCache]);

  return { state, progress, hasStoredCreds, isRefreshing, run, refresh, reset, signOut };
}
