import { useRef, useState, useEffect } from 'react';
import { Popover } from '../shared/Popover';
import { PickerInput } from '../shared/PickerInput';
import { TimePanel } from '../shared/TimePanel';
import { ClockIcon } from '../shared/Icons';
import { useTimePicker } from '../../hooks/useTimePicker';
import { usePopoverTrigger } from '../../hooks/usePopoverTrigger';
import { formatTime } from '../../utils/format';
import { cn } from '../../utils/cn';
import { colorsToCssVars } from '../../utils/colors';
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
    clearable = true,
    inline,
    size = 'md',
    theme,
    colors,
    dir,
    className,
    inputClassName,
    popoverClassName,
    id,
    name,
    autoFocus,
    showIcon = true,
    iconPosition = 'left',
    minTime,
    maxTime,
  } = props;

  const ctrl = useTimePicker({ value, defaultValue, onChange });
  const { open, setOpen, openFromFocus } = usePopoverTrigger();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState(formatTime(ctrl.value, hourFormat, showSeconds));
  useEffect(() => {
    setText(formatTime(ctrl.value, hourFormat, showSeconds));
  }, [ctrl.value, hourFormat, showSeconds]);

  // `auto` (the default) emits the attribute without any token block behind
  // it, so the picker inherits whatever `prefers-color-scheme` resolved on
  // :root while still being targetable by host CSS and the scoped resets.
  const themeAttr: 'light' | 'dark' | 'auto' =
    theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'auto';
  const colorStyle = colorsToCssVars(colors);

  const currentTime: TimeValue = ctrl.value ?? { hours: 0, minutes: 0, seconds: 0 };

  const panel = (
    <TimePanel
      value={currentTime}
      onChange={ctrl.setValue}
      hourFormat={hourFormat}
      minuteStep={minuteStep}
      secondStep={secondStep}
      showSeconds={showSeconds}
      minTime={minTime}
      maxTime={maxTime}
    />
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
        hasValue={!!ctrl.value}
        icon={showIcon ? <ClockIcon /> : undefined}
        iconPosition={iconPosition}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName}
        value={text}
        onFocus={() => !disabled && openFromFocus()}
        onClick={() => !disabled && setOpen(true)}
        onClear={() => ctrl.setValue(null)}
      />
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={wrapperRef}
        className={popoverClassName}
        theme={themeAttr}
        themeStyle={colorStyle}
      >
        <div data-rdk-theme={themeAttr} style={colorStyle}>
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
