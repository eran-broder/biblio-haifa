import type { CredentialStore, ResultCache } from '@biblio/core';
import { ViewKind } from '../enums.js';
import { useAutoScrape } from '../hooks/use-auto-scrape.js';
import type { ScrapeRunner } from '../hooks/use-scrape.js';
import { Header } from './header.js';
import { LoginForm } from './login-form.js';
import { Loading } from './loading.js';
import { Results } from './results.js';
import { Actions } from './actions.js';

interface Props {
  runScrape: ScrapeRunner;
  credentialStore: CredentialStore;
  resultCache: ResultCache;
}

export function App({ runScrape, credentialStore, resultCache }: Props) {
  const { state, run, refresh, signOut, isRefreshing } = useAutoScrape({
    runner: runScrape,
    credentialStore,
    resultCache,
  });

  const showResults = state.kind === ViewKind.Result;
  const showLogin = state.kind === ViewKind.Idle || state.kind === ViewKind.Error;

  const actions = showResults ? (
    <Actions
      result={state.result}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      onSignOut={signOut}
    />
  ) : null;

  return (
    <div className="app-frame">
      <Header right={actions} />
      {showLogin && (
        <LoginForm
          onSubmit={(creds) => run(creds)}
          isLoading={false}
          error={state.kind === ViewKind.Error ? state.message : undefined}
        />
      )}
      {state.kind === ViewKind.Loading && <Loading />}
      {showResults && <Results result={state.result} isRefreshing={isRefreshing} />}
    </div>
  );
}
