import { ProgressKind } from '../enums.js';

export type ProgressEvent =
  | { kind: ProgressKind.Login }
  | { kind: ProgressKind.LoggedIn; userId: string }
  | { kind: ProgressKind.FetchingMain }
  | { kind: ProgressKind.DiscoveredFamily; count: number; names: string[] }
  | { kind: ProgressKind.FetchingMember; name: string; index: number; total: number }
  | { kind: ProgressKind.Done; totalBooks: number };

export type ProgressListener = (event: ProgressEvent) => void;
