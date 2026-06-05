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

/**
 * Per-instance color overrides. Any CSS color string is accepted
 * (hex, rgb, hsl, oklch, var(...), etc.). Provided keys are written
 * as inline CSS variables on the picker root, so they cascade to the
 * popover content too. Omit a key to inherit the theme default.
 */
export interface PickerColors {
  /** Brand color — selected day, today indicator, action buttons */
  primary?: string;
  /** Brand color hover state */
  primaryHover?: string;
  /** Soft brand tint — hover backgrounds, range fills */
  primarySoft?: string;
  /** Footer / muted surface background */
  background?: string;
  /** Calendar / popover background */
  surface?: string;
  /** Day-cell hover background */
  surfaceHover?: string;
  /** Primary text color */
  text?: string;
  /** Muted text color (weekday labels, helper text) */
  textMuted?: string;
  /** Border color */
  border?: string;
  /** Stronger border (dividers, scrollbar thumb) */
  borderStrong?: string;
  /** Danger / clear color */
  danger?: string;
  /** Disabled day color */
  disabled?: string;
  /** Range selection band background */
  rangeBg?: string;
  /** Focus ring color (defaults to primary) */
  focus?: string;
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
  /**
   * Per-instance color overrides — quick way to match a project theme
   * without writing CSS. Each key maps to one of the `--rdk-color-*`
   * variables. Example: `colors={{ primary: '#16a34a', rangeBg: '#dcfce7' }}`
   */
  colors?: PickerColors;
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
  /** Show the leading icon (calendar / clock). Default: `true`. */
  showIcon?: boolean;
  /** Which side the icon sits on. Default: `'left'`. */
  iconPosition?: 'left' | 'right';
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
  /**
   * Position of the month/year navigation header relative to the day
   * grid. Default: `'top'`.
   */
  headerPosition?: 'top' | 'bottom';
  /**
   * Keep the popover open after a date is selected. Default: `true`
   * for single-date pickers (closes on select).
   */
  closeOnSelect?: boolean;
  /**
   * Disable every day before today (today still selectable). Equivalent
   * to setting `minDate` to today.
   */
  disablePast?: boolean;
  /**
   * Disable every day after today (today still selectable). Equivalent
   * to setting `maxDate` to today.
   */
  disableFuture?: boolean;
}

/**
 * Calendar view mode. Only meaningful on single-date pickers.
 * - `'day'` — full calendar grid (default)
 * - `'month'` — only the 12-month grid; clicking commits the 1st of that month
 * - `'year'` — only the 12-year grid; clicking commits January 1 of that year
 */
export type CalendarView = 'day' | 'month' | 'year';

export interface DatePickerProps extends BaseDateProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  /** Calendar view mode. Default: `'day'`. */
  view?: CalendarView;
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
