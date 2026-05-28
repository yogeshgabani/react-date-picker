import { parse as fnsParse, isValid } from 'date-fns';
import type { Locale, TimeValue } from '../types';
import { normalizeFormat } from './format';

/**
 * Lenient date parser — tries the user-supplied format first, then a list of
 * common fallbacks. Returns null if nothing parses cleanly. Accepts both
 * Moment-style (`DD/MM/YYYY`) and date-fns-style (`dd/MM/yyyy`) tokens.
 */
export function parseDate(
  input: string,
  fmt: string,
  locale?: Locale,
): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const tries = [
    normalizeFormat(fmt),
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'MMM d, yyyy',
  ];
  const ref = new Date();
  for (const f of tries) {
    const d = fnsParse(trimmed, f, ref, locale ? { locale } : undefined);
    if (isValid(d)) return d;
  }
  const native = new Date(trimmed);
  if (isValid(native)) return native;
  return null;
}

const TIME_RE = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(am|pm|AM|PM)?$/;

export function parseTime(input: string): TimeValue | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const m = trimmed.match(TIME_RE);
  if (!m) return null;
  let hours = Number(m[1]);
  const minutes = Number(m[2]);
  const seconds = m[3] !== undefined ? Number(m[3]) : 0;
  const period = m[4]?.toLowerCase();
  if (period === 'pm' && hours < 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return null;
  }
  return { hours, minutes, seconds };
}
