import { FetchErrorCode, toFetchErrorCode } from '@biblio/core';

const MESSAGES: Record<FetchErrorCode, string | null> = {
  [FetchErrorCode.InvalidCredentials]: 'שם משתמש או סיסמה שגויים.',
  [FetchErrorCode.UnexpectedResponse]:
    'אתר הספרייה החזיר תשובה לא צפויה — ייתכן שהאתר השתנה. הפרטים השמורים לא נמחקו, נסו שוב מאוחר יותר.',
  [FetchErrorCode.Network]: 'אין חיבור לאתר הספרייה. בדקו את החיבור ונסו שוב.',
  [FetchErrorCode.Unknown]: null,
};

const FALLBACK = 'שגיאה לא צפויה. נסו שוב.';

export function friendlyMessage(err: unknown): string {
  return MESSAGES[toFetchErrorCode(err)] ?? (err instanceof Error ? err.message : FALLBACK);
}
