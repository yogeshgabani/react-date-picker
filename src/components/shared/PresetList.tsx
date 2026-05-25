import { isSameDay } from 'date-fns';
import { cn } from '../../utils/cn';
import type { DateRange, Preset } from '../../types';

interface PresetListProps {
  presets: Preset[];
  value: DateRange;
  onSelect: (range: DateRange) => void;
}

export function PresetList({ presets, value, onSelect }: PresetListProps) {
  return (
    <div className="rdk-flex rdk-flex-col sm:rdk-min-w-[170px] rdk-border-b sm:rdk-border-b-0 sm:rdk-border-r rdk-border-rdk-border rdk-bg-rdk-primary-soft/30">
      <div className="rdk-px-4 rdk-pt-3 rdk-pb-2">
        <span className="rdk-text-[10px] rdk-font-bold rdk-uppercase rdk-tracking-[0.1em] rdk-text-rdk-primary">
          Quick select
        </span>
      </div>
      <div className="rdk-flex rdk-flex-col rdk-gap-0.5 rdk-px-3 rdk-pb-3">
        {presets.map((p) => {
          const r = p.range();
          const matches =
            value.start &&
            value.end &&
            r.start &&
            r.end &&
            isSameDay(value.start, r.start) &&
            isSameDay(value.end, r.end);
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onSelect(p.range())}
              className={cn(
                'rdk-group rdk-relative rdk-flex rdk-items-center rdk-gap-2 rdk-text-left rdk-text-sm rdk-px-2.5 rdk-py-1.5 rdk-rounded-rdk-sm rdk-transition-all rdk-duration-200',
                matches
                  ? 'rdk-bg-rdk-primary rdk-text-white rdk-font-semibold rdk-shadow-[0_3px_10px_rgba(124,58,237,0.3)]'
                  : 'rdk-text-rdk-text hover:rdk-bg-white hover:rdk-text-rdk-primary hover:rdk-shadow-rdk hover:rdk-font-semibold',
              )}
            >
              <span className="rdk-flex-1 rdk-truncate">{p.label}</span>
              {matches ? (
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="rdk-h-4 rdk-w-4 rdk-text-white rdk-flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 8.5 6.5 12 13 4.5" />
                </svg>
              ) : (
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="rdk-h-3.5 rdk-w-3.5 rdk-text-rdk-primary rdk-flex-shrink-0 rdk-opacity-0 -rdk-translate-x-1 group-hover:rdk-opacity-100 group-hover:rdk-translate-x-0 rdk-transition-all"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="5 3 11 8 5 13" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
