import { endOfDay, isSameDay, startOfDay } from 'date-fns';
import type { DisabledDates } from '../types';

/**
 * Merge an explicit `minDate` / `maxDate` with the optional
 * `disablePast` / `disableFuture` flags. Today is always inclusive
 * — the bounds resolve to `startOfDay(today)` / `endOfDay(today)`.
 * When both an explicit bound and a flag are set, the tighter of
 * the two wins.
 */
export function effectiveDateBounds(opts: {
  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
}): { minDate?: Date; maxDate?: Date } {
  let { minDate, maxDate } = opts;
  if (opts.disablePast) {
    const today = startOfDay(new Date());
    minDate = minDate && minDate > today ? minDate : today;
  }
  if (opts.disableFuture) {
    const today = endOfDay(new Date());
    maxDate = maxDate && maxDate < today ? maxDate : today;
  }
  return { minDate, maxDate };
}

export function isDateDisabled(
  date: Date,
  opts: {
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: DisabledDates;
  },
): boolean {
  const d = startOfDay(date);
  if (opts.minDate && d < startOfDay(opts.minDate)) return true;
  if (opts.maxDate && d > startOfDay(opts.maxDate)) return true;
  const disabled = opts.disabledDates;
  if (!disabled) return false;
  if (typeof disabled === 'function') return disabled(date);
  return disabled.some((x) => isSameDay(x, date));
}

export function clampDate(date: Date, minDate?: Date, maxDate?: Date): Date {
  if (minDate && date < minDate) return minDate;
  if (maxDate && date > maxDate) return maxDate;
  return date;
}
