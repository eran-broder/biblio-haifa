#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MANIFEST = resolve(HERE, '..', 'src', 'manifest.ts');
const PACKAGE = resolve(HERE, '..', 'package.json');

const KINDS = new Set(['major', 'minor', 'patch']);
const VERSION_RE = /version:\s*'(\d+)\.(\d+)\.(\d+)'/;

function bump(current, kind) {
  let [major, minor, patch] = current.split('.').map(Number);
  if (kind === 'major') { major++; minor = 0; patch = 0; }
  else if (kind === 'minor') { minor++; patch = 0; }
  else { patch++; }
  return `${major}.${minor}.${patch}`;
}

function updateManifest(nextVersion) {
  const src = readFileSync(MANIFEST, 'utf8');
  const match = src.match(VERSION_RE);
  if (!match) throw new Error(`Could not find version string in ${MANIFEST}`);
  const current = `${match[1]}.${match[2]}.${match[3]}`;
  const updated = src.replace(VERSION_RE, `version: '${nextVersion}'`);
  writeFileSync(MANIFEST, updated);
  return current;
}

function updatePackageJson(nextVersion) {
  const raw = readFileSync(PACKAGE, 'utf8');
  const data = JSON.parse(raw);
  const current = data.version;
  data.version = nextVersion;
  writeFileSync(PACKAGE, JSON.stringify(data, null, 2) + '\n');
  return current;
}

function main() {
  const kind = process.argv[2] ?? 'patch';
  if (!KINDS.has(kind)) {
    console.error(`Usage: bump-version.mjs <major|minor|patch>`);
    process.exit(1);
  }
  const manifestSrc = readFileSync(MANIFEST, 'utf8');
  const match = manifestSrc.match(VERSION_RE);
  if (!match) {
    console.error(`Could not find version string in ${MANIFEST}`);
    process.exit(1);
  }
  const currentVersion = `${match[1]}.${match[2]}.${match[3]}`;
  const nextVersion = bump(currentVersion, kind);
  updateManifest(nextVersion);
  updatePackageJson(nextVersion);
  console.log(`bumped ${currentVersion} → ${nextVersion}`);
}

main();
