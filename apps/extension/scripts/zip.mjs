#!/usr/bin/env node
import { createRequire } from 'node:module';
import { existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const DIST = resolve(PKG_ROOT, 'dist');
const OUT = resolve(PKG_ROOT, 'biblio.zip');

if (!existsSync(DIST)) {
  console.error(`✗ ${DIST} missing — run "pnpm --filter @biblio/extension build" first`);
  process.exit(1);
}

if (existsSync(OUT)) rmSync(OUT);

const zip = new AdmZip();
zip.addLocalFolder(DIST);
zip.writeZip(OUT);

console.log(`✓ wrote ${OUT}`);
