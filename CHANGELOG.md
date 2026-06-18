# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.3] - 2026-06-18

### Fixed
- **Time range picker constraint** — TimeRangePicker and DateTimeRangePicker now prevent selecting the same time for both start and end. End time must be at least minuteStep after start time (or on a different day for DateTimeRangePicker)

## [1.2.2] - 2026-06-18

### Fixed
- **React warning on range pickers** — Fixed "value prop without onChange/readOnly" warning by explicitly setting readOnly={true} on PickerInput for DateRangePicker, TimeRangePicker, and DateTimeRangePicker
- **Focus ring opacity** — Reduced focus ring opacity from 30% to 20% (primary) and 30% to 15% (danger) for more subtle focus indication while maintaining accessibility

## [1.2.0] - 2026-06-17

### Added
- **Clearable button now enabled by default** — All pickers now show a clear (×) button by default. Users can explicitly set clearable={false} to hide it.
- **Read-only input mode** — All date/time inputs are now read-only by default, preventing keyboard typing while still allowing calendar/time picker interaction. Users can only select values through the picker UI.
- **Clearable input documentation** — New dedicated section in README explaining the clearable prop with working examples.
- **Enhanced playground** — Live state display showing current picker values below each example
- **TS/JS code toggle** — Playground now shows TypeScript and JavaScript versions of all code examples with automatic conversion

### Changed
- **Default prop values** — All pickers now default to clearable={true} and use read-only input fields
- **Input behavior** — Input fields are now read-only to prevent invalid manual keyboard input; users interact through the calendar/time picker only
- **Focus ring visibility** — Increased focus ring opacity from 15% to 30% for better visibility on active inputs
- **Popover z-index** — Increased from 50 to 9999 to ensure pickers appear above modals and other high z-index elements
- **Clear button display** — Clear button now displays even when input is read-only (previously hidden)

### Fixed
- **Dropdown visibility in modals** — Fixed z-index issue where popover was hidden behind modal overlays
- **Input validation** — Removed invalid keyboard input acceptance; only valid date/time selection through picker is allowed
- **Clear button regression** — Fixed issue where clear button wasn't showing on read-only inputs
- **Customizer toggle bug** — Fixed clearable toggle not properly disabling the clear button when toggled off

### Technical
- **Input masking** — Implemented character validation for date/time inputs (removed support for direct keyboard input)
- **Component defaults** — Updated all 6 picker components (DatePicker, DateRangePicker, TimePicker, TimeRangePicker, DateTimePicker, DateTimeRangePicker) with new defaults
- **PickerInput logic** — Modified clear button condition to show on read-only inputs

## [1.1.0] - 2026-06-05

### Added
- Per-instance theming with colors prop — 14 semantic color keys with CSS variable overrides
- Calendar view modes (day / month / year) on DatePicker
- Date-range restrictions with minDate, maxDate, disablePast, disableFuture
- Icon controls — showIcon and iconPosition props
- Themed scrollbars inside picker popovers
- closeOnSelect prop to keep popover open after selection
- headerPosition prop to place month/year navigation at top or bottom

### Changed
- YearMonthPicker now accepts lock prop and onCommit callback
- Playground Customizer modal exposes all new props with live color-picker grid
- Themes tab with five new live demo cards

### Technical
- New utilities: effectiveDateBounds() and colorsToCssVars()
- Type exports expanded: PickerColors and CalendarView now public

## [1.0.0] - 2026-05-28

### Added
- Six picker components with consistent API: DatePicker, DateRangePicker, TimePicker, TimeRangePicker, DateTimePicker, DateTimeRangePicker
- Headless hooks: useDatePicker, useDateRange, useTimePicker, useControllableState, useCalendarKeyboard
- Moment-style format tokens with lenient parser
- CSS variable theming system
- Light + dark themes with auto/light/dark modes
- WAI-ARIA roles, full keyboard navigation, focus trap, screen-reader labels
- i18n + RTL support via date-fns locales
- Floating UI positioning with flip/shift for viewport collision avoidance
- Range presets sidebar with built-in and custom presets
- Custom day rendering via enderDay prop
- Multi-month calendars with optional ISO week numbers
- Tree-shakeable ESM + CJS dual build
- Works with React 17, 18, and 19

### Technical
- Only @floating-ui/react bundled; date-fns and React are peer dependencies
- Tiny footprint with side-effect-free JS (only *.css marked as side effect)
- Complete TypeScript support with strict types for all props and events
