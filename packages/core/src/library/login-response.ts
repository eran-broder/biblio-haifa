import { LoginOutcome } from '../enums.js';
import { LibraryAuthError, LibraryUnexpectedResponseError } from '../errors.js';

export type LoginResponse =
  | { outcome: LoginOutcome.Accepted; userId: string }
  | { outcome: LoginOutcome.Rejected }
  | { outcome: LoginOutcome.Unrecognized };

const CNUMBER_RE = /CNumber=(\d+)/;
const EMPTY_LOGIN_FORM_RE = /<form method="post">\s*<\/form>/i;

export function classifyLoginResponse(body: string): LoginResponse {
  const m = body.match(CNUMBER_RE);
  if (m) return { outcome: LoginOutcome.Accepted, userId: m[1] };
  if (EMPTY_LOGIN_FORM_RE.test(body)) return { outcome: LoginOutcome.Rejected };
  return { outcome: LoginOutcome.Unrecognized };
}

export function userIdFromLoginResponse(body: string): string {
  const response = classifyLoginResponse(body);
  switch (response.outcome) {
    case LoginOutcome.Accepted:
      return response.userId;
    case LoginOutcome.Rejected:
      throw new LibraryAuthError();
    case LoginOutcome.Unrecognized:
      throw new LibraryUnexpectedResponseError(
        'The library login page returned an unexpected response — the site may have changed.',
      );
  }
}
