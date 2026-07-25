import { useMemo, type ReactNode } from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import type { Locale, WeekStartsOn } from '../../types';
import { buildCalendar, weekdayHeaders } from '../../utils/calendar';
import { cn } from '../../utils/cn';

export interface MonthGridProps {
  visibleMonth: Date;
  weekStartsOn: WeekStartsOn;
  showWeekNumbers?: boolean;
  locale?: Locale;
  /** Currently focused date (keyboard tracking) */
  focusedDate?: Date;
  /** Currently selected date (single mode) */
  selectedDate?: Date | null;
  /** Range start / end / hover for range mode */
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  rangeHover?: Date | null;
  /** Predicate for disabled state */
  isDisabled?: (d: Date) => boolean;
  /** Called when a day is clicked (only when not disabled) */
  onDayClick?: (d: Date) => void;
  onDayHover?: (d: Date | null) => void;
  /** Optional custom render for the inner content of a day cell */
  renderDay?: (d: Date, defaultNode: ReactNode) => ReactNode;
}

export function MonthGrid({
  visibleMonth,
  weekStartsOn,
  showWeekNumbers = false,
  locale,
  focusedDate,
  selectedDate,
  rangeStart,
  rangeEnd,
  rangeHover,
  isDisabled,
  onDayClick,
  onDayHover,
  renderDay,
}: MonthGridProps) {
  const weeks = useMemo(
    () => buildCalendar(visibleMonth, weekStartsOn),
    [visibleMonth, weekStartsOn],
  );

  const headers = useMemo(
    () =>
      weekdayHeaders(weekStartsOn, (d) =>
        format(d, 'EEEEEE', locale ? { locale } : undefined),
      ),
    [weekStartsOn, locale],
  );

  const effectiveEnd = rangeEnd ?? rangeHover ?? null;
  const hasRange = !!rangeStart && !!effectiveEnd;
  const [rStart, rEnd] = hasRange
    ? rangeStart! <= effectiveEnd!
      ? [rangeStart!, effectiveEnd!]
      : [effectiveEnd!, rangeStart!]
    : [null, null];

  return (
    <div
      role="grid"
      aria-label={format(visibleMonth, 'MMMM yyyy', locale ? { locale } : undefined)}
      className="rdk-px-3 rdk-pb-3"
    >
      <div
        className={cn(
          'rdk-grid rdk-text-center rdk-text-[10px] rdk-font-bold rdk-text-rdk-text-muted rdk-uppercase rdk-tracking-[0.08em] rdk-pb-2 rdk-border-b rdk-border-rdk-border/60 rdk-mb-1',
          showWeekNumbers ? 'rdk-grid-cols-8' : 'rdk-grid-cols-7',
        )}
        role="row"
      >
        {showWeekNumbers ? <span /> : null}
        {headers.map((h, i) => (
          <span key={i} className="rdk-py-1.5" role="columnheader">
            {h}
          </span>
        ))}
      </div>

      {weeks.map((week) => (
        <div
          key={week.days[0].date.toISOString()}
          role="row"
          className={cn(
            'rdk-grid',
            showWeekNumbers ? 'rdk-grid-cols-8' : 'rdk-grid-cols-7',
          )}
        >
          {showWeekNumbers ? (
            <span className="rdk-flex rdk-items-center rdk-justify-center rdk-text-[11px] rdk-text-rdk-text-muted">
              {week.weekNumber}
            </span>
          ) : null}
          {week.days.map(({ date, inCurrentMonth }) => {
            const disabled = isDisabled?.(date) ?? false;
            const isSelected = selectedDate
              ? isSameDay(selectedDate, date)
              : rangeStart && isSameDay(rangeStart, date)
                ? true
                : rangeEnd && isSameDay(rangeEnd, date)
                  ? true
                  : false;

            const isRangeStart = rStart && isSameDay(rStart, date);
            const isRangeEnd = rEnd && isSameDay(rEnd, date);
            const inRange = hasRange && date > rStart! && date < rEnd!;
            const isPreviewEnd =
              rangeStart && !rangeEnd && rangeHover && isSameDay(rangeHover, date);

            const today = isToday(date);
            const focused = focusedDate && isSameDay(focusedDate, date);
            const isRangeEdge = !!(isRangeStart || isRangeEnd);
            // Only mark today when it's actually the cell's dominant state —
            // selected / range edges paint their own fill, and a disabled today
            // should read as disabled.
            const isTodayCell = today && !isSelected && !isRangeEdge && !disabled;

            const defaultNode = (
              <span className="rdk-relative rdk-z-10">{date.getDate()}</span>
            );

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  'rdk-relative rdk-flex rdk-items-center rdk-justify-center rdk-py-0.5',
                  inRange && 'rdk-bg-rdk-range-bg',
                  isRangeEdge && hasRange && 'rdk-bg-rdk-range-bg',
                  isRangeStart && hasRange && 'rdk-rounded-l-full',
                  isRangeEnd && hasRange && 'rdk-rounded-r-full',
                )}
              >
                <button
                  type="button"
                  role="gridcell"
                  tabIndex={focused ? 0 : -1}
                  aria-selected={isSelected || undefined}
                  aria-disabled={disabled || undefined}
                  aria-current={today ? 'date' : undefined}
                  disabled={disabled}
                  onClick={() => !disabled && onDayClick?.(date)}
                  onMouseEnter={() => onDayHover?.(date)}
                  onFocus={() => onDayHover?.(date)}
                  className={cn(
                    'rdk-relative rdk-h-9 rdk-w-9 rdk-flex rdk-items-center rdk-justify-center rdk-text-sm rdk-font-medium rdk-rounded-full rdk-transition-all rdk-duration-200 focus:rdk-outline-none',
                    !inCurrentMonth && 'rdk-text-rdk-text-muted/40',
                    // `text-rdk-text` is emitted after `text-rdk-primary` in the
                    // generated sheet, so it would otherwise win the cascade and
                    // repaint today's number in the plain body colour.
                    inCurrentMonth && !disabled && !isTodayCell && 'rdk-text-rdk-text',
                    disabled && 'rdk-text-rdk-disabled rdk-cursor-not-allowed rdk-line-through rdk-decoration-1',
                    !disabled &&
                      !isSelected &&
                      !inRange &&
                      !isRangeEdge &&
                      'hover:rdk-bg-rdk-primary-soft hover:rdk-text-rdk-primary hover:rdk-scale-110 hover:rdk-font-semibold active:rdk-scale-100',
                    !disabled && inRange && 'hover:rdk-bg-rdk-primary/15',
                    (isRangeStart || isRangeEnd || isSelected) &&
                      'rdk-bg-rdk-primary rdk-text-white rdk-font-bold rdk-shadow-[0_4px_14px_rgba(124,58,237,0.45)] hover:rdk-bg-rdk-primary-hover hover:rdk-scale-110',
                    isPreviewEnd &&
                      !isSelected &&
                      'rdk-ring-2 rdk-ring-rdk-primary/40 rdk-ring-inset',
                    // Solid ring colour on purpose: `ring-2` alone falls back to
                    // Tailwind's default blue `--tw-ring-color` (preflight, which
                    // would define it, is disabled for this library), so the ring
                    // must always name a theme token explicitly.
                    isTodayCell &&
                      'rdk-font-bold rdk-text-rdk-primary rdk-ring-2 rdk-ring-rdk-primary rdk-ring-inset rdk-bg-rdk-primary-soft/40',
                    focused &&
                      !isSelected &&
                      !isRangeEdge &&
                      'rdk-ring-2 rdk-ring-rdk-primary/40',
                  )}
                >
                  {renderDay ? renderDay(date, defaultNode) : defaultNode}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
