import { format as fnsFormat, isValid } from 'date-fns';
import type { Locale, TimeValue } from '../types';

export function formatDate(
  date: Date | null | undefined,
  fmt = 'MMM d, yyyy',
  locale?: Locale,
): string {
  if (!date || !isValid(date)) return '';
  return fnsFormat(date, normalizeFormat(fmt), locale ? { locale } : undefined);
}

export function formatTime(
  time: TimeValue | null | undefined,
  hourFormat: 12 | 24 = 24,
  showSeconds = false,
): string {
  if (!time) return '';
  const { hours, minutes, seconds = 0 } = time;
  if (hourFormat === 12) {
    const period = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    const base = `${pad(h12)}:${pad(minutes)}`;
    return showSeconds ? `${base}:${pad(seconds)} ${period}` : `${base} ${period}`;
  }
  const base = `${pad(hours)}:${pad(minutes)}`;
  return showSeconds ? `${base}:${pad(seconds)}` : base;
}

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

export function defaultDateFormat(): string {
  return 'MMM d, yyyy';
}

export function defaultTimeFormat(hourFormat: 12 | 24, showSeconds: boolean): string {
  if (hourFormat === 12) return showSeconds ? 'hh:mm:ss a' : 'hh:mm a';
  return showSeconds ? 'HH:mm:ss' : 'HH:mm';
}

export function defaultDateTimeFormat(
  hourFormat: 12 | 24 = 24,
  showSeconds = false,
): string {
  return `MMM d, yyyy ${defaultTimeFormat(hourFormat, showSeconds)}`;
}

/* ------------------------------------------------------------------ *
 * Moment.js → date-fns token bridge
 *
 * Users frequently pass Moment-style format strings like "DD/MM/YYYY"
 * or "dddd, D MMMM, YYYY". date-fns uses Unicode tokens where `DD`,
 * `YYYY` and `dddd` mean different things, so we translate before
 * handing the string off. Tokens that already match date-fns (MMM, MM,
 * HH, etc.) are passed through unchanged.
 * ------------------------------------------------------------------ */
const TOKEN_MAP: Record<string, string> = {
  // Moment-style → date-fns. Anything not listed here passes through
  // unchanged (so existing date-fns formats like `MMM d, yyyy` keep
  // working).
  YYYY: 'yyyy',
  YY: 'yy',
  DD: 'dd',
  D: 'd',
  dddd: 'EEEE',
  ddd: 'EEE',
  // AM/PM — Moment `A` is uppercase, `a` is lowercase
  A: 'a',
  a: 'aaa',
};

// Tokens are tried left-to-right; longest variants must appear first so
// `YYYY` wins over `YY`, `dddd` wins over `ddd`/`dd`/`d`, etc. The list
// covers both Moment-style and date-fns-style tokens so users can mix
// either flavor freely.
const TOKEN_RE =
  /YYYY|YYY|YY|Y|yyyy|yyy|yy|y|MMMM|MMM|MM|M|DDDD|DDD|DD|D|dddd|ddd|dd|d|EEEEEE|EEEEE|EEEE|EEE|EE|E|HH|H|hh|h|mm|m|ss|s|A|a/g;

export function normalizeFormat(fmt: string): string {
  if (!fmt) return fmt;
  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(fmt)) !== null) {
    result += escapeLiteral(fmt.slice(lastIndex, match.index));
    result += TOKEN_MAP[match[0]] ?? match[0];
    lastIndex = match.index + match[0].length;
  }
  result += escapeLiteral(fmt.slice(lastIndex));
  return result;
}

function escapeLiteral(part: string): string {
  if (!part) return '';
  return part.replace(/[a-zA-Z]+/g, (run) => `'${run.replace(/'/g, "''")}'`);
}
