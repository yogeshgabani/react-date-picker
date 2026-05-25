import { isSameDay, startOfDay } from 'date-fns';
import type { DisabledDates } from '../types';

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
