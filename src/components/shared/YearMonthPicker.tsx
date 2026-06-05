import { useMemo, useState } from 'react';
import { setMonth, setYear, getYear, getMonth, format, startOfMonth, startOfYear } from 'date-fns';
import { cn } from '../../utils/cn';
import type { Locale } from '../../types';
import { ChevronLeft, ChevronRight } from './Icons';

interface YearMonthPickerProps {
  visibleMonth: Date;
  onSelect: (d: Date) => void;
  locale?: Locale;
  /** Range of years to expose (e.g. 1900..2100) */
  minYear?: number;
  maxYear?: number;
  /**
   * When set, locks the picker to month-only or year-only mode and
   * disables switching between them. Used by `view='month'` and
   * `view='year'` DatePicker modes.
   */
  lock?: 'month' | 'year';
  /**
   * Fired when the user clicks a month or year in locked mode. The
   * date is normalised to the 1st of the selected month (lock='month')
   * or January 1 of the selected year (lock='year'). When omitted,
   * locked selections just update `visibleMonth` via `onSelect`.
   */
  onCommit?: (d: Date) => void;
  /** Optional disabled predicate — applied per cell in locked mode. */
  isDisabled?: (d: Date) => boolean;
}

/**
 * Two-panel year/month picker shown when the user clicks the month/year label
 * in the calendar header. Can also be locked to month- or year-only mode
 * to back the DatePicker `view='month' | 'year'` modes.
 */
export function YearMonthPicker({
  visibleMonth,
  onSelect,
  locale,
  minYear = 1900,
  maxYear = 2100,
  lock,
  onCommit,
  isDisabled,
}: YearMonthPickerProps) {
  const [mode, setMode] = useState<'year' | 'month'>(lock ?? 'month');
  const [yearWindow, setYearWindow] = useState(() => {
    const y = getYear(visibleMonth);
    return Math.floor(y / 12) * 12;
  });

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        format(new Date(2024, i, 1), 'MMM', locale ? { locale } : undefined),
      ),
    [locale],
  );

  if (mode === 'year') {
    const years = Array.from({ length: 12 }, (_, i) => yearWindow + i);
    return (
      <div className="rdk-p-3">
        <div className="rdk-flex rdk-items-center rdk-justify-between rdk-pb-3">
          <button
            type="button"
            aria-label="Previous years"
            onClick={() => setYearWindow((y) => Math.max(minYear, y - 12))}
            className="rdk-h-8 rdk-w-8 rdk-rounded-full rdk-flex rdk-items-center rdk-justify-center rdk-text-rdk-text-muted rdk-transition-all hover:rdk-bg-rdk-primary hover:rdk-text-white hover:rdk-scale-110 active:rdk-scale-95"
          >
            <ChevronLeft className="rdk-flip-x rdk-h-4 rdk-w-4" />
          </button>
          <div className="rdk-text-sm rdk-font-semibold rdk-text-rdk-text">
            {yearWindow} – {yearWindow + 11}
          </div>
          <button
            type="button"
            aria-label="Next years"
            onClick={() => setYearWindow((y) => Math.min(maxYear - 11, y + 12))}
            className="rdk-h-8 rdk-w-8 rdk-rounded-full rdk-flex rdk-items-center rdk-justify-center rdk-text-rdk-text-muted rdk-transition-all hover:rdk-bg-rdk-primary hover:rdk-text-white hover:rdk-scale-110 active:rdk-scale-95"
          >
            <ChevronRight className="rdk-flip-x rdk-h-4 rdk-w-4" />
          </button>
        </div>
        <div className="rdk-grid rdk-grid-cols-3 rdk-gap-2">
          {years.map((y) => {
            const selected = getYear(visibleMonth) === y;
            const yearStart = startOfYear(setYear(visibleMonth, y));
            const disabled = isDisabled ? isDisabled(yearStart) : false;
            return (
              <button
                key={y}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (lock === 'year' && onCommit) {
                    onCommit(yearStart);
                    return;
                  }
                  onSelect(setYear(visibleMonth, y));
                  if (!lock) setMode('month');
                }}
                className={cn(
                  'rdk-h-10 rdk-flex rdk-items-center rdk-justify-center rdk-text-center rdk-rounded-rdk-sm rdk-text-sm rdk-font-medium rdk-transition-all',
                  disabled
                    ? 'rdk-text-rdk-disabled rdk-cursor-not-allowed'
                    : selected
                      ? 'rdk-bg-rdk-primary rdk-text-white rdk-shadow-[0_2px_8px_rgba(124,58,237,0.35)] hover:rdk-bg-rdk-primary-hover'
                      : 'rdk-text-rdk-text hover:rdk-bg-rdk-primary-soft hover:rdk-text-rdk-primary',
                )}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rdk-p-3">
      <div className="rdk-flex rdk-items-center rdk-justify-center rdk-pb-3">
        <button
          type="button"
          onClick={() => {
            if (lock !== 'month') setMode('year');
          }}
          className="rdk-text-sm rdk-font-bold rdk-text-rdk-text rdk-px-4 rdk-py-1.5 rdk-rounded-rdk-sm rdk-transition-all hover:rdk-bg-rdk-primary-soft hover:rdk-text-rdk-primary rdk-tabular-nums"
        >
          {getYear(visibleMonth)}
        </button>
      </div>
      <div className="rdk-grid rdk-grid-cols-3 rdk-gap-2">
        {months.map((label, i) => {
          const selected = getMonth(visibleMonth) === i;
          const monthStart = startOfMonth(setMonth(visibleMonth, i));
          const disabled = isDisabled ? isDisabled(monthStart) : false;
          return (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (lock === 'month' && onCommit) {
                  onCommit(monthStart);
                  return;
                }
                onSelect(setMonth(visibleMonth, i));
              }}
              className={cn(
                'rdk-h-10 rdk-rounded-rdk-sm rdk-text-sm rdk-font-medium rdk-transition-all',
                disabled
                  ? 'rdk-text-rdk-disabled rdk-cursor-not-allowed'
                  : selected
                    ? 'rdk-bg-rdk-primary rdk-text-white rdk-shadow-sm hover:rdk-bg-rdk-primary-hover'
                    : 'rdk-text-rdk-text hover:rdk-bg-rdk-surface-hover',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
