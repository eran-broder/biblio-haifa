import { scrape, type Credentials, type ProgressEvent } from '@biblio/core';
import { createFetchLibraryClient } from '@biblio/http-fetch';
import { MessageKind } from '../messaging/kinds.js';
import type { BackgroundToPopup } from '../messaging/schemas.js';
import { serializeError } from '../messaging/errors.js';

export async function runScrapeOverPort(
  port: chrome.runtime.Port,
  creds: Credentials,
): Promise<void> {
  const send = (msg: BackgroundToPopup) => port.postMessage(msg);
  const emitProgress = (event: ProgressEvent) => send({ kind: MessageKind.Progress, event });

  try {
    const result = await scrape({
      username: creds.username,
      password: creds.password,
      client: createFetchLibraryClient(),
      onProgress: emitProgress,
    });
    send({ kind: MessageKind.Result, result });
  } catch (err) {
    const { message, code } = serializeError(err);
    send({ kind: MessageKind.Error, message, code });
  } finally {
    port.disconnect();
  }
}
