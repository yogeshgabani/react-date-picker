import { useRef, useState, useEffect } from 'react';
import { setHours, setMinutes, setSeconds, getHours, getMinutes, getSeconds } from 'date-fns';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { Calendar } from '../shared/Calendar';
import { TimePanel } from '../shared/TimePanel';
import { CalendarIcon } from '../shared/Icons';
import { useDatePicker } from '../../hooks/useDatePicker';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatDate, defaultDateTimeFormat } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { DateTimePickerProps, TimeValue } from '../../types';

export function DateTimePicker(props: DateTimePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    format: fmt,
    locale,
    placeholder = 'Select date & time',
    disabled,
    readOnly,
    clearable,
    inline,
    size = 'md',
    theme,
    dir,
    weekStartsOn = 0,
    showWeekNumbers,
    numberOfMonths = 1,
    renderDay,
    hourFormat = 24,
    minuteStep = 1,
    secondStep = 1,
    showSeconds = false,
    className,
    inputClassName,
    popoverClassName,
    id,
    name,
    autoFocus,
  } = props;

  const ctrl = useDatePicker({
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
  });

  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fullFormat = fmt ?? defaultDateTimeFormat(hourFormat, showSeconds);
  const [text, setText] = useState(formatDate(ctrl.value, fullFormat, locale));
  useEffect(() => {
    setText(formatDate(ctrl.value, fullFormat, locale));
  }, [ctrl.value, fullFormat, locale]);

  const themeAttr =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : undefined;

  const timeValue: TimeValue = ctrl.value
    ? {
        hours: getHours(ctrl.value),
        minutes: getMinutes(ctrl.value),
        seconds: getSeconds(ctrl.value),
      }
    : { hours: 0, minutes: 0, seconds: 0 };

  const commitDayKeepTime = (d: Date) => {
    if (ctrl.isDisabled(d)) return;
    const merged = ctrl.value
      ? setSeconds(
          setMinutes(
            setHours(d, getHours(ctrl.value)),
            getMinutes(ctrl.value),
          ),
          getSeconds(ctrl.value),
        )
      : d;
    ctrl.setValue(merged);
    ctrl.setFocusedDate(merged);
  };

  const commitTime = (t: TimeValue) => {
    const base = ctrl.value ?? new Date();
    const merged = setSeconds(
      setMinutes(setHours(base, t.hours), t.minutes),
      t.seconds ?? 0,
    );
    ctrl.setValue(merged);
  };

  const panel = (
    <div className="rdk-flex rdk-flex-col sm:rdk-flex-row rdk-items-stretch">
      <div>
        <Calendar
          visibleMonth={ctrl.visibleMonth}
          onVisibleMonthChange={ctrl.setVisibleMonth}
          numberOfMonths={numberOfMonths}
          weekStartsOn={weekStartsOn}
          showWeekNumbers={showWeekNumbers}
          locale={locale}
          focusedDate={ctrl.focusedDate}
          selectedDate={ctrl.value}
          isDisabled={ctrl.isDisabled}
          onDayClick={commitDayKeepTime}
          renderDay={renderDay}
        />
      </div>
      <div className="sm:rdk-border-l rdk-border-rdk-border">
        <div className="rdk-text-[11px] rdk-font-semibold rdk-text-rdk-text-muted rdk-uppercase rdk-tracking-wide rdk-px-3 rdk-pt-3">
          Time
        </div>
        <TimePanel
          value={timeValue}
          onChange={commitTime}
          hourFormat={hourFormat}
          minuteStep={minuteStep}
          secondStep={secondStep}
          showSeconds={showSeconds}
        />
      </div>
    </div>
  );

  if (inline) {
    return (
      <div
        ref={wrapperRef}
        data-rdk-theme={themeAttr}
        dir={dir}
        className={cn(
          'rdk-inline-block rdk-bg-rdk-surface rdk-text-rdk-text rdk-border rdk-border-rdk-border rdk-rounded-rdk-lg rdk-shadow-rdk rdk-font-rdk rdk-overflow-hidden',
          className,
        )}
      >
        {panel}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      data-rdk-theme={themeAttr}
      dir={dir}
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
        icon={<CalendarIcon />}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={text}
        onFocus={() => !disabled && !readOnly && openFromFocus()}
        onClick={() => !disabled && !readOnly && setOpen(true)}
        onChange={(e) => setText(e.target.value)}
        onClear={() => ctrl.setValue(null)}
      />
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={wrapperRef}
        className={popoverClassName}
      >
        <div data-rdk-theme={themeAttr}>
          {panel}
          <div className="rdk-flex rdk-items-center rdk-justify-end rdk-gap-2 rdk-px-3 rdk-py-2 rdk-border-t rdk-border-rdk-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rdk-text-xs rdk-font-medium rdk-px-3 rdk-py-1 rdk-rounded-rdk-sm rdk-bg-rdk-primary rdk-text-white hover:rdk-bg-rdk-primary-hover"
            >
              Done
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
