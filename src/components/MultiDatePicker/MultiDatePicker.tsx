import { useRef, useState, useEffect } from 'react';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { Calendar } from '../shared/Calendar';
import { CalendarIcon } from '../shared/Icons';
import { useMultiDatePicker } from '../../hooks/useMultiDatePicker';
import { useCalendarKeyboard } from '../../hooks/useCalendarKeyboard';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatDate, defaultDateFormat } from '../../utils/format';
import { cn } from '../../utils/cn';
import { colorsToCssVars } from '../../utils/colors';
import { effectiveDateBounds } from '../../utils/constraints';
import type { Locale } from '../../types';
import type { MultiDatePickerProps } from '../../types';

function formatMultiDateDisplay(dates: Date[], fmt: string, locale?: Locale): string {
  if (dates.length === 0) return '';
  if (dates.length <= 2) {
    return dates.map((d) => formatDate(d, fmt, locale)).join(', ');
  }
  return `${dates.length} dates selected`;
}

export function MultiDatePicker(props: MultiDatePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    format: userFormat,
    locale,
    placeholder = 'Select dates',
    disabled,
    clearable = true,
    inline,
    size = 'md',
    theme,
    colors,
    dir,
    weekStartsOn = 0,
    showWeekNumbers,
    numberOfMonths = 1,
    renderDay,
    className,
    inputClassName,
    popoverClassName,
    id,
    name,
    autoFocus,
    showIcon = true,
    iconPosition = 'left',
    headerPosition = 'top',
    closeOnSelect = false,
    disablePast = true,
    disableFuture,
  } = props;

  const fmt = userFormat ?? defaultDateFormat();

  const { minDate: effMin, maxDate: effMax } = effectiveDateBounds({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const ctrl = useMultiDatePicker({
    value,
    defaultValue,
    onChange,
    minDate: effMin,
    maxDate: effMax,
    disabledDates,
  });

  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const [inputText, setInputText] = useState(formatMultiDateDisplay(ctrl.value, fmt, locale));
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputText(formatMultiDateDisplay(ctrl.value, fmt, locale));
  }, [ctrl.value, fmt, locale]);

  const toggleDay = (d: Date) => {
    if (ctrl.isDisabled(d)) return;
    ctrl.toggleDate(d);
    ctrl.setFocusedDate(d);
    if (!inline && closeOnSelect) setOpen(false);
  };

  const handleKeyDown = useCalendarKeyboard({
    onMove: ctrl.moveFocus,
    onSelect: () => toggleDay(ctrl.focusedDate),
    onCancel: () => setOpen(false),
  });

  // `auto` (the default) emits the attribute without any token block behind
  // it, so the picker inherits whatever `prefers-color-scheme` resolved on
  // :root while still being targetable by host CSS and the scoped resets.
  const themeAttr: 'light' | 'dark' | 'auto' =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'auto';
  const colorStyle = colorsToCssVars(colors);

  const calendarNode = (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="rdk-outline-none"
    >
      <Calendar
        visibleMonth={ctrl.visibleMonth}
        onVisibleMonthChange={(d) => {
          ctrl.setVisibleMonth(d);
          ctrl.setFocusedDate(d);
        }}
        numberOfMonths={numberOfMonths}
        weekStartsOn={weekStartsOn}
        showWeekNumbers={showWeekNumbers}
        locale={locale}
        focusedDate={ctrl.focusedDate}
        selectedDates={ctrl.value}
        isDisabled={ctrl.isDisabled}
        onDayClick={toggleDay}
        renderDay={renderDay}
        headerPosition={headerPosition}
      />
      <FooterActions
        onToday={() => toggleDay(new Date())}
        onClear={clearable ? () => ctrl.setValue([]) : undefined}
        onDone={!inline ? () => setOpen(false) : undefined}
      />
    </div>
  );

  if (inline) {
    return (
      <div
        ref={wrapperRef}
        data-rdk-theme={themeAttr}
        dir={dir}
        style={colorStyle}
        className={cn(
          'rdk-inline-block rdk-bg-rdk-surface rdk-text-rdk-text rdk-border rdk-border-rdk-border rdk-rounded-rdk-lg rdk-shadow-rdk rdk-font-rdk rdk-overflow-hidden',
          className,
        )}
      >
        {calendarNode}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      data-rdk-theme={themeAttr}
      dir={dir}
      style={colorStyle}
      className={cn('rdk-inline-block rdk-w-full rdk-font-rdk', className)}
    >
      <PickerInput
        ref={inputRef}
        id={id}
        name={name}
        size={size}
        disabled={disabled}
        readOnly={true}
        clearable={clearable}
        hasValue={ctrl.value.length > 0}
        icon={showIcon ? <CalendarIcon /> : undefined}
        iconPosition={iconPosition}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={inputText}
        onFocus={() => !disabled && openFromFocus()}
        onClick={() => !disabled && setOpen(true)}
        onClear={() => ctrl.setValue([])}
      />
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={wrapperRef}
        className={popoverClassName}
        theme={themeAttr}
        themeStyle={colorStyle}
      >
        <div data-rdk-theme={themeAttr} style={colorStyle}>{calendarNode}</div>
      </Popover>
    </div>
  );
}

function FooterActions({
  onToday,
  onClear,
  onDone,
}: {
  onToday: () => void;
  onClear?: () => void;
  onDone?: () => void;
}) {
  return (
    <div className="rdk-flex rdk-items-center rdk-justify-between rdk-gap-2 rdk-px-3 rdk-py-2.5 rdk-border-t rdk-border-rdk-border rdk-bg-rdk-bg">
      <div className="rdk-flex rdk-items-center rdk-gap-2">
        <button
          type="button"
          onClick={onToday}
          className="rdk-inline-flex rdk-items-center rdk-gap-1.5 rdk-text-xs rdk-font-bold rdk-text-white rdk-px-3.5 rdk-py-1.5 rdk-rounded-full rdk-bg-rdk-primary rdk-shadow-[0_2px_6px_rgba(124,58,237,0.3)] rdk-transition-all hover:rdk-bg-rdk-primary-hover hover:rdk-shadow-[0_3px_10px_rgba(124,58,237,0.45)] hover:-rdk-translate-y-0.5 active:rdk-translate-y-0 active:rdk-scale-95"
        >
          <span aria-hidden className="rdk-h-1.5 rdk-w-1.5 rdk-rounded-full rdk-bg-white" />
          Today
        </button>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="rdk-text-xs rdk-font-semibold rdk-text-rdk-text-muted rdk-px-3.5 rdk-py-1.5 rdk-rounded-full rdk-transition-all hover:rdk-bg-rdk-danger/10 hover:rdk-text-rdk-danger active:rdk-scale-95"
          >
            Clear
          </button>
        ) : null}
      </div>
      {onDone ? (
        <button
          type="button"
          onClick={onDone}
          className="rdk-text-xs rdk-font-medium rdk-px-3 rdk-py-1 rdk-rounded-rdk-sm rdk-bg-rdk-primary rdk-text-white hover:rdk-bg-rdk-primary-hover"
        >
          Done
        </button>
      ) : null}
    </div>
  );
}
