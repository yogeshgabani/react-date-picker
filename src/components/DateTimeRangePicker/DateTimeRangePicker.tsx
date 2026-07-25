import { useRef } from 'react';
import {
  setHours,
  setMinutes,
  setSeconds,
  getHours,
  getMinutes,
  getSeconds,
} from 'date-fns';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { Calendar } from '../shared/Calendar';
import { PresetList } from '../shared/PresetList';
import { TimePanel } from '../shared/TimePanel';
import { CalendarIcon } from '../shared/Icons';
import { useDateRange } from '../../hooks/useDateRange';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatDate, defaultDateTimeFormat } from '../../utils/format';
import { DEFAULT_PRESETS } from '../../utils/presets';
import { cn } from '../../utils/cn';
import { colorsToCssVars } from '../../utils/colors';
import { effectiveDateBounds } from '../../utils/constraints';
import type {
  DateRange,
  DateTimeRangePickerProps,
  TimeValue,
} from '../../types';

export function DateTimeRangePicker(props: DateTimeRangePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    format: fmt,
    locale,
    placeholder = 'Select date & time range',
    disabled,
    readOnly,
    clearable = true,
    inline,
    size = 'md',
    theme,
    colors,
    dir,
    weekStartsOn = 0,
    showWeekNumbers,
    numberOfMonths = 2,
    renderDay,
    hourFormat = 24,
    minuteStep = 5,
    secondStep = 1,
    showSeconds = false,
    className,
    inputClassName,
    popoverClassName,
    id,
    name,
    autoFocus,
    presets,
    showDefaultPresets,
    showIcon = true,
    iconPosition = 'left',
    headerPosition = 'top',
    disablePast,
    disableFuture,
    minTime,
    maxTime,
  } = props;

  const { minDate: effMin, maxDate: effMax } = effectiveDateBounds({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const ctrl = useDateRange({
    value: value as DateRange | undefined,
    defaultValue: defaultValue as DateRange | undefined,
    onChange: (r) => onChange?.(r),
    minDate: effMin,
    maxDate: effMax,
    disabledDates,
  });

  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // `auto` (the default) emits the attribute without any token block behind
  // it, so the picker inherits whatever `prefers-color-scheme` resolved on
  // :root while still being targetable by host CSS and the scoped resets.
  const themeAttr: 'light' | 'dark' | 'auto' =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'auto';
  const colorStyle = colorsToCssVars(colors);

  const fullFormat = fmt ?? defaultDateTimeFormat(hourFormat, showSeconds);
  const text = formatRange(ctrl.value, fullFormat, locale);
  const effectivePresets =
    presets ?? (showDefaultPresets ? DEFAULT_PRESETS : undefined);

  const startTime: TimeValue = ctrl.value.start
    ? {
        hours: getHours(ctrl.value.start),
        minutes: getMinutes(ctrl.value.start),
        seconds: getSeconds(ctrl.value.start),
      }
    : { hours: 0, minutes: 0, seconds: 0 };

  const endTime: TimeValue = ctrl.value.end
    ? {
        hours: getHours(ctrl.value.end),
        minutes: getMinutes(ctrl.value.end),
        seconds: getSeconds(ctrl.value.end),
      }
    : { hours: 23, minutes: 59, seconds: 0 };

  const addMinutesToTime = (time: TimeValue, minutes: number): TimeValue => {
    let totalMinutes = time.hours * 60 + time.minutes + minutes;
    if (totalMinutes > 24 * 60 - 1) totalMinutes = 24 * 60 - 1;
    if (totalMinutes < 0) totalMinutes = 0;
    return {
      hours: Math.floor(totalMinutes / 60) % 24,
      minutes: totalMinutes % 60,
      seconds: time.seconds,
    };
  };

  const isSameDay = ctrl.value.start && ctrl.value.end &&
    ctrl.value.start.toDateString() === ctrl.value.end.toDateString();

  const endTimeMinTime: TimeValue = isSameDay ? addMinutesToTime(startTime, minuteStep) : startTime;
  const startTimeMaxTime: TimeValue = isSameDay ? addMinutesToTime(endTime, -minuteStep) : endTime;

  const normalizeTime = (time: TimeValue, min: TimeValue | null | undefined, max: TimeValue | null | undefined): TimeValue => {
    let result: TimeValue = { hours: time.hours, minutes: time.minutes, seconds: time.seconds ?? 0 };
    if (min) {
      const timeInMinutes = time.hours * 60 + time.minutes;
      const minInMinutes = min.hours * 60 + min.minutes;
      if (timeInMinutes < minInMinutes) {
        result = { hours: min.hours, minutes: min.minutes, seconds: time.seconds ?? 0 };
      }
    }
    if (max) {
      const timeInMinutes = result.hours * 60 + result.minutes;
      const maxInMinutes = max.hours * 60 + max.minutes;
      if (timeInMinutes > maxInMinutes) {
        result = { hours: max.hours, minutes: max.minutes, seconds: result.seconds };
      }
    }
    return result;
  };

  const applyStartTime = (t: TimeValue) => {
    if (!ctrl.value.start) return;
    const normalized = normalizeTime(t, minTime, startTimeMaxTime);
    const merged = setSeconds(
      setMinutes(setHours(ctrl.value.start, normalized.hours), normalized.minutes),
      normalized.seconds ?? 0,
    );
    ctrl.setValue({ start: merged, end: ctrl.value.end });
  };

  const applyEndTime = (t: TimeValue) => {
    if (!ctrl.value.end) return;
    const normalized = normalizeTime(t, endTimeMinTime, maxTime);
    const merged = setSeconds(
      setMinutes(setHours(ctrl.value.end, normalized.hours), normalized.minutes),
      normalized.seconds ?? 0,
    );
    ctrl.setValue({ start: ctrl.value.start, end: merged });
  };

  const panel = (
    <div className="rdk-flex rdk-flex-col sm:rdk-flex-row rdk-items-stretch">
      {effectivePresets ? (
        <PresetList
          presets={effectivePresets}
          value={ctrl.value}
          onSelect={(r) => {
            ctrl.setValue(r);
            if (r.start) ctrl.setVisibleMonth(r.start);
          }}
        />
      ) : null}
      <div className="rdk-flex rdk-flex-col">
        <Calendar
          visibleMonth={ctrl.visibleMonth}
          onVisibleMonthChange={ctrl.setVisibleMonth}
          numberOfMonths={numberOfMonths}
          weekStartsOn={weekStartsOn}
          showWeekNumbers={showWeekNumbers}
          locale={locale}
          rangeStart={ctrl.value.start}
          rangeEnd={ctrl.value.end}
          rangeHover={ctrl.hoverDate}
          isDisabled={ctrl.isDisabled}
          onDayClick={ctrl.selectDate}
          onDayHover={(d) => {
            if (ctrl.selectionStep === 'end') ctrl.setHoverDate(d);
          }}
          renderDay={renderDay}
          headerPosition={headerPosition}
        />
        <div className="rdk-flex rdk-items-stretch rdk-divide-x rdk-divide-rdk-border rdk-border-t rdk-border-rdk-border">
          <div className="rdk-flex-1">
            <div className="rdk-text-[11px] rdk-font-semibold rdk-text-rdk-text-muted rdk-uppercase rdk-tracking-wide rdk-px-3 rdk-pt-3">
              Start time
            </div>
            <TimePanel
              value={startTime}
              onChange={applyStartTime}
              hourFormat={hourFormat}
              minuteStep={minuteStep}
              secondStep={secondStep}
              showSeconds={showSeconds}
              minTime={minTime}
              maxTime={endTime && ctrl.value.start && ctrl.value.end ? startTimeMaxTime : maxTime}
            />
          </div>
          <div className="rdk-flex-1">
            <div className="rdk-text-[11px] rdk-font-semibold rdk-text-rdk-text-muted rdk-uppercase rdk-tracking-wide rdk-px-3 rdk-pt-3">
              End time
            </div>
            <TimePanel
              value={endTime}
              onChange={applyEndTime}
              hourFormat={hourFormat}
              minuteStep={minuteStep}
              secondStep={secondStep}
              showSeconds={showSeconds}
              minTime={endTimeMinTime}
              maxTime={maxTime}
            />
          </div>
        </div>
        <div className="rdk-flex rdk-items-center rdk-justify-between rdk-px-3 rdk-py-2 rdk-border-t rdk-border-rdk-border">
          <span className="rdk-text-xs rdk-text-rdk-text-muted">
            {ctrl.selectionStep === 'start' ? 'Select start' : 'Select end'}
          </span>
          <div className="rdk-flex rdk-items-center rdk-gap-2">
            {clearable ? (
              <button
                type="button"
                onClick={ctrl.reset}
                className="rdk-text-xs rdk-text-rdk-text-muted hover:rdk-text-rdk-text"
              >
                Clear
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={!ctrl.value.start || !ctrl.value.end}
              className="rdk-text-xs rdk-font-medium rdk-px-3 rdk-py-1 rdk-rounded-rdk-sm rdk-bg-rdk-primary rdk-text-white hover:rdk-bg-rdk-primary-hover disabled:rdk-opacity-50 disabled:rdk-cursor-not-allowed"
            >
              Done
            </button>
          </div>
        </div>
      </div>
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
        {panel}
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
        hasValue={!!ctrl.value.start}
        icon={showIcon ? <CalendarIcon /> : undefined}
        iconPosition={iconPosition}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={text}
        onFocus={() => !disabled && !readOnly && openFromFocus()}
        onClick={() => !disabled && !readOnly && setOpen(true)}
        onClear={ctrl.reset}
      />
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={wrapperRef}
        className={popoverClassName}
        theme={themeAttr}
        themeStyle={colorStyle}
      >
        <div data-rdk-theme={themeAttr} style={colorStyle}>{panel}</div>
      </Popover>
    </div>
  );
}

function formatRange(
  range: DateRange,
  fmt: string,
  locale: DateTimeRangePickerProps['locale'],
): string {
  if (!range.start) return '';
  const s = formatDate(range.start, fmt, locale);
  const e = range.end ? formatDate(range.end, fmt, locale) : '';
  return e ? `${s}  —  ${e}` : `${s}  —  …`;
}
