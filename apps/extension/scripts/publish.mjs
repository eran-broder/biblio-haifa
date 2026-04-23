#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');

const REQUIRED = ['EXTENSION_ID', 'CWS_CLIENT_ID', 'CWS_CLIENT_SECRET', 'CWS_REFRESH_TOKEN'];
const ENV_FILE_CANDIDATES = ['.env.local', '.env'];

const USAGE = `Usage: publish.mjs <upload|submit|both> [--trusted-testers]

Requires env vars (can live in .env.local at ${PKG_ROOT}):
  ${REQUIRED.join('\n  ')}

Modes:
  upload         Upload biblio.zip as a new draft version
  submit         Submit the current draft for review (public/unlisted)
  both           Upload then submit

Flags:
  --trusted-testers   Publish only to trusted testers (safe rollout gate)`;

function loadDotenv() {
  for (const name of ENV_FILE_CANDIDATES) {
    const path = resolve(PKG_ROOT, name);
    if (!existsSync(path)) continue;
    for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const m = line.match(/^([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      const [, key, rawValue] = m;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
    }
    return path;
  }
  return null;
}

function assertEnv() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length === 0) return;
  console.error(`\n✗ Missing required env vars: ${missing.join(', ')}`);
  console.error(`  Copy .env.example → .env.local at ${PKG_ROOT} and fill in the values.\n`);
  process.exit(1);
}

function run(args) {
  const r = spawnSync('npx', ['chrome-webstore-upload', ...args], {
    stdio: 'inherit',
    shell: true,
    cwd: PKG_ROOT,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function commonArgs() {
  return [
    '--extension-id', process.env.EXTENSION_ID,
    '--client-id', process.env.CWS_CLIENT_ID,
    '--client-secret', process.env.CWS_CLIENT_SECRET,
    '--refresh-token', process.env.CWS_REFRESH_TOKEN,
  ];
}

function upload() {
  const zipPath = resolve(PKG_ROOT, 'biblio.zip');
  if (!existsSync(zipPath)) {
    console.error(`✗ biblio.zip missing at ${zipPath}`);
    console.error('  Run: pnpm --filter @biblio/extension zip');
    process.exit(1);
  }
  run(['upload', '--source', zipPath, ...commonArgs()]);
}

function submit(trustedTesters) {
  const args = ['publish', ...commonArgs()];
  if (trustedTesters) args.push('--trusted-testers');
  run(args);
}

function main() {
  const mode = process.argv[2];
  const trustedTesters = process.argv.includes('--trusted-testers');
  if (!mode || !['upload', 'submit', 'both'].includes(mode)) {
    console.error(USAGE);
    process.exit(1);
  }
  const envFile = loadDotenv();
  if (envFile) console.log(`loaded env from ${envFile}`);
  assertEnv();
  if (mode === 'upload' || mode === 'both') upload();
  if (mode === 'submit' || mode === 'both') submit(trustedTesters);
}

main();
