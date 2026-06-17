import { useMemo, useRef, useEffect } from 'react';
import { TimeColumn } from './TimeColumn';
import { cn } from '../../utils/cn';
import type { TimeValue } from '../../types';

interface TimePanelProps {
  value: TimeValue;
  onChange: (t: TimeValue) => void;
  hourFormat: 12 | 24;
  minuteStep: number;
  secondStep: number;
  showSeconds: boolean;
  className?: string;
  minTime?: TimeValue | null;
  maxTime?: TimeValue | null;
}

export function TimePanel({
  value,
  onChange,
  hourFormat,
  minuteStep,
  secondStep,
  showSeconds,
  className,
  minTime,
  maxTime,
}: TimePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputSequenceRef = useRef<string>('');
  const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusedColumnRef = useRef<'hour' | 'minute' | 'second' | null>(null);
  const meridiem: 'AM' | 'PM' = value.hours >= 12 ? 'PM' : 'AM';

  const hourValues = useMemo(() => {
    if (hourFormat === 12) {
      return Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    }
    return Array.from({ length: 24 }, (_, i) => i);
  }, [hourFormat]);

  const minuteValues = useMemo(
    () => stepRange(0, 59, minuteStep),
    [minuteStep],
  );
  const secondValues = useMemo(
    () => stepRange(0, 59, secondStep),
    [secondStep],
  );

  const displayHour =
    hourFormat === 12 ? (value.hours % 12 === 0 ? 12 : value.hours % 12) : value.hours;

  const isHourDisabled = (h: number) => {
    const hour24 = hourFormat === 12 ? (h === 12 && meridiem === 'AM' ? 0 : h === 12 ? 12 : meridiem === 'PM' ? h + 12 : h) : h;
    if (minTime && hour24 < minTime.hours) return true;
    if (maxTime && hour24 > maxTime.hours) return true;
    return false;
  };

  const isMinuteDisabled = (m: number) => {
    if (minTime && value.hours === minTime.hours && m < minTime.minutes) return true;
    if (maxTime && value.hours === maxTime.hours && m > maxTime.minutes) return true;
    return false;
  };

  const isSecondDisabled = (s: number) => {
    if (minTime && value.hours === minTime.hours && value.minutes === minTime.minutes && s < (minTime.seconds ?? 0)) return true;
    if (maxTime && value.hours === maxTime.hours && value.minutes === maxTime.minutes && s > (maxTime.seconds ?? 0)) return true;
    return false;
  };

  const processKeyInput = (digit: string) => {
    const focusedColumn = focusedColumnRef.current;
    if (!focusedColumn) return; // Only process if a column is focused

    // Safety check - make sure digit is valid
    if (!/[0-9]/.test(digit)) return;

    // Clear existing timer
    if (sequenceTimerRef.current) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }

    // Add digit to sequence
    inputSequenceRef.current += digit;
    const sequence = inputSequenceRef.current;

    // Auto-reset sequence after 2 seconds of no input or if sequence is too long
    if (sequence.length > 2) {
      inputSequenceRef.current = digit; // Reset to just current digit
    }

    sequenceTimerRef.current = setTimeout(() => {
      inputSequenceRef.current = '';
      focusedColumnRef.current = null;
    }, 2000);

    const newValue = { ...value };
    let updated = false;

    // Update only the focused column
    if (focusedColumn === 'hour') {
      if (sequence.length === 1) {
        const num = parseInt(digit);
        if (num <= (hourFormat === 12 ? 12 : 23)) {
          newValue.hours = num;
          updated = true;
        }
      } else if (sequence.length === 2) {
        const num = parseInt(sequence);
        if (num <= (hourFormat === 12 ? 12 : 23)) {
          newValue.hours = num;
          updated = true;
        }
      }
    } else if (focusedColumn === 'minute') {
      if (sequence.length === 1) {
        const num = parseInt(digit);
        if (num <= 59) {
          newValue.minutes = num;
          updated = true;
        }
      } else if (sequence.length === 2) {
        const num = parseInt(sequence);
        if (num <= 59) {
          newValue.minutes = num;
          updated = true;
        }
      }
    } else if (focusedColumn === 'second') {
      if (sequence.length === 1) {
        const num = parseInt(digit);
        if (num <= 59) {
          newValue.seconds = num;
          updated = true;
        }
      } else if (sequence.length === 2) {
        const num = parseInt(sequence);
        if (num <= 59) {
          newValue.seconds = num;
          updated = true;
        }
      }
    }

    if (updated) {
      onChange(newValue);

      // Auto-move to next field when 2 digits are entered
      if (sequence.length === 2) {
        if (focusedColumn === 'hour') {
          // Move to minute after 2 digits for hour
          focusedColumnRef.current = 'minute';
          inputSequenceRef.current = '';
        } else if (focusedColumn === 'minute' && showSeconds) {
          // Move to second after 2 digits for minute (if seconds enabled)
          focusedColumnRef.current = 'second';
          inputSequenceRef.current = '';
        } else if (focusedColumn === 'minute' && !showSeconds) {
          // Reset after minute if seconds not enabled
          focusedColumnRef.current = null;
          inputSequenceRef.current = '';
        } else if (focusedColumn === 'second') {
          // Reset after second
          focusedColumnRef.current = null;
          inputSequenceRef.current = '';
        }

        // Reset the timeout when moving to next field
        if (sequenceTimerRef.current) {
          clearTimeout(sequenceTimerRef.current);
          sequenceTimerRef.current = null;
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!/[0-9]/.test(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    processKeyInput(e.key);
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (!/[0-9]/.test(e.key)) return;

      const isVisible = panel.offsetParent !== null;
      if (!isVisible) return;

      if (!focusedColumnRef.current) return;

      e.preventDefault();
      e.stopPropagation();
      processKeyInput(e.key);
    };

    window.addEventListener('keydown', handleWindowKeyDown, true);
    return () => window.removeEventListener('keydown', handleWindowKeyDown, true);
  }, []);

  return (
    <div
      ref={panelRef}
      className={cn(
        'rdk-flex rdk-items-end rdk-gap-2 rdk-p-3 rdk-bg-rdk-surface rdk-outline-none',
        className,
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={() => {
        panelRef.current?.focus();
      }}
    >
      <div onMouseDown={() => { focusedColumnRef.current = 'hour'; inputSequenceRef.current = ''; }}>
        <TimeColumn
          label="Hour"
          values={hourValues}
          selected={displayHour}
          isDisabled={isHourDisabled}
          onSelect={(h) => {
            if (hourFormat === 12) {
              const base = h === 12 ? 0 : h;
              onChange({ ...value, hours: meridiem === 'PM' ? base + 12 : base });
            } else {
              onChange({ ...value, hours: h });
            }
          }}
        />
      </div>
      <Separator />
      <div onMouseDown={() => { focusedColumnRef.current = 'minute'; inputSequenceRef.current = ''; }}>
        <TimeColumn
          label="Min"
          values={minuteValues}
          selected={snapToStep(value.minutes, minuteStep)}
          isDisabled={isMinuteDisabled}
          onSelect={(m) => onChange({ ...value, minutes: m })}
        />
      </div>
      {showSeconds ? (
        <>
          <Separator />
          <div onMouseDown={() => { focusedColumnRef.current = 'second'; inputSequenceRef.current = ''; }}>
            <TimeColumn
              label="Sec"
              values={secondValues}
              selected={snapToStep(value.seconds ?? 0, secondStep)}
              isDisabled={isSecondDisabled}
              onSelect={(s) => onChange({ ...value, seconds: s })}
            />
          </div>
        </>
      ) : null}
      {hourFormat === 12 ? (
        <div className="rdk-flex rdk-flex-col rdk-items-center rdk-gap-1 rdk-ml-1">
          <div className="rdk-text-[10px] rdk-uppercase rdk-tracking-wide rdk-text-rdk-text-muted">
            &nbsp;
          </div>
          <div className="rdk-flex rdk-flex-col rdk-gap-1">
            {(['AM', 'PM'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  const h = value.hours % 12;
                  onChange({ ...value, hours: m === 'PM' ? h + 12 : h });
                }}
                className={cn(
                  'rdk-h-8 rdk-w-12 rdk-rounded-rdk-sm rdk-text-xs rdk-font-medium rdk-transition-colors',
                  m === meridiem
                    ? 'rdk-bg-rdk-primary rdk-text-white'
                    : 'rdk-bg-rdk-surface rdk-text-rdk-text rdk-border rdk-border-rdk-border hover:rdk-bg-rdk-surface-hover',
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Separator() {
  return (
    <span className="rdk-text-rdk-text-muted rdk-text-xl rdk-pb-2 rdk-select-none">
      :
    </span>
  );
}

function stepRange(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  for (let v = min; v <= max; v += step) out.push(v);
  return out;
}

function snapToStep(v: number, step: number): number {
  return Math.round(v / step) * step;
}
