import https from 'node:https';
import type { RequestOptions } from 'node:https';
import { extractSessionId } from './cookies.js';

export interface RawResponse {
  body: string;
  statusCode: number;
  sessionId: string | null;
}

export function httpsRequest(
  options: RequestOptions,
  postData: string | null = null,
): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          body: Buffer.concat(chunks).toString('utf8'),
          statusCode: res.statusCode ?? 0,
          sessionId: extractSessionId(res.headers['set-cookie']),
        });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}
