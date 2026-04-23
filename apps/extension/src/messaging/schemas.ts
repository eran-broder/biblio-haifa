import { z } from 'zod';
import {
  CredentialsSchema,
  FetchErrorCode,
  FetchResultSchema,
  ProgressKind,
} from '@biblio/core';
import { MessageKind } from './kinds.js';

const ProgressEventSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal(ProgressKind.Login) }),
  z.object({ kind: z.literal(ProgressKind.LoggedIn), userId: z.string() }),
  z.object({ kind: z.literal(ProgressKind.FetchingMain) }),
  z.object({
    kind: z.literal(ProgressKind.DiscoveredFamily),
    count: z.number().int().nonnegative(),
    names: z.array(z.string()),
  }),
  z.object({
    kind: z.literal(ProgressKind.FetchingMember),
    name: z.string(),
    index: z.number().int().positive(),
    total: z.number().int().positive(),
  }),
  z.object({
    kind: z.literal(ProgressKind.Done),
    totalBooks: z.number().int().nonnegative(),
  }),
]);

export const PopupToBackgroundSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal(MessageKind.StartScrape),
    creds: CredentialsSchema,
  }),
]);

export const BackgroundToPopupSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal(MessageKind.Progress),
    event: ProgressEventSchema,
  }),
  z.object({
    kind: z.literal(MessageKind.Result),
    result: FetchResultSchema,
  }),
  z.object({
    kind: z.literal(MessageKind.Error),
    message: z.string(),
    code: z.nativeEnum(FetchErrorCode),
  }),
]);

export type PopupToBackground = z.infer<typeof PopupToBackgroundSchema>;
export type BackgroundToPopup = z.infer<typeof BackgroundToPopupSchema>;
