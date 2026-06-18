import { useRef } from 'react';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { Calendar } from '../shared/Calendar';
import { PresetList } from '../shared/PresetList';
import { CalendarIcon } from '../shared/Icons';
import { useDateRange } from '../../hooks/useDateRange';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatDate, defaultDateFormat } from '../../utils/format';
import { DEFAULT_PRESETS } from '../../utils/presets';
import { cn } from '../../utils/cn';
import { colorsToCssVars } from '../../utils/colors';
import { effectiveDateBounds } from '../../utils/constraints';
import type { DateRange, DateRangePickerProps } from '../../types';

export function DateRangePicker(props: DateRangePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    format: fmt = defaultDateFormat(),
    locale,
    placeholder = 'Select date range',
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

  const ctrl = useDateRange({
    value,
    defaultValue,
    onChange,
    minDate: effMin,
    maxDate: effMax,
    disabledDates,
  });

  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const themeAttr =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : undefined;
  const colorStyle = colorsToCssVars(colors);

  const inputText = formatRange(ctrl.value, fmt, locale);
  const effectivePresets =
    presets ?? (showDefaultPresets ? DEFAULT_PRESETS : undefined);

  const calendarNode = (
    <div className="rdk-flex rdk-flex-col sm:rdk-flex-row rdk-items-stretch">
      {effectivePresets ? (
        <PresetList
          presets={effectivePresets}
          value={ctrl.value}
          onSelect={(r) => {
            ctrl.setValue(r);
            if (r.start) ctrl.setVisibleMonth(r.start);
            if (!inline) setOpen(false);
          }}
        />
      ) : null}
      <div className="rdk-flex-1">
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
          onDayClick={(d) => {
            ctrl.selectDate(d);
            // close after end selected
            if (
              ctrl.selectionStep === 'end' &&
              ctrl.value.start &&
              !inline &&
              closeOnSelect
            ) {
              setTimeout(() => setOpen(false), 0);
            }
          }}
          onDayHover={(d) => {
            if (ctrl.selectionStep === 'end') ctrl.setHoverDate(d);
          }}
          renderDay={renderDay}
          headerPosition={headerPosition}
        />
        <FooterActions
          step={ctrl.selectionStep}
          onClear={
            clearable
              ? () => {
                  ctrl.reset();
                }
              : undefined
          }
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
        hasValue={!!ctrl.value.start}
        icon={showIcon ? <CalendarIcon /> : undefined}
        iconPosition={iconPosition}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={inputText}
        onFocus={() => !disabled && !readOnly && openFromFocus()}
        onClick={() => !disabled && !readOnly && setOpen(true)}
        onClear={ctrl.reset}
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

function formatRange(
  range: DateRange,
  fmt: string,
  locale: DateRangePickerProps['locale'],
): string {
  if (!range.start) return '';
  const s = formatDate(range.start, fmt, locale);
  const e = range.end ? formatDate(range.end, fmt, locale) : '';
  return e ? `${s}  —  ${e}` : `${s}  —  …`;
}

function FooterActions({
  step,
  onClear,
}: {
  step: 'start' | 'end';
  onClear?: () => void;
}) {
  return (
    <div className="rdk-flex rdk-items-center rdk-justify-between rdk-px-3 rdk-py-2 rdk-border-t rdk-border-rdk-border rdk-bg-rdk-bg/50">
      <span className="rdk-inline-flex rdk-items-center rdk-gap-1.5 rdk-text-xs rdk-text-rdk-text-muted">
        <span
          aria-hidden
          className={cn(
            'rdk-h-1.5 rdk-w-1.5 rdk-rounded-full',
            step === 'start' ? 'rdk-bg-rdk-primary rdk-animate-pulse' : 'rdk-bg-rdk-border-strong',
          )}
        />
        <span
          aria-hidden
          className={cn(
            'rdk-h-1.5 rdk-w-1.5 rdk-rounded-full',
            step === 'end' ? 'rdk-bg-rdk-primary rdk-animate-pulse' : 'rdk-bg-rdk-border-strong',
          )}
        />
        <span className="rdk-ml-0.5 rdk-font-medium">
          {step === 'start' ? 'Select start date' : 'Select end date'}
        </span>
      </span>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="rdk-text-xs rdk-font-medium rdk-text-rdk-text-muted rdk-px-2.5 rdk-py-1 rdk-rounded-full rdk-transition-all hover:rdk-bg-rdk-surface-hover hover:rdk-text-rdk-text active:rdk-scale-95"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
