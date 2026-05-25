import { useMemo } from 'react';
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
}

export function TimePanel({
  value,
  onChange,
  hourFormat,
  minuteStep,
  secondStep,
  showSeconds,
  className,
}: TimePanelProps) {
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

  return (
    <div
      className={cn(
        'rdk-flex rdk-items-end rdk-gap-2 rdk-p-3 rdk-bg-rdk-surface',
        className,
      )}
    >
      <TimeColumn
        label="Hour"
        values={hourValues}
        selected={displayHour}
        onSelect={(h) => {
          if (hourFormat === 12) {
            const base = h === 12 ? 0 : h;
            onChange({ ...value, hours: meridiem === 'PM' ? base + 12 : base });
          } else {
            onChange({ ...value, hours: h });
          }
        }}
      />
      <Separator />
      <TimeColumn
        label="Min"
        values={minuteValues}
        selected={snapToStep(value.minutes, minuteStep)}
        onSelect={(m) => onChange({ ...value, minutes: m })}
      />
      {showSeconds ? (
        <>
          <Separator />
          <TimeColumn
            label="Sec"
            values={secondValues}
            selected={snapToStep(value.seconds ?? 0, secondStep)}
            onSelect={(s) => onChange({ ...value, seconds: s })}
          />
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
