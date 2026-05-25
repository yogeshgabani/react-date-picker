import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from 'date-fns';
import type { Preset } from '../types';

export const DEFAULT_PRESETS: Preset[] = [
  {
    label: 'Today',
    range: () => {
      const t = new Date();
      return { start: startOfDay(t), end: endOfDay(t) };
    },
  },
  {
    label: 'Yesterday',
    range: () => {
      const y = subDays(new Date(), 1);
      return { start: startOfDay(y), end: endOfDay(y) };
    },
  },
  {
    label: 'Last 7 days',
    range: () => ({
      start: startOfDay(subDays(new Date(), 6)),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: 'Last 30 days',
    range: () => ({
      start: startOfDay(subDays(new Date(), 29)),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: 'This week',
    range: () => ({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    }),
  },
  {
    label: 'This month',
    range: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Last month',
    range: () => {
      const prev = subMonths(new Date(), 1);
      return { start: startOfMonth(prev), end: endOfMonth(prev) };
    },
  },
  {
    label: 'This year',
    range: () => ({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    }),
  },
];
