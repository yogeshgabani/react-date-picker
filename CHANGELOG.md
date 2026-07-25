# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-07-25

### Added
- **`colors.popover`** — background for the floating dropdown panel only, leaving `surface` (inline panels, time columns, input) untouched. Accepts any CSS colour, including translucent ones like `rgb(24 24 27 / 0.72)`. Defaults to `surface`.
- **`colors.popoverBlur`** — backdrop blur behind the dropdown, e.g. `'14px'`. A bare length is wrapped in `blur()`; a full filter list such as `'blur(14px) saturate(160%)'` is passed through. Both new keys default to unset, so a picker that doesn't opt in renders exactly as before and never pays for a backdrop filter.

### Fixed
- **Dropdown rendered in the wrong theme** — the popover is portaled to `document.body`, so it sat outside the picker's `data-rdk-theme` scope. Its shell resolved the page-level tokens while its children resolved the picker's, which on a `theme="dark"` picker in a light browser produced a white calendar with a dark time panel, and made today's date invisible. The shell now carries the theme scope itself.
- **`theme="light"` had no effect** — no CSS ever declared the light tokens for `[data-rdk-theme="light"]`, so an explicitly-light picker on a dark-scheme page just inherited the dark values. Light tokens are now declared, and are ordered after the `prefers-color-scheme` block so an explicit theme always beats the automatic one.
- **Host `:root` colour overrides ignored in dark mode** — the auto-theme selector was `:root:not([data-rdk-theme="light"])` (specificity 0,2,0) and silently beat a consumer's own `:root { --rdk-color-*: … }` branding. It is now plain `:root`.
- **Every opacity-modifier utility was missing from the stylesheet** — theme tokens were bare `var(--rdk-color-*)` strings, which Tailwind cannot inject alpha into, so it dropped `bg-rdk-primary-soft/40`, `ring-rdk-primary/60` and eight others entirely. Tokens are now alpha-capable via `color-mix`; un-modified utilities emit the same plain `var()` as before.
- **Today's date was unreadable** — its ring fell back to Tailwind's default blue (preflight, which would define `--tw-ring-color`, is disabled for this library) and its soft fill was one of the dropped utilities. It now uses a solid themed ring, and `text-rdk-text` no longer overrides the primary colour it is meant to show.
- **Scrollbar arrows and unstyled scrollbars** — declaring any `::-webkit-scrollbar` rule switches Blink/WebKit to custom rendering, which restores the platform stepper arrows unless they are removed explicitly. The scrollbar styles were also scoped to `[data-rdk-theme]`, an attribute only emitted for an explicit light/dark theme — so a default `theme="auto"` picker, i.e. what a fresh install gets, had no scrollbar theming at all.

### Changed
- `theme="auto"` now emits `data-rdk-theme="auto"` so host CSS can target it. No token block is attached, so the picker still follows `prefers-color-scheme`.
- `TimePanel` no longer paints its own background — it always sits on a surface already, and the duplicate fill punched through a translucent `colors.popover`.
- Hand-written vendor prefixes are preserved at build time (`autoprefixer: { remove: false }`); Safari only dropped the `-webkit-` prefix on `backdrop-filter` in 18.

### Playground
- Customizer gained a **Dropdown panel** section — background colour, opacity and blur. Leaving the colour empty and lowering opacity keeps the system background and just makes it see-through.
- Customizer gained a **Surface tint** slider (default 15%). Surface paints every panel, so a saturated pick at full strength buried the dates in it. The tint is blended over the theme background rather than over transparency, so the panel stays opaque and nothing bleeds through the calendar.
- The **Background** colour field is now hidden for pickers that never paint `--rdk-color-bg` — it only backs the Today/Clear footer bar in `DatePicker` and `DateRangePicker`, so on the other four it changed nothing.

## [1.2.4] - 2026-06-18

### Fixed
- **Keyboard input constraint enforcement** — TimePanel now respects min/max time constraints when users type time values via keyboard. Prevents bypassing disabled time selections.
- **Time range auto-snap behavior** — When end time is selected below the minimum constraint (e.g., minute=00 when minTime=1:05), it automatically snaps to the minimum allowed value for better UX.

