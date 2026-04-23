#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const DIST = resolve(PKG_ROOT, 'dist');
const OUT = resolve(PKG_ROOT, 'biblio.zip');

if (!existsSync(DIST)) {
  console.error(`✗ ${DIST} missing — run "pnpm --filter @biblio/extension build" first`);
  process.exit(1);
}

if (existsSync(OUT)) rmSync(OUT);

const r = spawnSync('tar', ['-a', '-c', '-f', 'biblio.zip', '-C', 'dist', '.'], {
  stdio: 'inherit',
  shell: true,
  cwd: PKG_ROOT,
});

if (r.status !== 0) {
  console.error(`✗ tar failed with exit ${r.status}`);
  process.exit(r.status ?? 1);
}

console.log(`✓ wrote ${OUT}`);
