import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@biblio/ui';
import './web-shell.css';
import { createLocalCredentialStore, createLocalResultCache } from './storage/index.js';
import { runScrapeViaHttp } from './run-scrape-via-http.js';

const credentialStore = createLocalCredentialStore();
const resultCache = createLocalResultCache();

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <div className="web-shell">
      <App
        runScrape={runScrapeViaHttp}
        credentialStore={credentialStore}
        resultCache={resultCache}
      />
    </div>
  </React.StrictMode>,
);
