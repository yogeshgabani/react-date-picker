import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from './Icons';
import { cn } from '../../utils/cn';
import type { Locale } from '../../types';

interface CalendarHeaderProps {
  visibleMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear?: () => void;
  onNextYear?: () => void;
  onClickMonthYear?: () => void;
  locale?: Locale;
  /** Hide the prev/next year double chevrons (useful for the second month in a range view) */
  hideYearNav?: boolean;
  className?: string;
}

export function CalendarHeader({
  visibleMonth,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  onClickMonthYear,
  locale,
  hideYearNav,
  className,
}: CalendarHeaderProps) {
  const monthLabel = format(visibleMonth, 'MMMM', locale ? { locale } : undefined);
  const yearLabel = format(visibleMonth, 'yyyy', locale ? { locale } : undefined);
  return (
    <div
      className={cn(
        'rdk-flex rdk-items-center rdk-justify-between rdk-px-3 rdk-pt-3 rdk-pb-2',
        className,
      )}
    >
      <div className="rdk-flex rdk-items-center rdk-gap-1">
        {!hideYearNav && onPrevYear ? (
          <NavButton onClick={onPrevYear} label="Previous year">
            <ChevronsLeft className="rdk-flip-x rdk-h-4 rdk-w-4" />
          </NavButton>
        ) : null}
        <NavButton onClick={onPrevMonth} label="Previous month">
          <ChevronLeft className="rdk-flip-x rdk-h-4 rdk-w-4" />
        </NavButton>
      </div>

      <button
        type="button"
        onClick={onClickMonthYear}
        className="rdk-text-sm rdk-font-bold rdk-text-rdk-text rdk-px-2.5 rdk-py-1.5 rdk-rounded-rdk-sm rdk-transition-all hover:rdk-bg-rdk-primary-soft hover:rdk-text-rdk-primary focus:rdk-outline-none focus-visible:rdk-ring-2 focus-visible:rdk-ring-rdk-primary/40 rdk-tabular-nums"
      >
        <span>{monthLabel}</span>
        <span className="rdk-ml-1.5 rdk-text-rdk-text-muted rdk-font-semibold">{yearLabel}</span>
      </button>

      <div className="rdk-flex rdk-items-center rdk-gap-1">
        <NavButton onClick={onNextMonth} label="Next month">
          <ChevronRight className="rdk-flip-x rdk-h-4 rdk-w-4" />
        </NavButton>
        {!hideYearNav && onNextYear ? (
          <NavButton onClick={onNextYear} label="Next year">
            <ChevronsRight className="rdk-flip-x rdk-h-4 rdk-w-4" />
          </NavButton>
        ) : null}
      </div>
    </div>
  );
}

function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rdk-h-8 rdk-w-8 rdk-rounded-full rdk-flex rdk-items-center rdk-justify-center rdk-text-rdk-text-muted rdk-transition-all hover:rdk-bg-rdk-primary hover:rdk-text-white hover:rdk-shadow-[0_2px_6px_rgba(124,58,237,0.35)] hover:rdk-scale-110 active:rdk-scale-95 focus:rdk-outline-none focus-visible:rdk-ring-2 focus-visible:rdk-ring-rdk-primary/40"
    >
      {children}
    </button>
  );
}
