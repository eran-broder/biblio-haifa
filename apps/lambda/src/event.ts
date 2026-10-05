import { z } from 'zod';

export enum HttpMethod {
  Post = 'POST',
  Options = 'OPTIONS',
}

export const HttpApiEventSchema = z.object({
  requestContext: z.object({
    http: z.object({ method: z.string() }),
  }),
  body: z.string().optional(),
  isBase64Encoded: z.boolean().optional(),
});

export type HttpApiEvent = z.infer<typeof HttpApiEventSchema>;

export function decodeBody(event: HttpApiEvent): string {
  const raw = event.body ?? '';
  return event.isBase64Encoded ? Buffer.from(raw, 'base64').toString('utf8') : raw;
}
