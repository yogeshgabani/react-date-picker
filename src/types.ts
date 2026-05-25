import type { Locale } from 'date-fns';
import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type Size = 'sm' | 'md' | 'lg';
export type Direction = 'ltr' | 'rtl';
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface TimeValue {
  hours: number;
  minutes: number;
  seconds?: number;
}

export interface TimeRange {
  start: TimeValue | null;
  end: TimeValue | null;
}

export interface DateTimeRange {
  start: Date | null;
  end: Date | null;
}

export type DisabledDates = Date[] | ((date: Date) => boolean);

export interface Preset {
  label: string;
  range: () => DateRange;
}

export interface BaseProps {
  /** Show inline (always-open calendar) instead of popover */
  inline?: boolean;
  /** Disable the entire picker */
  disabled?: boolean;
  /** Read-only mode — value is shown but cannot be changed */
  readOnly?: boolean;
  /** Allow clearing the value with a small "x" button */
  clearable?: boolean;
  /** Input placeholder when there is no value */
  placeholder?: string;
  /** date-fns Locale object (e.g. `enUS`, `fr`, `de`) */
  locale?: Locale;
  /** Color scheme */
  theme?: Theme;
  /** Size variant */
  size?: Size;
  /** Text direction */
  dir?: Direction;
  /** Extra className for the root wrapper */
  className?: string;
  /** Extra className for the input element */
  inputClassName?: string;
  /** Extra className for the popover/panel */
  popoverClassName?: string;
  /** id attribute for the input */
  id?: string;
  /** name attribute for the input (useful inside forms) */
  name?: string;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
}

export interface BaseDateProps extends BaseProps {
  /** Minimum selectable date (inclusive) */
  minDate?: Date;
  /** Maximum selectable date (inclusive) */
  maxDate?: Date;
  /** Disabled dates — array or predicate */
  disabledDates?: DisabledDates;
  /** date-fns format string for displaying the date */
  format?: string;
  /** First day of the week. 0=Sunday, 1=Monday, ... */
  weekStartsOn?: WeekStartsOn;
  /** Show ISO-8601 week numbers on the calendar */
  showWeekNumbers?: boolean;
  /** Number of months visible side-by-side */
  numberOfMonths?: number;
  /** Custom render for a day cell */
  renderDay?: (date: Date, defaultNode: ReactNode) => ReactNode;
}

export interface DatePickerProps extends BaseDateProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
}

export interface DateRangePickerProps extends BaseDateProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  /** Optional preset quick-select sidebar */
  presets?: Preset[];
  /** Show the default presets sidebar (Today, Last 7 days, etc.) */
  showDefaultPresets?: boolean;
}

export interface BaseTimeProps extends BaseProps {
  /** 12-hour or 24-hour clock */
  hourFormat?: 12 | 24;
  /** Minute increments (e.g. 1, 5, 15, 30) */
  minuteStep?: number;
  /** Second increments (when showSeconds is true) */
  secondStep?: number;
  /** Show seconds column */
  showSeconds?: boolean;
  /** Time format string (date-fns). Auto-derived if omitted. */
  format?: string;
}

export interface TimePickerProps extends BaseTimeProps {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onChange?: (time: TimeValue | null) => void;
}

export interface TimeRangePickerProps extends BaseTimeProps {
  value?: TimeRange;
  defaultValue?: TimeRange;
  onChange?: (range: TimeRange) => void;
}

export interface DateTimePickerProps extends BaseDateProps, BaseTimeProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
}

export interface DateTimeRangePickerProps extends BaseDateProps, BaseTimeProps {
  value?: DateTimeRange;
  defaultValue?: DateTimeRange;
  onChange?: (range: DateTimeRange) => void;
  presets?: Preset[];
  showDefaultPresets?: boolean;
}

export type { Locale };
