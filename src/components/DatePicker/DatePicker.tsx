import { useRef, useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { Calendar } from '../shared/Calendar';
import { CalendarIcon } from '../shared/Icons';
import { useDatePicker } from '../../hooks/useDatePicker';
import { useCalendarKeyboard } from '../../hooks/useCalendarKeyboard';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatDate, defaultDateFormat } from '../../utils/format';
import { parseDate } from '../../utils/parse';
import { cn } from '../../utils/cn';
import { colorsToCssVars } from '../../utils/colors';
import { effectiveDateBounds } from '../../utils/constraints';
import type { DatePickerProps } from '../../types';

export function DatePicker(props: DatePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    format: fmt = defaultDateFormat(),
    locale,
    placeholder = 'Select date',
    disabled,
    readOnly,
    clearable,
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
    view = 'day',
    headerPosition = 'top',
    closeOnSelect = true,
    disablePast,
    disableFuture,
  } = props;

  const { minDate: effMin, maxDate: effMax } = effectiveDateBounds({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const ctrl = useDatePicker({
    value,
    defaultValue,
    onChange,
    minDate: effMin,
    maxDate: effMax,
    disabledDates,
  });

  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const [inputText, setInputText] = useState(formatDate(ctrl.value, fmt, locale));
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputText(formatDate(ctrl.value, fmt, locale));
  }, [ctrl.value, fmt, locale]);

  const commitDay = (d: Date) => {
    if (ctrl.isDisabled(d)) return;
    ctrl.setValue(d);
    ctrl.setFocusedDate(d);
    if (!inline && closeOnSelect) setOpen(false);
  };

  const handleKeyDown = useCalendarKeyboard({
    onMove: ctrl.moveFocus,
    onSelect: () => commitDay(ctrl.focusedDate),
    onCancel: () => setOpen(false),
  });

  const themeAttr =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : undefined;
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
        selectedDate={ctrl.value}
        isDisabled={ctrl.isDisabled}
        onDayClick={commitDay}
        renderDay={renderDay}
        view={view}
        headerPosition={headerPosition}
      />
      {view === 'day' ? (
        <FooterActions
          onToday={() => {
            const t = new Date();
            if (ctrl.isDisabled(t)) return;
            ctrl.setValue(t);
            ctrl.setFocusedDate(t);
            if (!inline && closeOnSelect) setOpen(false);
          }}
          onClear={
            clearable
              ? () => {
                  ctrl.setValue(null);
                  if (!inline && closeOnSelect) setOpen(false);
                }
              : undefined
          }
        />
      ) : clearable ? (
        <FooterActions
          onToday={() => {
            const t = new Date();
            if (ctrl.isDisabled(t)) return;
            ctrl.setValue(t);
            if (!inline && closeOnSelect) setOpen(false);
          }}
          onClear={() => {
            ctrl.setValue(null);
            if (!inline && closeOnSelect) setOpen(false);
          }}
        />
      ) : null}
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
        readOnly={readOnly}
        clearable={clearable}
        hasValue={!!ctrl.value}
        icon={showIcon ? <CalendarIcon /> : undefined}
        iconPosition={iconPosition}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={inputText}
        onFocus={() => !disabled && !readOnly && openFromFocus()}
        onClick={() => !disabled && !readOnly && setOpen(true)}
        onChange={(e) => {
          setInputText(e.target.value);
          const parsed = parseDate(e.target.value, fmt, locale);
          if (parsed && !ctrl.isDisabled(parsed)) {
            if (!ctrl.value || !isSameDay(parsed, ctrl.value)) {
              ctrl.setValue(parsed);
              ctrl.setVisibleMonth(parsed);
              ctrl.setFocusedDate(parsed);
            }
          }
        }}
        onClear={() => ctrl.setValue(null)}
      />
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={wrapperRef}
        className={popoverClassName}
      >
        <div data-rdk-theme={themeAttr} style={colorStyle}>{calendarNode}</div>
      </Popover>
    </div>
  );
}

function FooterActions({
  onToday,
  onClear,
}: {
  onToday: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="rdk-flex rdk-items-center rdk-justify-between rdk-gap-2 rdk-px-3 rdk-py-2.5 rdk-border-t rdk-border-rdk-border rdk-bg-rdk-bg">
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
  );
}
