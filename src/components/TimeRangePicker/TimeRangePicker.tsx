import { useRef } from 'react';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { TimePanel } from '../shared/TimePanel';
import { ClockIcon } from '../shared/Icons';
import { useControllableState } from '../../hooks/useControllableState';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatTime } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { TimeRange, TimeRangePickerProps, TimeValue } from '../../types';

const ZERO: TimeValue = { hours: 0, minutes: 0, seconds: 0 };

export function TimeRangePicker(props: TimeRangePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    hourFormat = 24,
    minuteStep = 1,
    secondStep = 1,
    showSeconds = false,
    placeholder = 'Select time range',
    disabled,
    readOnly,
    clearable,
    inline,
    size = 'md',
    theme,
    dir,
    className,
    inputClassName,
    popoverClassName,
    id,
    name,
    autoFocus,
  } = props;

  const [range, setRange] = useControllableState<TimeRange>({
    value,
    defaultValue: defaultValue ?? { start: null, end: null },
    onChange,
  });
  const current = range ?? { start: null, end: null };

  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const themeAttr =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : undefined;

  const setStart = (t: TimeValue) => setRange({ start: t, end: current.end });
  const setEnd = (t: TimeValue) => setRange({ start: current.start, end: t });

  const text = formatRange(current, hourFormat, showSeconds);

  const panel = (
    <div className="rdk-flex rdk-items-stretch rdk-divide-x rdk-divide-rdk-border">
      <div>
        <div className="rdk-text-[11px] rdk-font-semibold rdk-text-rdk-text-muted rdk-uppercase rdk-tracking-wide rdk-px-3 rdk-pt-3">
          From
        </div>
        <TimePanel
          value={current.start ?? ZERO}
          onChange={setStart}
          hourFormat={hourFormat}
          minuteStep={minuteStep}
          secondStep={secondStep}
          showSeconds={showSeconds}
        />
      </div>
      <div>
        <div className="rdk-text-[11px] rdk-font-semibold rdk-text-rdk-text-muted rdk-uppercase rdk-tracking-wide rdk-px-3 rdk-pt-3">
          To
        </div>
        <TimePanel
          value={current.end ?? ZERO}
          onChange={setEnd}
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
        readOnly
        clearable={clearable}
        hasValue={!!current.start || !!current.end}
        icon={<ClockIcon />}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={text}
        onFocus={() => !disabled && !readOnly && openFromFocus()}
        onClick={() => !disabled && !readOnly && setOpen(true)}
        onClear={() => setRange({ start: null, end: null })}
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

function formatRange(r: TimeRange, hf: 12 | 24, showSeconds: boolean): string {
  if (!r.start && !r.end) return '';
  const s = r.start ? formatTime(r.start, hf, showSeconds) : '…';
  const e = r.end ? formatTime(r.end, hf, showSeconds) : '…';
  return `${s}  —  ${e}`;
}
