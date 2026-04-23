# Publishing biblio

The first publish to the Chrome Web Store has to be done by hand. Every
release after that is one command.

## Once, ever

1. **Pay the Chrome Web Store $5 developer fee**
   <https://chrome.google.com/webstore/devconsole/>

2. **Create the listing in the dashboard** — upload `biblio.zip` manually,
   fill in description / screenshots / categories, set visibility to
   **Unlisted**, submit. Grab the **Extension ID** from the final URL.

3. **Create a Google Cloud OAuth client** so the CLI can talk to the Web
   Store API:
   - <https://console.cloud.google.com/> → new project `biblio-publish`
   - APIs & Services → enable **Chrome Web Store API**
   - Credentials → create OAuth client → type **Desktop app** → save
     `client_id` and `client_secret`

4. **Mint a refresh token** (one-time authorization dance):
   Visit in your browser, replacing `YOUR_CLIENT_ID`:
   ```
   https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/chromewebstore
   ```
   Grant → Google shows an authorization code. Exchange it:
   ```bash
   curl -s -X POST https://accounts.google.com/o/oauth2/token \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "code=AUTHORIZATION_CODE" \
     -d "grant_type=authorization_code" \
     -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
   ```
   The JSON response contains `refresh_token` — that is the permanent
   credential.

5. **Save the secrets locally**:
   ```bash
   cp apps/extension/.env.example apps/extension/.env.local
   # fill in EXTENSION_ID, CWS_CLIENT_ID, CWS_CLIENT_SECRET, CWS_REFRESH_TOKEN
   ```

## Every release after that

From the repo root:

```bash
# bump the version (chooses semver segment):
pnpm --filter @biblio/extension version:patch   # 0.2.0 → 0.2.1
pnpm --filter @biblio/extension version:minor   # 0.2.0 → 0.3.0
pnpm --filter @biblio/extension version:major   # 0.2.0 → 1.0.0

# build + zip + upload + submit for review:
pnpm --filter @biblio/extension release
```

Google reviews new versions in 1–3 days.

## Safer rollout

To ship a new version to trusted testers only (list them in the Web Store
dashboard first), use:

```bash
pnpm --filter @biblio/extension release:testers
```

Promote to everyone later with `publish:submit`.

## Individual steps

If you want more control:

```bash
pnpm --filter @biblio/extension build           # compiles dist/
pnpm --filter @biblio/extension zip             # dist/ → biblio.zip
pnpm --filter @biblio/extension publish:upload  # zip → draft in dashboard
pnpm --filter @biblio/extension publish:submit  # draft → submitted for review
```

Inspect the draft in the dashboard before submitting if you want a human gate.

## Notes

- Web Store rejects uploads whose version is ≤ the current live version.
  Run `version:patch` first.
- If the refresh token ever stops working (revoked, Google policy change),
  redo step 4.
- `chrome-webstore-upload` CLI docs:
  <https://github.com/fregante/chrome-webstore-upload-cli>
