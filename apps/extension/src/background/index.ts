import { MessageKind, SCRAPE_PORT_NAME } from '../messaging/kinds.js';
import { PopupToBackgroundSchema } from '../messaging/schemas.js';
import { runScrapeOverPort } from './run-scrape.js';

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== SCRAPE_PORT_NAME) return;

  port.onMessage.addListener((raw) => {
    const parsed = PopupToBackgroundSchema.safeParse(raw);
    if (!parsed.success) {
      port.disconnect();
      return;
    }
    const msg = parsed.data;
    if (msg.kind === MessageKind.StartScrape) {
      void runScrapeOverPort(port, msg.creds);
    }
  });
});
