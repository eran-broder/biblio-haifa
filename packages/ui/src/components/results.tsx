import { flattenByDueDate, type FetchResult, type Member } from '@biblio/core';
import { BookList } from './book-list.js';
import { EmptyMembers } from './empty-members.js';
import { Hero } from './hero.js';

interface Props {
  result: FetchResult;
  isRefreshing?: boolean;
}

function inactiveMembers(members: readonly Member[]): Member[] {
  return members.filter((m) => m.books.length === 0);
}

function activeReaderCount(members: readonly Member[]): number {
  return members.filter((m) => m.books.length > 0).length;
}

export function Results({ result, isRefreshing = false }: Props) {
  const entries = flattenByDueDate(result);
  const empty = inactiveMembers(result.members);
  return (
    <div>
      <Hero
        totalBooks={result.totalBooks}
        readerCount={activeReaderCount(result.members)}
        fetchedAt={result.fetchedAt}
        isRefreshing={isRefreshing}
      />
      <BookList entries={entries} />
      <EmptyMembers members={empty} />
    </div>
  );
}
