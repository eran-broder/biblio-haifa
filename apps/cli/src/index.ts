#!/usr/bin/env node
import { formatPlainText, LibraryAuthError, scrape } from '@biblio/core';
import { createNodeLibraryClient } from '@biblio/http-node';
import { ANSI } from './ansi.js';
import { header, fail, ok } from './log.js';
import { renderProgress } from './progress.js';
import { renderResult } from './render-result.js';
import { copyToClipboard } from './clipboard/index.js';
import { MissingCredentialsError, resolveCredentials } from './credentials.js';

async function main(): Promise<void> {
  let username: string;
  let password: string;
  try {
    const creds = resolveCredentials(process.argv);
    username = creds.username;
    password = creds.password;
  } catch (err) {
    if (err instanceof MissingCredentialsError) {
      fail(err.message);
      process.exit(1);
    }
    throw err;
  }

  header('📚 ביבליו · ספריות חיפה');
  console.log(`${ANSI.dim}user:${ANSI.reset} ${username}`);
  console.log();

  try {
    const result = await scrape({
      username,
      password,
      client: createNodeLibraryClient(),
      onProgress: renderProgress,
    });

    renderResult(result);

    if (copyToClipboard(formatPlainText(result))) {
      ok('plain-text summary copied to clipboard');
    } else {
      fail('could not copy to clipboard');
    }
  } catch (err) {
    console.log();
    if (err instanceof LibraryAuthError) {
      fail(err.message);
    } else if (err instanceof Error) {
      fail(`error: ${err.message}`);
    } else {
      fail('unknown error');
    }
    process.exit(1);
  }
}

main();
