import { useCallback, useMemo, useState } from 'react';
import { addMonths, isBefore, startOfMonth } from 'date-fns';
import type { DateRange, DateRangePickerProps } from '../types';
import { useControllableState } from './useControllableState';
import { isDateDisabled } from '../utils/constraints';

export interface UseDateRangeResult {
  value: DateRange;
  setValue: (range: DateRange) => void;
  /** Date the user is currently hovering — used to preview the range */
  hoverDate: Date | null;
  setHoverDate: (d: Date | null) => void;
  /** Which endpoint the next click will set: 'start' or 'end' */
  selectionStep: 'start' | 'end';
  selectDate: (d: Date) => void;
  visibleMonth: Date;
  setVisibleMonth: (d: Date) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  isDisabled: (d: Date) => boolean;
  reset: () => void;
}

export function useDateRange(
  props: Pick<
    DateRangePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'minDate' | 'maxDate' | 'disabledDates'
  >,
): UseDateRangeResult {
  const [value, setValueInternal] = useControllableState<DateRange>({
    value: props.value,
    defaultValue: props.defaultValue ?? { start: null, end: null },
    onChange: props.onChange,
  });
  const range = value ?? { start: null, end: null };

  const seed = range.start ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(seed));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>(
    range.start && !range.end ? 'end' : 'start',
  );

  const isDisabled = useCallback(
    (d: Date) =>
      isDateDisabled(d, {
        minDate: props.minDate,
        maxDate: props.maxDate,
        disabledDates: props.disabledDates,
      }),
    [props.minDate, props.maxDate, props.disabledDates],
  );

  const selectDate = useCallback(
    (d: Date) => {
      if (isDisabled(d)) return;
      if (selectionStep === 'start' || !range.start) {
        setValueInternal({ start: d, end: null });
        setSelectionStep('end');
        return;
      }
      // Setting end
      if (isBefore(d, range.start)) {
        // user picked a date before the start — restart from this date
        setValueInternal({ start: d, end: null });
        setSelectionStep('end');
        return;
      }
      setValueInternal({ start: range.start, end: d });
      setSelectionStep('start');
      setHoverDate(null);
    },
    [isDisabled, range.start, selectionStep, setValueInternal],
  );

  const reset = useCallback(() => {
    setValueInternal({ start: null, end: null });
    setSelectionStep('start');
    setHoverDate(null);
  }, [setValueInternal]);

  return useMemo<UseDateRangeResult>(
    () => ({
      value: range,
      setValue: (r) => {
        setValueInternal(r);
        setSelectionStep(r.start && !r.end ? 'end' : 'start');
      },
      hoverDate,
      setHoverDate,
      selectionStep,
      selectDate,
      visibleMonth,
      setVisibleMonth,
      goToPrevMonth: () => setVisibleMonth((m) => addMonths(m, -1)),
      goToNextMonth: () => setVisibleMonth((m) => addMonths(m, 1)),
      isDisabled,
      reset,
    }),
    [
      range,
      setValueInternal,
      hoverDate,
      selectionStep,
      selectDate,
      visibleMonth,
      isDisabled,
      reset,
    ],
  );
}
