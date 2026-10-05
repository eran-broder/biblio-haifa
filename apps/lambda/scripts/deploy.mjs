#!/usr/bin/env node
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(PKG_ROOT, 'dist');
const ZIP = resolve(PKG_ROOT, 'function.zip');

const FUNCTION_NAME = 'biblio-fetch-books';
const REGION = 'il-central-1';
const PROFILE = process.env.BIBLIO_AWS_PROFILE ?? 'library';

function zipDist() {
  if (!existsSync(resolve(DIST, 'index.mjs'))) {
    console.error(`✗ ${DIST}/index.mjs missing — run "pnpm --filter @biblio/lambda build" first`);
    process.exit(1);
  }
  const zip = new AdmZip();
  zip.addLocalFolder(DIST);
  zip.writeZip(ZIP);
}

function aws(args) {
  const r = spawnSync('aws', [...args, '--region', REGION, '--profile', PROFILE], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

zipDist();
aws(['lambda', 'update-function-code', '--function-name', FUNCTION_NAME, '--zip-file', `fileb://${ZIP}`]);
aws(['lambda', 'wait', 'function-updated-v2', '--function-name', FUNCTION_NAME]);
console.log(`✓ deployed ${FUNCTION_NAME} (${REGION}, profile ${PROFILE})`);
