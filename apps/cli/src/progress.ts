import { ProgressKind, type ProgressEvent } from '@biblio/core';
import { info, ok } from './log.js';

export function renderProgress(event: ProgressEvent): void {
  switch (event.kind) {
    case ProgressKind.Login:
      info('logging in…');
      return;
    case ProgressKind.LoggedIn:
      ok(`logged in (id ${event.userId})`);
      return;
    case ProgressKind.FetchingMain:
      info('fetching primary user…');
      return;
    case ProgressKind.DiscoveredFamily:
      ok(
        event.count > 0
          ? `discovered ${event.count} family members: ${event.names.join(', ')}`
          : 'no family members on this account',
      );
      return;
    case ProgressKind.FetchingMember:
      info(`  [${event.index}/${event.total}] ${event.name}…`);
      return;
    case ProgressKind.Done:
      ok(`fetched ${event.totalBooks} books`);
      return;
  }
}
