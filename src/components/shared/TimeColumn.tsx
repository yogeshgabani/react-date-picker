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
  /** Function to determine if a value is disabled */
  isDisabled?: (v: number) => boolean;
}

const ITEM_HEIGHT = 32;

export function TimeColumn({
  values,
  selected,
  onSelect,
  label,
  formatItem,
  isDisabled,
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle single digit keys
      if (e.key.length !== 1 || !/[0-9]/.test(e.key)) return;

      // Find value that starts with or matches the typed digit
      let matchingValue: number | undefined;

      for (const v of values) {
        const displayValue = formatItem ? formatItem(v) : pad(v);
        // Match the first digit typed
        if (displayValue.startsWith(e.key) || displayValue.includes(e.key)) {
          matchingValue = v;
          break;
        }
      }

      if (matchingValue !== undefined && !isDisabled?.(matchingValue)) {
        e.preventDefault();
        e.stopPropagation();
        onSelect(matchingValue);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [values, onSelect, formatItem, isDisabled]);

  return (
    <div className="rdk-flex rdk-flex-col rdk-items-center">
      <div className="rdk-text-[10px] rdk-uppercase rdk-tracking-wide rdk-text-rdk-text-muted rdk-pb-1">
        {label}
      </div>
      <div
        ref={containerRef}
        role="listbox"
        aria-label={label}
        tabIndex={0}
        className="rdk-time-col rdk-h-32 rdk-w-14 rdk-overflow-y-auto rdk-snap-y rdk-snap-mandatory rdk-border rdk-border-rdk-border rdk-rounded-rdk-sm rdk-bg-rdk-surface rdk-px-1 rdk-outline-none"
      >
        {values.map((v) => {
          const disabled = isDisabled?.(v) ?? false;
          return (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={v === selected}
              aria-disabled={disabled}
              onClick={() => !disabled && onSelect(v)}
              disabled={disabled}
              style={{ height: ITEM_HEIGHT }}
              className={cn(
                'rdk-w-full rdk-snap-center rdk-text-sm rdk-flex rdk-items-center rdk-justify-center rdk-transition-colors rdk-mx-0.5 rdk-outline-none focus:rdk-outline-none',
                disabled
                  ? 'rdk-text-rdk-disabled rdk-cursor-not-allowed rdk-opacity-50'
                  : v === selected
                    ? 'rdk-bg-rdk-primary rdk-text-white rdk-font-semibold rdk-rounded-md'
                    : 'rdk-text-rdk-text hover:rdk-bg-rdk-surface-hover',
              )}
            >
              {formatItem ? formatItem(v) : pad(v)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
