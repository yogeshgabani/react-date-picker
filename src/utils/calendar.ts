import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  getISOWeek,
} from 'date-fns';
import type { WeekStartsOn } from '../types';

export interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

/**
 * Build a 6-row x 7-col calendar grid for the given month.
 * Always returns 42 days so the height is stable as the user navigates.
 */
export function buildCalendar(
  monthAnchor: Date,
  weekStartsOn: WeekStartsOn,
): CalendarWeek[] {
  const monthStart = startOfMonth(monthAnchor);
  const monthEnd = endOfMonth(monthAnchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

  const weeks: CalendarWeek[] = [];
  let cursor = gridStart;
  let safety = 0;
  while (cursor <= gridEnd && safety < 8) {
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(cursor, i);
      days.push({ date: d, inCurrentMonth: isSameMonth(d, monthAnchor) });
    }
    weeks.push({ weekNumber: getISOWeek(cursor), days });
    cursor = addDays(cursor, 7);
    safety++;
  }
  while (weeks.length < 6) {
    const lastWeek = weeks[weeks.length - 1];
    const nextStart = addDays(lastWeek.days[0].date, 7);
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(nextStart, i);
      days.push({ date: d, inCurrentMonth: isSameMonth(d, monthAnchor) });
    }
    weeks.push({ weekNumber: getISOWeek(nextStart), days });
  }
  return weeks.slice(0, 6);
}

/**
 * Returns weekday short names (e.g. ["Sun","Mon",...]) starting from weekStartsOn.
 */
export function weekdayHeaders(
  weekStartsOn: WeekStartsOn,
  formatter: (d: Date) => string = (d) =>
    d.toLocaleDateString(undefined, { weekday: 'short' }),
): string[] {
  const base = startOfWeek(new Date(2024, 0, 7), { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => formatter(addDays(base, i)));
}