### Details
- Enhanced `processKeyInput()` in TimePanel to check `isHourDisabled`, `isMinuteDisabled`, and `isSecondDisabled`
- Added `normalizeTime()` utility function in TimeRangePicker and DateTimeRangePicker to auto-snap invalid time selections
- Ensures users selecting FROM=1:00 with minuteStep={5} cannot select TO=1:00 (automatically becomes 1:05)

## [1.2.3] - 2026-06-18

### Fixed
- **Time range picker constraint** — TimeRangePicker and DateTimeRangePicker now prevent selecting the same time for both start and end. End time must be at least minuteStep after start time (or on a different day for DateTimeRangePicker)
- Resolved issue where users could select identical start/end times

### Details
- Added `addMinutesToTime()` utility function to calculate time offsets
- TimeRangePicker: `endMinTime = startTime + minuteStep`, `startMaxTime = endTime - minuteStep`
- DateTimeRangePicker: Same constraint only applies when dates are identical
- Respects configured `minuteStep` prop for all range pickers

## [1.2.2] - 2026-06-18

### Fixed
- **React warning on range pickers** — Fixed "value prop without onChange/readOnly" warning by explicitly setting readOnly={true} on PickerInput for DateRangePicker, TimeRangePicker, and DateTimeRangePicker
- **Focus ring opacity** — Reduced focus ring opacity from 30% to 20% (primary) and 30% to 15% (danger) for more subtle focus indication while maintaining accessibility

### Details
- Fixed console warning: "You provided a `value` prop to a form field without an `onChange` handler"
- Applied readOnly prop fix to all three range picker components
- Improved accessibility with better focus ring visibility

## [1.2.1] - 2026-06-18

### Added
- **Version bumping** — Aligned package versions across all files

### Changed
- Version synchronization across package.json, package-lock.json, CHANGELOG.md, and playground

## [1.2.0] - 2026-06-17

### Added
- **Clearable button now enabled by default** — All pickers now show a clear (×) button by default. Users can explicitly set `clearable={false}` to hide it.
- **Read-only input mode** — All date/time inputs are now read-only by default, preventing keyboard typing while still allowing calendar/time picker interaction. Users can only select values through the picker UI.
- **Clearable input documentation** — New dedicated section in README explaining the clearable prop with working examples.
- **Enhanced playground** — Live state display showing current picker values below each example
- **TS/JS code toggle** — Playground now shows TypeScript and JavaScript versions of all code examples with automatic conversion
- **Min/Max time constraints** — Added `minTime` and `maxTime` props to TimePicker and TimeRangePicker for time range restriction
- **Time picker enhancements** — Enhanced date and time pickers with additional customization options

### Changed
- **Default prop values** — All pickers now default to `clearable={true}` and use read-only input fields
- **Input behavior** — Input fields are now read-only to prevent invalid manual keyboard input; users interact through the calendar/time picker only
- **Focus ring visibility** — Increased focus ring opacity from 15% to 30% for better visibility on active inputs
- **Popover z-index** — Increased from 50 to 9999 to ensure pickers appear above modals and other high z-index elements
- **Clear button display** — Clear button now displays even when input is read-only (previously hidden)
- **Component defaults** — All 6 picker components updated with new defaults (DatePicker, DateRangePicker, TimePicker, TimeRangePicker, DateTimePicker, DateTimeRangePicker)

### Fixed
- **Dropdown visibility in modals** — Fixed z-index issue where popover was hidden behind modal overlays
- **Input validation** — Removed invalid keyboard input acceptance; only valid date/time selection through picker is allowed
- **Clear button regression** — Fixed issue where clear button wasn't showing on read-only inputs
- **Customizer toggle bug** — Fixed clearable toggle not properly disabling the clear button when toggled off
- **Modal overlay conflict** — Fixed popover appearing behind modal overlays by increasing z-index

### Technical
- **Input masking** — Implemented character validation for date/time inputs (removed support for direct keyboard input)
- **PickerInput logic** — Modified clear button condition to show on read-only inputs
- **TypeScript improvements** — Better type definitions for all props and events

## [1.1.0] - 2026-06-05

