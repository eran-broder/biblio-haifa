import type { FetchResult, Member } from '../schemas.js';
import type { LibraryClient } from '../library/client.js';
import { parseBooks } from '../parsers/books.js';
import { parseFamilyMembers } from '../parsers/family.js';
import { parseMemberName } from '../parsers/member-name.js';
import { ProgressKind } from '../enums.js';
import type { ProgressListener } from './progress.js';

export interface ScrapeOptions {
  username: string;
  password: string;
  client: LibraryClient;
  onProgress?: ProgressListener;
}

export async function scrape(opts: ScrapeOptions): Promise<FetchResult> {
  const { username, password, client, onProgress } = opts;
  const emit = onProgress ?? (() => {});

  emit({ kind: ProgressKind.Login });
  const session = await client.login(username, password);
  emit({ kind: ProgressKind.LoggedIn, userId: session.userId });

  emit({ kind: ProgressKind.FetchingMain });
  const mainHtml = await client.fetchPersonalArea(session, null);

  const primary: Member = {
    name: parseMemberName(mainHtml),
    id: session.userId,
    isPrimary: true,
    books: parseBooks(mainHtml),
  };

  const family = parseFamilyMembers(mainHtml);
  emit({
    kind: ProgressKind.DiscoveredFamily,
    count: family.length,
    names: family.map((f) => f.name),
  });

  const relatives: Member[] = [];
  for (let i = 0; i < family.length; i++) {
    const ref = family[i];
    emit({
      kind: ProgressKind.FetchingMember,
      name: ref.name,
      index: i + 1,
      total: family.length,
    });
    const html = await client.fetchPersonalArea(session, ref.id);
    relatives.push({
      name: parseMemberName(html) || ref.name,
      id: ref.id,
      isPrimary: false,
      books: parseBooks(html),
    });
  }

  const members = [primary, ...relatives];
  const totalBooks = members.reduce((sum, m) => sum + m.books.length, 0);
  emit({ kind: ProgressKind.Done, totalBooks });

  return {
    primaryId: session.userId,
    members,
    totalBooks,
    fetchedAt: new Date().toISOString(),
  };
}
