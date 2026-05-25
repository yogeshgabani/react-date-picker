import { useState, type ReactNode } from 'react';
import { addMonths } from 'date-fns';
import { CalendarHeader } from './CalendarHeader';
import { MonthGrid } from './MonthGrid';
import { YearMonthPicker } from './YearMonthPicker';
import { cn } from '../../utils/cn';
import type { Locale, WeekStartsOn } from '../../types';

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
  className,
}: CalendarProps) {
  const [pickerMode, setPickerMode] = useState<'days' | 'yearmonth'>('days');
  const months = Array.from({ length: numberOfMonths }, (_, i) =>
    addMonths(visibleMonth, i),
  );

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
      {months.map((m, idx) => (
        <div
          key={m.toISOString()}
          className={cn(
            'rdk-w-full rdk-max-w-[320px] sm:rdk-w-[320px]',
            idx > 0 && 'sm:rdk-border-l sm:rdk-border-rdk-border',
          )}
        >
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
          />
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
        </div>
      ))}
    </div>
  );
}