### Added
- **Per-instance theming** — New `colors` prop with 14 semantic color keys for custom color schemes
- **CSS variable overrides** — All colors customizable via CSS variables without theme configuration
- **Calendar view modes** — DatePicker now supports day, month, and year view modes for flexible date selection
- **Date-range restrictions** — New props: `minDate`, `maxDate`, `disablePast`, `disableFuture` for date constraints
- **Icon controls** — New props: `showIcon`, `iconPosition` for flexible icon placement
- **Themed scrollbars** — Custom scrollbar styling inside picker popovers
- **closeOnSelect prop** — Option to keep popover open after selection for multiple picks
- **headerPosition prop** — Place month/year navigation at top or bottom of calendar
- **"What's New" feature** — Changelog modal showing release notes within the app
- **Live playground improvements** — Interactive customizer with live preview of all props

### Changed
- **YearMonthPicker API** — Now accepts `lock` prop and `onCommit` callback for better control
- **Playground Customizer** — Expanded modal to expose all theming props with live color-picker grid
- **Theme showcase** — New themes tab with five live demo color schemes

### Fixed
- **Theme application** — Improved CSS variable handling for nested components
- **Color inheritance** — Fixed color prop cascade through component tree

### Technical
- **New utilities**: `effectiveDateBounds()` and `colorsToCssVars()` for theme management
- **Type exports**: `PickerColors` and `CalendarView` now public for TypeScript users
- **Component structure**: Enhanced YearMonthPicker for better customization support

## [1.0.0] - 2026-05-28 — Initial Release ✨

### Core Components
**Six picker components** with consistent API:
- `DatePicker` — Single date selection with calendar
- `DateRangePicker` — Date range selection with calendar
- `TimePicker` — Single time selection with hour/minute/second
- `TimeRangePicker` — Time range selection (start/end time)
- `DateTimePicker` — Combined date and time selection
- `DateTimeRangePicker` — Combined date and time range selection

### Headless Hooks
- `useDatePicker` — Date picker state management
- `useDateRange` — Date range state management
- `useTimePicker` — Time picker state management
- `useControllableState` — Generic controlled/uncontrolled state hook
- `useCalendarKeyboard` — Keyboard navigation for calendars
- `usePopoverTrigger` — Popover open/close state management

### Features
- **Format tokens** — Moment-style format tokens (DD/MM/YYYY, hh:mm A) with lenient parser
- **CSS variable theming** — Complete theme customization via CSS variables
- **Built-in themes** — Light and dark themes with auto/light/dark mode support
- **Accessibility** — WAI-ARIA roles, full keyboard navigation, focus trap, screen-reader labels
- **Internationalization** — i18n + RTL support via date-fns locales
- **Smart positioning** — Floating UI with flip/shift for viewport collision avoidance
- **Range presets** — Sidebar with built-in presets and custom preset support
- **Custom rendering** — renderDay prop for custom day cell rendering
- **Multi-month view** — Display multiple months simultaneously
- **Week numbers** — Optional ISO week number display in calendars

### Technical Highlights
- **Minimal dependencies** — Only @floating-ui/react bundled; date-fns and React are peer dependencies
- **Tiny footprint** — ~91KB ESM, side-effect-free JS (only *.css marked as side effect)
- **Framework compatibility** — Works with React 17, 18, and 19
- **Dual build** — Tree-shakeable ESM + CJS builds for all bundlers
- **TypeScript** — Complete TypeScript support with strict types for all props and events
- **No external CSS** — All styles included in single dist/styles.css file

### Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE 11+ (with polyfills)

---

## Version History Summary

| Version | Date | Status | Key Features |
|---------|------|--------|--------------|
| 1.3.0 | 2026-07-25 | Latest | Dropdown background & blur, popover theme scoping fixes |
| 1.2.4 | 2026-06-18 | Stable | Keyboard input constraints, time auto-snap |
| 1.2.3 | 2026-06-18 | Stable | Time range picker constraints |
| 1.2.2 | 2026-06-18 | Stable | React warnings fix, focus ring improvements |
| 1.2.1 | 2026-06-18 | Stable | Version alignment |
| 1.2.0 | 2026-06-17 | Stable | Clearable default, read-only inputs, min/max time |
| 1.1.0 | 2026-06-05 | Stable | Per-instance theming, calendar view modes |
| 1.0.0 | 2026-05-28 | Stable | Initial release |
