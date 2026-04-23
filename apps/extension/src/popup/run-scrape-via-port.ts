import {
  FetchErrorCode,
  LibraryNetworkError,
  type Credentials,
  type FetchResult,
  type ProgressEvent,
} from '@biblio/core';
import { MessageKind, SCRAPE_PORT_NAME } from '../messaging/kinds.js';
import { BackgroundToPopupSchema } from '../messaging/schemas.js';
import { deserializeError } from '../messaging/errors.js';

export function runScrapeViaPort(
  creds: Credentials,
  onProgress: (event: ProgressEvent) => void,
): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    const port = chrome.runtime.connect({ name: SCRAPE_PORT_NAME });
    let settled = false;

    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
      try {
        port.disconnect();
      } catch {
        /* already closed */
      }
    };

    port.onMessage.addListener((raw) => {
      const parsed = BackgroundToPopupSchema.safeParse(raw);
      if (!parsed.success) return;
      const msg = parsed.data;
      switch (msg.kind) {
        case MessageKind.Progress:
          onProgress(msg.event);
          return;
        case MessageKind.Result:
          settle(() => resolve(msg.result));
          return;
        case MessageKind.Error:
          settle(() => reject(deserializeError(msg.message, msg.code)));
          return;
      }
    });

    port.onDisconnect.addListener(() => {
      settle(() =>
        reject(
          new LibraryNetworkError(
            chrome.runtime.lastError?.message ?? 'Background worker disconnected.',
          ),
        ),
      );
      void FetchErrorCode.Unknown;
    });

    port.postMessage({ kind: MessageKind.StartScrape, creds });
  });
}
