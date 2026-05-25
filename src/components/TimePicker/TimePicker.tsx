import { useRef, useState, useEffect } from 'react';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { TimePanel } from '../shared/TimePanel';
import { ClockIcon } from '../shared/Icons';
import { useTimePicker } from '../../hooks/useTimePicker';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatTime } from '../../utils/format';
import { parseTime } from '../../utils/parse';
import { cn } from '../../utils/cn';
import type { TimePickerProps, TimeValue } from '../../types';

export function TimePicker(props: TimePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    hourFormat = 24,
    minuteStep = 1,
    secondStep = 1,
    showSeconds = false,
    placeholder = 'Select time',
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

  const ctrl = useTimePicker({ value, defaultValue, onChange });
  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState(formatTime(ctrl.value, hourFormat, showSeconds));
  useEffect(() => {
    setText(formatTime(ctrl.value, hourFormat, showSeconds));
  }, [ctrl.value, hourFormat, showSeconds]);

  const themeAttr =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : undefined;

  const currentTime: TimeValue = ctrl.value ?? { hours: 0, minutes: 0, seconds: 0 };

  const panel = (
    <TimePanel
      value={currentTime}
      onChange={ctrl.setValue}
      hourFormat={hourFormat}
      minuteStep={minuteStep}
      secondStep={secondStep}
      showSeconds={showSeconds}
    />
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
        icon={<ClockIcon />}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={text}
        onFocus={() => !disabled && !readOnly && openFromFocus()}
        onClick={() => !disabled && !readOnly && setOpen(true)}
        onChange={(e) => {
          setText(e.target.value);
          const parsed = parseTime(e.target.value);
          if (parsed) ctrl.setValue(parsed);
        }}
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
