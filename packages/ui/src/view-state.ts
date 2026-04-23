import type { FetchResult } from '@biblio/core';
import { ViewKind } from './enums.js';

export type ViewState =
  | { kind: ViewKind.Idle }
  | { kind: ViewKind.Loading }
  | { kind: ViewKind.Error; message: string }
  | { kind: ViewKind.Result; result: FetchResult };
