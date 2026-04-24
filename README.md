# biblio · ספריות חיפה

A family-size dashboard for the Haifa public library: one login, every household member's borrowed books on one screen, with return-date highlights.

## Install

**Chrome Web Store →** https://chromewebstore.google.com/detail/odeihmnocfngnjkenombkakkajdnenpe

The extension runs the scrape from your own browser on your home IP, so there is no backend to keep alive.

## Repo layout

```
packages/
  core          platform-agnostic scraper, parsers, Zod schemas, enums
  http-node     node:https LibraryClient for the CLI
  http-fetch    browser-fetch LibraryClient for the extension / web
  ui            React components, hooks, styles — shared across surfaces
apps/
  cli           CLI (node + http-node)
  extension     Chrome MV3 — the shipping product
  web           Netlify companion at biblio-haifa.netlify.app (shared UI + HTTP scrape)
```

## Develop

```bash
pnpm install
pnpm ext:dev              # extension in dev mode (load unpacked from apps/extension/dist)
pnpm --filter @biblio/web dev
pnpm cli -- --username ... --password ...
```

## Publish a new extension version

One-time credential setup: see [`apps/extension/PUBLISHING.md`](apps/extension/PUBLISHING.md).

Then every release:

```bash
pnpm --filter @biblio/extension version:patch   # or :minor / :major
pnpm --filter @biblio/extension release
```
