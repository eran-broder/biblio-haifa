import { App } from '@biblio/ui';
import { createChromeCredentialStore, createChromeResultCache } from '../storage/index.js';
import { runScrapeViaPort } from './run-scrape-via-port.js';

const credentialStore = createChromeCredentialStore();
const resultCache = createChromeResultCache();

export function Popup() {
  return (
    <App
      runScrape={runScrapeViaPort}
      credentialStore={credentialStore}
      resultCache={resultCache}
    />
  );
}
