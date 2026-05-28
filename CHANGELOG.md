# Changelog

All notable changes to **react-datetime-kit** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.0]: https://github.com/YogeshGabani/react-datetime-kit/releases/tag/v1.0.0
