<div align="center">

# react-datetime-kit

A modern, accessible, **headless-inside / pretty-outside** date &amp; time picker toolkit for React. Six picker variants share one API, one theming model, and one keyboard-/screen-reader–friendly core.

[![npm](https://img.shields.io/npm/v/react-upload-pro.svg?color=4f46e5&style=flat-square)](https://www.npmjs.com/package/react-datetime-kit)
[![types](https://img.shields.io/badge/types-included-3178c6?style=flat-square)](#typescript)
[![license](https://img.shields.io/badge/license-MIT-emerald?style=flat-square)](./LICENSE)
[![bundle](https://img.shields.io/badge/tree--shakable-✓-10b981?style=flat-square)](#performance)

</div>

## 🚀 Live Demo

**👉 [react-datetime-picker.netlify.app](https://react-datetime-picker.netlify.app/)**

```
DatePicker · DateRangePicker · TimePicker · TimeRangePicker
DateTimePicker · DateTimeRangePicker
```

- 🎯 **TypeScript-first** — strict types for every prop and event
- ♿ **A11y by default** — WAI-ARIA roles, full keyboard nav, focus trap, screen-reader labels
- 🎨 **CSS-variable theming** — no design-system lock-in, drop your own tokens
- 🌍 **i18n + RTL** — full `date-fns` locale support, configurable first day of week
- ⚡ **Tiny, tree-shakeable** — uses Floating UI for positioning, `date-fns` as a peer dep
- 🧩 **Headless inner hooks** — `useDatePicker`, `useDateRange`, `useTimePicker` for custom UIs
- 🌗 **Light + dark themes** out of the box (auto + manual override)

---

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Pickers](#pickers)
  - [`DatePicker`](#datepicker)
  - [`DateRangePicker`](#daterangepicker)
  - [`TimePicker`](#timepicker)
  - [`TimeRangePicker`](#timerangepicker)
  - [`DateTimePicker`](#datetimepicker)
  - [`DateTimeRangePicker`](#datetimerangepicker)
- [Common props](#common-props)
- [Date-picker props](#date-picker-props)
- [Time-picker props](#time-picker-props)
- [All props at a glance (kitchen sink)](#all-props-at-a-glance-kitchen-sink)
- [Custom format (Moment-style tokens)](#custom-format-moment-style-tokens)
- [Theming](#theming)
- [Dark mode](#dark-mode)
- [Localization](#localization)
- [Custom day rendering](#custom-day-rendering)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Headless hooks (advanced)](#headless-hooks-advanced)
- [TypeScript types](#typescript-types)
- [Browser support](#browser-support)
- [Changelog](#changelog)
- [License](#license)

---

## Installation

```bash
npm install react-datetime-kit
# or
yarn add react-datetime-kit
# or
pnpm add react-datetime-kit
```

Peer dependencies (install if your project does not already have them):

```bash
npm install react react-dom date-fns
```

| Dependency  | Version |
| ----------- | ------- |
| `react`     | `>=17`  |
| `react-dom` | `>=17`  |
| `date-fns`  | `>=2`   |

Then import the stylesheet **once** (typically at your app entry):

```ts
import "react-datetime-kit/styles.css";
```

---

## Quick start

```tsx
import { useState } from "react";
import { DatePicker } from "react-datetime-kit";
import "react-datetime-kit/styles.css";

export function App() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Pick a date"
      clearable
    />
  );
}
```

That's it. The picker is controlled — you own the state and pass `value` / `onChange`. Skip `value` and pass `defaultValue` instead for uncontrolled mode.

---

## Pickers

### `DatePicker`

Single calendar-date picker. Popover by default, `inline` for an always-open calendar.

```tsx
import { DatePicker } from "react-datetime-kit";

<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date("2024-01-01")}
  maxDate={new Date("2026-12-31")}
  disabledDates={(d) => d.getDay() === 0} // disable Sundays
  weekStartsOn={1} // Monday-first calendar
  numberOfMonths={2} // two-month view
  showWeekNumbers
  clearable
  placeholder="Select a date"
/>;

{
  /* Inline / always-open variant */
}
<DatePicker inline value={date} onChange={setDate} />;
```

### `DateRangePicker`

Two-date range with hover preview and optional quick-select sidebar.

```tsx
import { useState } from "react";
import { DateRangePicker } from "react-datetime-kit";
import type { DateRange } from "react-datetime-kit";

const [range, setRange] = useState<DateRange>({ start: null, end: null });

<DateRangePicker
  value={range}
  onChange={setRange}
  numberOfMonths={2}
  showDefaultPresets // Today, Yesterday, Last 7 days, Last 30 days,
  // This week, This month, Last month, This year
  clearable
/>;

{
  /* Custom presets */
}
<DateRangePicker
  value={range}
  onChange={setRange}
  presets={[
    {
      label: "Q1 2026",
      range: () => ({
        start: new Date(2026, 0, 1),
        end: new Date(2026, 2, 31),
      }),
    },
    {
      label: "Q2 2026",
      range: () => ({
        start: new Date(2026, 3, 1),
        end: new Date(2026, 5, 30),
      }),
    },
  ]}
/>;
```

### `TimePicker`

Hour + minute (and optional seconds) column picker.

```tsx
import { TimePicker } from "react-datetime-kit";
import type { TimeValue } from "react-datetime-kit";

const [time, setTime] = useState<TimeValue | null>({ hours: 9, minutes: 30 });

<TimePicker
  value={time}
  onChange={setTime}
  hourFormat={12} // 12 or 24 (default: 24)
  minuteStep={5} // 1 | 5 | 15 | 30 …
  showSeconds // adds seconds column
  clearable
/>;
```

### `TimeRangePicker`

Two `TimePicker`s side-by-side for a start/end window.

```tsx
import { TimeRangePicker } from "react-datetime-kit";
import type { TimeRange } from "react-datetime-kit";

const [range, setRange] = useState<TimeRange>({
  start: { hours: 9, minutes: 0 },
  end: { hours: 17, minutes: 0 },
});

<TimeRangePicker
  value={range}
  onChange={setRange}
  hourFormat={24}
  minuteStep={15}
  clearable
/>;
```

### `DateTimePicker`

Calendar + time columns in one popover. Returns a single `Date` (date and time merged).

```tsx
import { DateTimePicker } from "react-datetime-kit";

<DateTimePicker
  value={dt}
  onChange={setDt}
  hourFormat={12}
  minuteStep={5}
  showSeconds={false}
  clearable
/>;
```

### `DateTimeRangePicker`

Range picker with separate start/end time editors. Returns `{ start, end }` of `Date`.

```tsx
import { DateTimeRangePicker } from "react-datetime-kit";
import type { DateRange } from "react-datetime-kit";

const [range, setRange] = useState<DateRange>({ start: null, end: null });

<DateTimeRangePicker
  value={range}
  onChange={setRange}
  numberOfMonths={2}
  hourFormat={24}
  minuteStep={15}
  showDefaultPresets
  clearable
/>;
```

---

## Common props

These props are shared by every picker.

| Prop               | Type                          | Default     | Description                                                            |
| ------------------ | ----------------------------- | ----------- | ---------------------------------------------------------------------- |
| `inline`           | `boolean`                     | `false`     | Render an always-open calendar instead of an input + popover.          |
| `disabled`         | `boolean`                     | `false`     | Disable the whole picker.                                              |
| `readOnly`         | `boolean`                     | `false`     | Show the value but prevent edits.                                      |
| `clearable`        | `boolean`                     | `false`     | Show an `×` button on the input when a value exists.                   |
| `placeholder`      | `string`                      | (varies)    | Input placeholder when there is no value.                              |
| `size`             | `'sm' \| 'md' \| 'lg'`        | `'md'`      | Input size variant.                                                    |
| `theme`            | `'light' \| 'dark' \| 'auto'` | `'auto'`    | Color scheme override. `'auto'` follows OS / data attribute.           |
| `dir`              | `'ltr' \| 'rtl'`              | `'ltr'`     | Text direction.                                                        |
| `locale`           | `Locale`                      | (en-US-ish) | A [`date-fns` Locale](https://date-fns.org/v3.6.0/docs/Locale) object. |
| `className`        | `string`                      | —           | Extra `className` on the root wrapper.                                 |
| `inputClassName`   | `string`                      | —           | Extra `className` on the `<input>` element.                            |
| `popoverClassName` | `string`                      | —           | Extra `className` on the floating panel.                               |
| `id`               | `string`                      | —           | `id` attribute for the input.                                          |
| `name`             | `string`                      | —           | `name` attribute (useful inside `<form>`).                             |
| `autoFocus`        | `boolean`                     | `false`     | Focus the input on mount.                                              |
| `showIcon`         | `boolean`                     | `true`      | Show the leading calendar / clock icon.                                |
| `iconPosition`     | `'left' \| 'right'`           | `'left'`    | Which side the icon sits on.                                           |
| `colors`           | `PickerColors`                | —           | Per-instance color overrides. See [Theming](#theming).                 |

## Date-picker props

Apply to `DatePicker`, `DateRangePicker`, `DateTimePicker`, `DateTimeRangePicker`.

| Prop              | Type                             | Default          | Description                                                                                                                                                                              |
| ----------------- | -------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`           | `Date \| null` _or_ `DateRange`  | —                | Controlled value (range variants use `{ start, end }`).                                                                                                                                  |
| `defaultValue`    | same as `value`                  | —                | Uncontrolled initial value.                                                                                                                                                              |
| `onChange`        | `(v) => void`                    | —                | Fires on selection change.                                                                                                                                                               |
| `minDate`         | `Date`                           | —                | Earliest selectable date (inclusive).                                                                                                                                                    |
| `maxDate`         | `Date`                           | —                | Latest selectable date (inclusive).                                                                                                                                                      |
| `disabledDates`   | `Date[] \| (d: Date) => boolean` | —                | Disable individual dates or by predicate.                                                                                                                                                |
| `format`          | `string`                         | locale default   | Display format string. Accepts both **Moment-style** tokens (`DD/MM/YYYY`, `dddd, D MMMM, YYYY`) and `date-fns` Unicode tokens. See [Custom format](#custom-format-moment-style-tokens). |
| `weekStartsOn`    | `0..6`                           | `0` (Sun)        | First day of the week.                                                                                                                                                                   |
| `showWeekNumbers` | `boolean`                        | `false`          | Show ISO-8601 week numbers in the calendar.                                                                                                                                              |
| `numberOfMonths`  | `number`                         | `1` (range: `2`) | Months visible side-by-side.                                                                                                                                                             |
| `renderDay`       | `(d, defaultNode) => ReactNode`  | —                | Custom render for a day cell — see [Custom day rendering](#custom-day-rendering).                                                                                                        |
| `headerPosition`  | `'top' \| 'bottom'`              | `'top'`          | Position of the month/year navigation header relative to the day grid.                                                                                                                   |
| `closeOnSelect`   | `boolean`                        | `true`           | Close the popover after a date is selected (single-date pickers only — `DateTimePicker`/`DateTimeRangePicker` use an explicit Done button).                                              |
| `disablePast`     | `boolean`                        | `false`          | Disable every day before today. Today remains selectable.                                                                                                                                |
| `disableFuture`   | `boolean`                        | `false`          | Disable every day after today. Today remains selectable.                                                                                                                                 |

`DatePicker` additionally accepts:

| Prop   | Type                         | Default | Description                                                                                                                                                            |
| ------ | ---------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `view` | `'day' \| 'month' \| 'year'` | `'day'` | Calendar view mode. `'month'` shows a 12-month grid (clicking commits the 1st of that month); `'year'` shows a 12-year grid (clicking commits January 1 of that year). |

Range variants additionally accept:

| Prop                 | Type       | Description                                                   |
| -------------------- | ---------- | ------------------------------------------------------------- |
| `presets`            | `Preset[]` | Custom quick-select sidebar entries.                          |
| `showDefaultPresets` | `boolean`  | Show built-in presets (Today, Last 7 days, This month, etc.). |

```ts
// Preset shape
interface Preset {
  label: string;
  range: () => { start: Date | null; end: Date | null };
}
```

## Time-picker props

Apply to `TimePicker`, `TimeRangePicker`, `DateTimePicker`, `DateTimeRangePicker`.

| Prop          | Type       | Default      | Description                                                                                                           |
| ------------- | ---------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `hourFormat`  | `12 \| 24` | `24`         | 12-hour clock with AM/PM toggle, or 24-hour clock.                                                                    |
| `minuteStep`  | `number`   | `1`          | Minute increments (e.g. `5`, `15`, `30`).                                                                             |
| `secondStep`  | `number`   | `1`          | Second increments (only used when `showSeconds`).                                                                     |
| `showSeconds` | `boolean`  | `false`      | Show the seconds column.                                                                                              |
| `format`      | `string`   | auto-derived | Custom format string for the input display — same token rules as [Custom format](#custom-format-moment-style-tokens). |

---

## All props at a glance (kitchen sink)

Below is **every prop** the components accept, with an inline comment
explaining what it does and what the default is. Copy this block into
your project as a starting reference — delete the lines you don't need.

```tsx
import { useState } from "react";
import { enUS } from "date-fns/locale";
import {
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
} from "react-datetime-kit";
import type { DateRange, TimeValue, TimeRange } from "react-datetime-kit";

function KitchenSink() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [time, setTime] = useState<TimeValue | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: null,
    end: null,
  });

  return (
    <DatePicker
      // ─── value ────────────────────────────────────────────────
      value={date} // controlled value (Date | null)
      defaultValue={null} // uncontrolled initial value
      onChange={setDate} // (d: Date | null) => void
      // ─── display / behavior ──────────────────────────────────
      inline={false} // true → always-open calendar, no input
      disabled={false} // disable the whole picker
      readOnly={false} // show value but prevent edits
      clearable={true} // show × button when value is set
      placeholder="Select date" // input placeholder text
      autoFocus={false} // focus the input on mount
      id="dob" // id attr on the input
      name="dob" // name attr (forms)
      // ─── styling / theming ───────────────────────────────────
      size="md" // 'sm' | 'md' | 'lg'
      theme="auto" // 'light' | 'dark' | 'auto'
      dir="ltr" // 'ltr' | 'rtl'
      className="" // extra class on root wrapper
      inputClassName="" // extra class on <input>
      popoverClassName="" // extra class on floating panel
      colors={{
        // per-instance CSS-var overrides
        primary: "#7c3aed", //   selected day, Today button
        primaryHover: "#6d28d9", //   primary hover state
        primarySoft: "#f3e8ff", //   day-hover background
        background: "#fafafa", //   footer / muted surface
        surface: "#ffffff", //   popover background
        surfaceHover: "#f5f3ff", //   row hover background
        text: "#18181b", //   primary text
        textMuted: "#71717a", //   labels / helper text
        border: "#e4e4e7", //   borders / dividers
        borderStrong: "#d4d4d8", //   strong border / scrollbar thumb
        danger: "#ef4444", //   clear button hover
        disabled: "#d4d4d8", //   disabled day color
        rangeBg: "#f3e8ff", //   between range start & end
        focus: "#7c3aed", //   focus ring (defaults to primary)
      }}
      // ─── icon ────────────────────────────────────────────────
      showIcon={true} // false → hide the leading icon
      iconPosition="left" // 'left' | 'right'
      // ─── date constraints ────────────────────────────────────
      minDate={new Date(2020, 0, 1)} // earliest selectable (inclusive)
      maxDate={new Date(2030, 11, 31)} // latest selectable (inclusive)
      disabledDates={(d) => d.getDay() === 0} // Date[] | (d: Date) => boolean
      disablePast={false} // true → all days before today disabled
      disableFuture={false} // true → all days after today disabled
      // ─── display format ──────────────────────────────────────
      format="DD/MM/YYYY" // Moment-style or date-fns tokens
      locale={enUS} // date-fns Locale (enUS, fr, de, …)
      // ─── calendar layout ─────────────────────────────────────
      view="day" // 'day' | 'month' | 'year' (DatePicker only)
      headerPosition="top" // 'top' | 'bottom' — month/year nav position
      weekStartsOn={0} // 0=Sun, 1=Mon, ... 6=Sat
      showWeekNumbers={false} // ISO-8601 week numbers column
      numberOfMonths={1} // months visible side-by-side
      renderDay={(d, defaultNode) => defaultNode} // custom day cell
      // ─── popover behavior ────────────────────────────────────
      closeOnSelect={true} // false → keep popover open after pick
    />
  );
}
```

### `DateRangePicker` extras

```tsx
<DateRangePicker
  value={range}
  onChange={setRange} // (r: { start, end }) => void
  // ─── presets sidebar ─────────────────────────────────────
  showDefaultPresets={true} // built-in Today / Last 7 days / …
  presets={[
    // custom quick-select entries
    {
      label: "This sprint",
      range: () => ({
        start: new Date(2026, 1, 1),
        end: new Date(2026, 1, 14),
      }),
    },
  ]}
/>
```

### `TimePicker` / `TimeRangePicker` extras

```tsx
<TimePicker
  value={time}
  onChange={setTime}                        // (t: TimeValue | null) => void

  hourFormat={24}                           // 12 | 24
  minuteStep={5}                            // 1 | 5 | 15 | 30 …
  secondStep={1}                            // only used when showSeconds
  showSeconds={false}                       // include the seconds column
  format="HH:mm"                            // override the input display
/>

<TimeRangePicker
  value={timeRange}
  onChange={setTimeRange}                   // (r: { start, end }) => void
  hourFormat={12}
  minuteStep={15}
  showSeconds={false}
/>
```

### `DateTimePicker` / `DateTimeRangePicker` extras

`DateTimePicker` and `DateTimeRangePicker` accept **every** date-picker
prop above **plus every** time-picker prop. Time pickers ignore `view`,
`closeOnSelect`, `headerPosition` (no calendar to position), and date
pickers ignore time-specific props.

```tsx
<DateTimePicker
  value={date}
  onChange={setDate} // single Date including time
  format="DD/MM/YYYY HH:mm" // mix date + time tokens
  hourFormat={24}
  minuteStep={5}
  showSeconds={false}
  disablePast // shorthand for disablePast={true}
/>
```

> **Quick tip:** every prop above is optional — you can drop a
> `<DatePicker />` with no props at all and it just works. Only set
> what you need to override.

---

## Custom format (Moment-style tokens)

The `format` prop controls how the selected date/time appears inside the
input. You can pass either **Moment.js-style** tokens (the popular
`DD/MM/YYYY` style most developers already know) or `date-fns` Unicode
tokens — the library translates them internally.

```tsx
import { DatePicker } from "react-datetime-kit";

function Example() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      format="DD/MM/YYYY" // → 19/02/2026
      // format="dddd, D MMMM, YYYY"  → Thursday, 19 February, 2026
      // format="YYYY-MM-DD"          → 2026-02-19
    />
  );
}
```

### Supported tokens

| Token  | Output             | Example    |
| ------ | ------------------ | ---------- |
| `YYYY` | 4-digit year       | `2026`     |
| `YY`   | 2-digit year       | `26`       |
| `MMMM` | Full month name    | `February` |
| `MMM`  | Short month name   | `Feb`      |
| `MM`   | 2-digit month      | `02`       |
| `M`    | 1–2 digit month    | `2`        |
| `DD`   | 2-digit day        | `19`       |
| `D`    | 1–2 digit day      | `19`       |
| `dddd` | Full weekday       | `Thursday` |
| `ddd`  | Short weekday      | `Thu`      |
| `HH`   | 2-digit hour 24h   | `09`, `21` |
| `H`    | 1–2 digit hour 24h | `9`, `21`  |
| `hh`   | 2-digit hour 12h   | `09`       |
| `h`    | 1–2 digit hour 12h | `9`        |
| `mm`   | 2-digit minute     | `05`       |
| `m`    | 1–2 digit minute   | `5`        |
| `ss`   | 2-digit second     | `07`       |
| `s`    | 1–2 digit second   | `7`        |
| `A`    | AM/PM uppercase    | `PM`       |
| `a`    | am/pm lowercase    | `pm`       |

Separators — `/`, `-`, `.`, `_`, space, comma — are passed through
as-is. Any other letters get treated as literals (e.g. `[on]` is not
supported; just write `on` and it will appear verbatim).

### Common format examples

```tsx
// Day · Month · Year
<DatePicker format="D/M/YYYY" />              // 19/2/2026
<DatePicker format="DD/MM/YYYY" />             // 19/02/2026
<DatePicker format="DD-MM-YY" />               // 19-02-26
<DatePicker format="DD.MM.YYYY" />             // 19.02.2026

// Year · Month · Day (ISO / DB-friendly)
<DatePicker format="YYYY/MM/DD" />             // 2026/02/19
<DatePicker format="YYYY-MM-DD" />             // 2026-02-19

// With month names
<DatePicker format="D MMM YYYY" />             // 19 Feb 2026
<DatePicker format="DD MMMM YYYY" />           // 19 February 2026
<DatePicker format="D-MMM-YYYY" />             // 19-Feb-2026
<DatePicker format="D MMM, YYYY" />            // 19 Feb, 2026

// With weekday names
<DatePicker format="dddd, D MMMM, YYYY" />     // Thursday, 19 February, 2026
<DatePicker format="ddd, DD MMM YYYY" />       // Thu, 19 Feb 2026

// DateTime
<DateTimePicker format="DD/MM/YYYY HH:mm" />   // 19/02/2026 14:30
<DateTimePicker format="D MMM YYYY, hh:mm A" />// 19 Feb 2026, 02:30 PM
```

> 💡 **Tip** — if you ever need it, the same translator is exported as
> `normalizeFormat(fmt)` from `react-datetime-kit/utils` so you can
> reuse it elsewhere in your app.

---

## Theming

All visual styles are driven by **CSS variables**. Override them on `:root` (global) or on any ancestor element (scoped). No JS theme config, no Tailwind required in the consumer's project.

```css
:root {
  /* Colors */
  --rdk-color-primary: #7c3aed;
  --rdk-color-primary-hover: #6d28d9;
  --rdk-color-primary-soft: #f3e8ff;
  --rdk-color-bg: #fafafa;
  --rdk-color-surface: #ffffff;
  --rdk-color-surface-hover: #f5f3ff;
  --rdk-color-text: #18181b;
  --rdk-color-text-muted: #71717a;
  --rdk-color-border: #e4e4e7;
  --rdk-color-border-strong: #d4d4d8;
  --rdk-color-danger: #ef4444;
  --rdk-color-disabled: #d4d4d8;
  --rdk-color-range-bg: #f3e8ff;

  /* Radius */
  --rdk-radius: 0.75rem;
  --rdk-radius-sm: 0.5rem;
  --rdk-radius-lg: 1.25rem;

  /* Typography */
  --rdk-font: "Inter", system-ui, sans-serif;

  /* Shadows */
  --rdk-shadow:
    0 1px 3px rgba(24, 24, 27, 0.06), 0 4px 12px rgba(124, 58, 237, 0.06);
  --rdk-shadow-lg:
    0 24px 56px -16px rgba(124, 58, 237, 0.22),
    0 12px 24px -8px rgba(24, 24, 27, 0.08);
}
```

### Scoped theming

Wrap a section of your app to give it its own picker theme without affecting the rest:

```tsx
<div data-rdk-theme="dark">
  <DatePicker value={date} onChange={setDate} />
</div>
```

---

## Dark mode

Three opt-in strategies — pick whichever matches your stack.

**1. Follow the OS color scheme** (default — uses `prefers-color-scheme`)

Nothing to do. Set `theme="auto"` (the default) and the picker follows `@media (prefers-color-scheme: dark)`.

**2. Manual switch via a data attribute** (works with most theme switchers)

```tsx
useEffect(() => {
  document.documentElement.setAttribute(
    "data-rdk-theme",
    isDark ? "dark" : "light",
  );
}, [isDark]);
```

**3. Per-picker override**

```tsx
<DatePicker theme="dark" value={date} onChange={setDate} />
```

---

## Localization

Pass any [`date-fns` locale](https://date-fns.org/v3.6.0/docs/Locale) via the `locale` prop. Combine with `weekStartsOn` for full regional accuracy.

```tsx
import { fr } from "date-fns/locale";

<DatePicker
  value={date}
  onChange={setDate}
  locale={fr}
  weekStartsOn={1} // Monday-first
  format="dd MMMM yyyy" // → "25 mai 2026"
/>;
```

### RTL

```tsx
<DatePicker dir="rtl" value={date} onChange={setDate} />
```

The icon, navigation arrows, and range-edge rounding all flip automatically.

---

## Custom day rendering

Need to highlight holidays, show event dots, or completely take over the cell? Use `renderDay`. You receive the date plus the default node so you can decorate without re-implementing.

```tsx
const holidays = ["2026-01-01", "2026-07-04", "2026-12-25"];

<DatePicker
  value={date}
  onChange={setDate}
  renderDay={(d, defaultNode) => {
    const iso = d.toISOString().slice(0, 10);
    const isHoliday = holidays.includes(iso);
    return (
      <>
        {defaultNode}
        {isHoliday && (
          <span
            style={{
              position: "absolute",
              bottom: 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
        )}
      </>
    );
  }}
/>;
```

---

## Keyboard shortcuts

When the calendar is focused:

| Key                   | Action                              |
| --------------------- | ----------------------------------- |
| `←` `→`               | Move focus by one day               |
| `↑` `↓`               | Move focus by one week              |
| `Home` / `End`        | Jump to the start / end of the week |
| `PageUp` / `PageDown` | Previous / next month               |
| `Shift + PageUp/Down` | Previous / next year                |
| `Enter` / `Space`     | Select the focused day              |
| `Escape`              | Close the popover                   |
| `Tab`                 | Move focus out of the calendar      |

Time columns support `↑` / `↓` (or scroll) to increment / decrement.

---

## Headless hooks (advanced)

Need a fully custom UI but want the date math, controllability, and disabled-date logic for free? Drop down to the hook layer.

```tsx
import { useDatePicker } from "react-datetime-kit";

function MyCustomPicker() {
  const ctrl = useDatePicker({
    value: date,
    onChange: setDate,
    minDate: new Date(),
  });

  return (
    <div>
      <button
        onClick={() => ctrl.setVisibleMonth(addMonths(ctrl.visibleMonth, -1))}
      >
        ←
      </button>
      <span>{format(ctrl.visibleMonth, "MMMM yyyy")}</span>
      <button
        onClick={() => ctrl.setVisibleMonth(addMonths(ctrl.visibleMonth, 1))}
      >
        →
      </button>
      {/* Render your own grid using ctrl.isDisabled(d), ctrl.setValue(d), etc. */}
    </div>
  );
}
```

Available headless hooks:

- `useDatePicker({ value, onChange, minDate, maxDate, disabledDates })`
- `useDateRange({ value, onChange, minDate, maxDate, disabledDates })`
- `useTimePicker({ value, onChange })`
- `useCalendarKeyboard({ onMove, onSelect, onCancel })`

---

## TypeScript types

Everything is fully typed. The most commonly imported types:

```ts
import type {
  DatePickerProps,
  DateRangePickerProps,
  TimePickerProps,
  TimeRangePickerProps,
  DateTimePickerProps,
  DateTimeRangePickerProps,
  DateRange, // { start: Date | null; end: Date | null }
  TimeValue, // { hours: number; minutes: number; seconds?: number }
  TimeRange, // { start: TimeValue | null; end: TimeValue | null }
  Preset, // { label: string; range: () => DateRange }
  Theme, // 'light' | 'dark' | 'auto'
  Size, // 'sm' | 'md' | 'lg'
  WeekStartsOn, // 0 | 1 | 2 | 3 | 4 | 5 | 6
  Locale, // re-exported from date-fns
} from "react-datetime-kit";
```

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari — last two stable versions). Requires CSS `color-mix()` support for opacity-modifier utilities — Chrome 111+, Firefox 113+, Safari 16.4+.

---

## Changelog

See **[CHANGELOG.md](./CHANGELOG.md)** for the full release history.

### What's new in `1.1.0` ✨

Per-instance theming, calendar view modes, date-range restrictions,
icon controls and themed scrollbars — every new prop is documented
in the [kitchen-sink section](#all-props-at-a-glance-kitchen-sink).

- **`colors` prop** on every picker — override 14 semantic color keys
  (`primary`, `primaryHover`, `primarySoft`, `surface`, `text`, `border`,
  `danger`, `rangeBg`, … ) without writing CSS. Each key maps to a
  `--rdk-color-*` variable.
- **`view` prop on `DatePicker`** — `'day' | 'month' | 'year'`. Month
  view shows a 12-month grid; year view shows a 12-year grid. Selecting
  commits the 1st of that month / January 1 of that year.
- **`headerPosition`** — `'top' | 'bottom'` on every date picker to flip
  the month/year navigation header to the bottom of the calendar.
- **`closeOnSelect={false}`** — keep the popover open after a date is
  selected (`DatePicker` and `DateRangePicker`).
- **`disablePast` / `disableFuture`** — constraint shortcuts. Today
  stays selectable; the props merge correctly with explicit
  `minDate` / `maxDate`.
- **`showIcon` / `iconPosition`** — hide the leading icon or move it
  to the trailing edge.
- **Themed scrollbars** — thin purple-tinted scrollbar inside picker
  popovers, scoped to `[data-rdk-theme]` so host-page scrollbars stay
  untouched.

> Upgrading from `1.0.0`? There are **no breaking changes** — every new
> prop has a backward-compatible default. Bundle size delta is under
> 0.5 KB minified+gzipped.

### What's new in `1.0.0` 🎉

First stable release. Highlights:

- **6 picker components** sharing one API — `DatePicker`, `DateRangePicker`, `TimePicker`, `TimeRangePicker`, `DateTimePicker`, `DateTimeRangePicker`.
- **Moment-style format tokens** — pass `DD/MM/YYYY`, `dddd, D MMMM, YYYY`, `hh:mm A` etc. and the library translates to `date-fns` internally. Existing `date-fns` formats keep working.
- **CSS-variable theming** with built-in light / dark / auto modes that honor `prefers-color-scheme`.
- **Accessibility built-in** — WAI-ARIA roles, full keyboard navigation, focus trap inside popovers, screen-reader labels.
- **i18n + RTL** — full `date-fns` locale support, configurable `weekStartsOn`, `dir="rtl"` first-class.
- **Headless hooks** — `useDatePicker`, `useDateRange`, `useTimePicker` for fully custom UIs.
- **Range presets sidebar** — built-in defaults (Today, Last 7 days, This month, …) or pass your own.
- **TypeScript-first**, tree-shakeable ESM + CJS, works with React 17 / 18 / 19.

> Upgrading from a pre-release? There are no breaking changes — the public API has been stable, and `1.0.0` marks the semver commitment.

---

## License

[MIT](./LICENSE) © react-datetime-kit
MIT License - Copyright (c) 2026 **Yogesh Gabani**

Built by **Yogesh Gabani**.
