# Changelog

All notable changes to **react-datetime-kit** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-06-05

Per-instance theming, calendar view modes, date-range restrictions,
icon controls and themed scrollbars. No breaking changes — every new
prop has a backward-compatible default.

### Added

- **`colors` prop on every picker** — per-instance overrides for 14
  semantic color keys: `primary`, `primaryHover`, `primarySoft`,
  `background`, `surface`, `surfaceHover`, `text`, `textMuted`,
  `border`, `borderStrong`, `danger`, `disabled`, `rangeBg`, `focus`.
  Each maps to a `--rdk-color-*` CSS variable, so any CSS color string
  works — hex, `rgb()`, `hsl()`, `var(--brand)`.
- **`view` prop on `DatePicker`** — `'day' | 'month' | 'year'`.
  - `'month'` shows a 12-month grid; selecting commits the 1st of that month.
  - `'year'` shows a 12-year grid; selecting commits January 1.
- **`headerPosition` prop** on every date picker — `'top' | 'bottom'`
  to place the month/year navigation header above or below the day grid.
- **`closeOnSelect` prop** on `DatePicker` and `DateRangePicker` — set
  to `false` to keep the popover open after selection.
- **`disablePast` / `disableFuture` props** — automatic min/max
  constraint shortcuts. Today remains selectable. Merge correctly with
  explicit `minDate` / `maxDate` (the tighter bound wins).
- **`showIcon` prop** (default `true`) — hide the leading calendar /
  clock icon entirely.
- **`iconPosition` prop** — `'left' | 'right'` to move the leading icon
  to the trailing edge of the input.
- **Themed scrollbars inside picker popovers** — thin 10px purple-tinted
  scrollbar driven by `--rdk-scroll-track` / `--rdk-scroll-thumb` /
  `--rdk-scroll-thumb-hover` CSS variables. Scoped strictly to
  `[data-rdk-theme]` descendants so host-page scrollbars stay
  untouched. Time columns get a tighter 6px variant.

### Changed

- `YearMonthPicker` now accepts a `lock` prop (`'month' | 'year'`) plus
  an `onCommit` callback. Used internally to back the new `view` modes
  and exported for advanced composition.
- `Calendar` accepts `view` and `headerPosition` so embedded usage
  (e.g. inside a custom sheet) matches the picker-level defaults.
- New utility exports — `effectiveDateBounds()` and `colorsToCssVars()`.

### Documentation

- New README section — **All props at a glance (kitchen sink)** — a
  copy-paste ready `<DatePicker>` block listing every prop with an
  inline comment explaining its purpose and default.
- Common-props and Date-picker-props tables refreshed with the new props.
- Playground Themes tab gained five new live demo cards: **Color
  themes**, **Icon controls**, **View modes**, **Date restrictions**,
  **Close on select**, **Header position**. Customizer modal exposes
  every new prop, including a live color-picker grid that writes the
  generated `colors={{ … }}` object into the copy panel.

### Technical

- Type exports expanded — `PickerColors` and `CalendarView` are now
  part of the public type surface.
- Zero new runtime dependencies. Bundle size delta under 0.5 KB
  minified+gzipped.

---

## [1.0.0] — 2026-05-28

🎉 **First stable release.** API is now considered stable and follows
semver — breaking changes will only ship in major versions from here on.

### Added

- **6 picker components, one consistent API**
  - `DatePicker` — single date, popover or inline calendar
  - `DateRangePicker` — start / end with hover preview and presets sidebar
  - `TimePicker` — 12 / 24-hour clock, optional seconds, configurable step
  - `TimeRangePicker` — start / end times side-by-side
  - `DateTimePicker` — calendar + time columns in a single popover
  - `DateTimeRangePicker` — separate start / end date + time pickers
- **Headless hooks for custom UIs** — `useDatePicker`, `useDateRange`,
  `useTimePicker`, `useControllableState`, `useCalendarKeyboard`.
- **Shared primitives** exported for composition — `Calendar`, `MonthGrid`,
  `TimePanel`, `Popover`.
- **Utility exports** — `formatDate`, `parseDate`, `formatTime`,
  `parseTime`, `normalizeFormat`, `isDateDisabled`, `clampDate`,
  `DEFAULT_PRESETS`.
- **Moment-style format tokens** — pass familiar Moment.js tokens
  (`DD/MM/YYYY`, `dddd, D MMMM, YYYY`, `hh:mm A`) and the library
  translates them to `date-fns` internally. Existing `date-fns` strings
  (`yyyy-MM-dd`) keep working too. Lenient parser accepts both flavors.
- **Theming via CSS variables** — override `--rdk-color-*`,
  `--rdk-radius`, `--rdk-font`, `--rdk-shadow` etc. on `:root` or any
  ancestor. No JS theme config, no Tailwind required in consumer apps.
- **Light + dark themes** out of the box with `auto`, `light`, and `dark`
  modes; the `auto` mode honors `prefers-color-scheme` and respects an
  explicit `data-rdk-theme` override on `:root`.
- **Accessibility built-in** — WAI-ARIA roles, full keyboard navigation
  (arrows, Home/End, PageUp/Down, Enter, Esc), focus trap inside
  popovers, screen-reader labels.
- **i18n + RTL** — full `date-fns` locale support via the `locale` prop,
  configurable `weekStartsOn`, and `dir="rtl"` first-class.
- **Floating UI positioning** — popovers automatically flip / shift to
  stay in the viewport, with stable initial paint and no jump-to-(0,0)
  flash.
- **Range presets sidebar** — built-in `DEFAULT_PRESETS` (Today,
  Yesterday, Last 7 days, This month, Last month, Last 3 months, Last
  year, etc.) or pass a custom `presets` array.
- **Custom day rendering** — pass `renderDay={(date, defaultNode) => …}`
  to decorate individual cells (badges, holidays, custom backgrounds).
- **Two-month / multi-month calendars** — `numberOfMonths={2}` for
  range pickers, `weekStartsOn`, optional ISO week numbers.
- **Form-friendly props** — `name`, `id`, `clearable`, `readOnly`,
  `disabled`, `placeholder`, `autoFocus`, `inputClassName`.
- **TypeScript-first** — strict types for every prop, event, and
  utility. Public types: `DatePickerProps`, `DateRangePickerProps`,
  `TimePickerProps`, `TimeRangePickerProps`, `DateTimePickerProps`,
  `DateTimeRangePickerProps`, `DateRange`, `TimeValue`, `TimeRange`,
  `DateTimeRange`, `Preset`, `Locale`, etc.

### Technical

- **Tree-shakeable** ESM + CJS dual build with separate type definitions
  (`.d.ts` / `.d.cts`).
- **Tiny footprint** — `date-fns` and `react` / `react-dom` are peer
  dependencies; only `@floating-ui/react` is bundled.
- **Works with React 17, 18, and 19** (peer range `>=17.0.0`).
- **Side-effect-free JavaScript** — only `*.css` is marked as a side
  effect, so unused pickers are dropped by bundlers.

### Documentation

- Full **README** with installation, every picker, props tables,
  theming guide, i18n, custom day rendering, keyboard shortcuts and
  headless-hook examples.
- **Live playground** at <https://react-datetime-kit.netlify.app> with
  click-to-customize modal for every picker, a custom-format demo,
  and copy-ready code snippets.

[1.1.0]: https://github.com/YogeshGabani/react-datetime-kit/releases/tag/v1.1.0
[1.0.0]: https://github.com/YogeshGabani/react-datetime-kit/releases/tag/v1.0.0
