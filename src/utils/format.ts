import { format as fnsFormat, isValid } from 'date-fns';
import type { Locale, TimeValue } from '../types';

export function formatDate(
  date: Date | null | undefined,
  fmt = 'MMM d, yyyy',
  locale?: Locale,
): string {
  if (!date || !isValid(date)) return '';
  return fnsFormat(date, fmt, locale ? { locale } : undefined);
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
