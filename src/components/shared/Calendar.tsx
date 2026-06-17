import { useState, type ReactNode } from 'react';
import { addMonths } from 'date-fns';
import { CalendarHeader } from './CalendarHeader';
import { MonthGrid } from './MonthGrid';
import { YearMonthPicker } from './YearMonthPicker';
import { cn } from '../../utils/cn';
import type { CalendarView, Locale, WeekStartsOn } from '../../types';

interface CalendarProps {
  visibleMonth: Date;
  onVisibleMonthChange: (d: Date) => void;
  numberOfMonths?: number;
  weekStartsOn?: WeekStartsOn;
  showWeekNumbers?: boolean;
  locale?: Locale;

  focusedDate?: Date;
  selectedDate?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  rangeHover?: Date | null;

  isDisabled?: (d: Date) => boolean;
  onDayClick?: (d: Date) => void;
  onDayHover?: (d: Date | null) => void;
  renderDay?: (d: Date, defaultNode: ReactNode) => ReactNode;

  /** Calendar mode — 'day' (default), 'month' or 'year'. */
  view?: CalendarView;
  /** Position of the month/year header relative to the grid. */
  headerPosition?: 'top' | 'bottom';

  className?: string;
}

export function Calendar({
  visibleMonth,
  onVisibleMonthChange,
  numberOfMonths = 1,
  weekStartsOn = 0,
  showWeekNumbers,
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
  view = 'day',
  headerPosition = 'top',
  className,
}: CalendarProps) {
  const [pickerMode, setPickerMode] = useState<'days' | 'yearmonth'>('days');
  const months = Array.from({ length: numberOfMonths }, (_, i) =>
    addMonths(visibleMonth, i),
  );

  // view='month' | 'year' → render a locked YearMonthPicker that
  // commits a date (1st of month or Jan 1 of year) via onDayClick.
  if (view === 'month' || view === 'year') {
    return (
      <div className={cn('rdk-w-full rdk-max-w-[320px]', className)}>
        <YearMonthPicker
          visibleMonth={visibleMonth}
          onSelect={onVisibleMonthChange}
          locale={locale}
          lock={view}
          onCommit={(d) => onDayClick?.(d)}
          isDisabled={isDisabled}
        />
      </div>
    );
  }

  if (pickerMode === 'yearmonth') {
    return (
      <div className={cn('rdk-w-full rdk-max-w-[320px]', className)}>
        <YearMonthPicker
          visibleMonth={visibleMonth}
          onSelect={(d) => {
            onVisibleMonthChange(d);
            setPickerMode('days');
          }}
          locale={locale}
          isDisabled={isDisabled}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rdk-flex rdk-flex-col sm:rdk-flex-row rdk-gap-0',
        className,
      )}
      onMouseLeave={() => onDayHover?.(null)}
    >
      {months.map((m, idx) => {
        const header = (
          <CalendarHeader
            visibleMonth={m}
            onPrevMonth={() => onVisibleMonthChange(addMonths(visibleMonth, -1))}
            onNextMonth={() => onVisibleMonthChange(addMonths(visibleMonth, 1))}
            onPrevYear={
              idx === 0
                ? () => onVisibleMonthChange(addMonths(visibleMonth, -12))
                : undefined
            }
            onNextYear={
              idx === numberOfMonths - 1
                ? () => onVisibleMonthChange(addMonths(visibleMonth, 12))
                : undefined
            }
            onClickMonthYear={() => setPickerMode('yearmonth')}
            locale={locale}
            hideYearNav={numberOfMonths > 1 && idx !== 0 && idx !== numberOfMonths - 1}
            className={headerPosition === 'bottom' ? 'rdk-pt-2 rdk-pb-3 rdk-border-t rdk-border-rdk-border' : undefined}
          />
        );
        const grid = (
          <MonthGrid
            visibleMonth={m}
            weekStartsOn={weekStartsOn}
            showWeekNumbers={showWeekNumbers}
            locale={locale}
            focusedDate={focusedDate}
            selectedDate={selectedDate}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            rangeHover={rangeHover}
            isDisabled={isDisabled}
            onDayClick={onDayClick}
            onDayHover={onDayHover}
            renderDay={renderDay}
          />
        );
        return (
          <div
            key={m.toISOString()}
            className={cn(
              'rdk-w-full rdk-max-w-[320px] sm:rdk-w-[320px]',
              idx > 0 && 'sm:rdk-border-l sm:rdk-border-rdk-border',
            )}
          >
            {headerPosition === 'bottom' ? (
              <>
                {grid}
                {header}
              </>
            ) : (
              <>
                {header}
                {grid}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
