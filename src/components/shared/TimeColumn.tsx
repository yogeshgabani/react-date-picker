import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { pad } from '../../utils/format';

interface TimeColumnProps {
  values: number[];
  selected: number;
  onSelect: (v: number) => void;
  label: string;
  /** Render label as 12-hour string for hours column */
  formatItem?: (v: number) => string;
}

const ITEM_HEIGHT = 32;

export function TimeColumn({
  values,
  selected,
  onSelect,
  label,
  formatItem,
}: TimeColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = values.indexOf(selected);
    if (idx === -1) return;
    containerRef.current.scrollTo({
      top: idx * ITEM_HEIGHT,
      behavior: 'smooth',
    });
  }, [selected, values]);

  return (
    <div className="rdk-flex rdk-flex-col rdk-items-center">
      <div className="rdk-text-[10px] rdk-uppercase rdk-tracking-wide rdk-text-rdk-text-muted rdk-pb-1">
        {label}
      </div>
      <div
        ref={containerRef}
        role="listbox"
        aria-label={label}
        className="rdk-time-col rdk-h-32 rdk-w-14 rdk-overflow-y-auto rdk-snap-y rdk-snap-mandatory rdk-border rdk-border-rdk-border rdk-rounded-rdk-sm rdk-bg-rdk-surface"
      >
        {values.map((v) => (
          <button
            key={v}
            type="button"
            role="option"
            aria-selected={v === selected}
            onClick={() => onSelect(v)}
            style={{ height: ITEM_HEIGHT }}
            className={cn(
              'rdk-w-full rdk-snap-center rdk-text-sm rdk-flex rdk-items-center rdk-justify-center rdk-transition-colors',
              v === selected
                ? 'rdk-bg-rdk-primary rdk-text-white rdk-font-semibold'
                : 'rdk-text-rdk-text hover:rdk-bg-rdk-surface-hover',
            )}
          >
            {formatItem ? formatItem(v) : pad(v)}
          </button>
        ))}
      </div>
    </div>
  );
}
