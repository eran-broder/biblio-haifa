import { z } from 'zod';
import { FetchErrorCode } from './enums.js';

export const BookSchema = z.object({
  title: z.string(),
  itemNumber: z.string(),
  loanDate: z.string(),
  returnDate: z.string(),
  notes: z.string(),
});

export const MemberSchema = z.object({
  name: z.string(),
  id: z.string(),
  isPrimary: z.boolean(),
  books: z.array(BookSchema),
});

export const FetchResultSchema = z.object({
  primaryId: z.string(),
  members: z.array(MemberSchema),
  totalBooks: z.number().int().nonnegative(),
  fetchedAt: z.string(),
});

export const FetchErrorSchema = z.object({
  error: z.string(),
  code: z.nativeEnum(FetchErrorCode),
});

export type Book = z.infer<typeof BookSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type FetchResult = z.infer<typeof FetchResultSchema>;
export type FetchErrorPayload = z.infer<typeof FetchErrorSchema>;

export const CredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type Credentials = z.infer<typeof CredentialsSchema>;
