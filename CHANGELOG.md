# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
| 1.2.4 | 2026-06-18 | Latest | Keyboard input constraints, time auto-snap |
| 1.2.3 | 2026-06-18 | Stable | Time range picker constraints |
| 1.2.2 | 2026-06-18 | Stable | React warnings fix, focus ring improvements |
| 1.2.1 | 2026-06-18 | Stable | Version alignment |
| 1.2.0 | 2026-06-17 | Stable | Clearable default, read-only inputs, min/max time |
| 1.1.0 | 2026-06-05 | Stable | Per-instance theming, calendar view modes |
| 1.0.0 | 2026-05-28 | Stable | Initial release |
