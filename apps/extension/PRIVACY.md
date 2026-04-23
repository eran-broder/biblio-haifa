# biblio — Privacy Policy

_Last updated: 2026-04-23_

**biblio** is a Chrome extension that lets you see the books your family has
currently borrowed from the Haifa public libraries. It acts as a viewer on
top of the library's existing web system. This page describes what information
the extension touches, where that information is kept, and what it is used for.

## Summary in one sentence

Your library username and password are stored **only on your own computer**,
used **only** to log in to `haifa.libraries.co.il` on your behalf, and
**never** sent to any server operated by the extension's author.

## What is collected

- **Library credentials**: the username and password you type into the
  extension's login form.
- **Borrowed-books data**: the list of books currently borrowed on your
  library account and its family-member sub-accounts, including titles,
  borrow/return dates and item numbers, as returned by the library itself.

## Where it is stored

- Credentials are stored in your browser's
  [`chrome.storage.local`](https://developer.chrome.com/docs/extensions/reference/api/storage),
  which is a per-device, per-browser store. They are never synced across
  devices and never transmitted outside your computer.
- The most recent borrowed-books result is cached in the same local store so
  the popup can open instantly on next use.

## How it is used

Every time you open the popup (or press refresh), the extension's background
service worker sends your credentials to
`https://haifa.libraries.co.il/` over HTTPS, logs in via the library's own
form, fetches your family's borrowed-books pages, parses them into a list,
and renders them in the popup.

No other network destination is contacted by the extension.

## Third parties

- **Haifa public libraries** (`haifa.libraries.co.il`) — this is the library
  system you are logging into. Your credentials and requests are sent there
  exactly as they would be if you logged in via their website directly. The
  library's own terms and privacy policy apply to that relationship.
- **Google Fonts** (`fonts.googleapis.com`) — the popup loads the Rubik and
  Fraunces web fonts at render time. Only the fonts themselves are fetched;
  no account information is included.

## What is NOT done

- No analytics, telemetry, crash reporting, or usage tracking of any kind.
- No data sold, shared, or sent to any server operated by the extension's
  author.
- No advertising. No ad networks.

## Clearing your data

Press the sign-out icon in the popup's header to clear both your stored
credentials and the cached book list from this browser. Uninstalling the
extension also clears everything.

## Permissions justification

- `storage` — to remember your credentials across popup opens and to cache
  the last result for instant display.
- `host_permissions: https://haifa.libraries.co.il/*` — to log in and fetch
  your borrowed-books page from the library, and to allow the browser to
  manage the library's session cookie on your behalf.

## Contact

Questions or concerns: contact the publisher via the email listed on the
Chrome Web Store listing page.
