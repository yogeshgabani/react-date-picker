import { useCallback, useMemo, useState } from 'react';
import { addDays, addMonths, addYears, isSameDay, startOfMonth } from 'date-fns';
import type { MultiDatePickerProps } from '../types';
import { useControllableState } from './useControllableState';
import { isDateDisabled } from '../utils/constraints';

export interface UseMultiDatePickerResult {
  value: Date[];
  toggleDate: (date: Date) => void;
  setValue: (dates: Date[]) => void;
  isSelected: (date: Date) => boolean;
  visibleMonth: Date;
  setVisibleMonth: (d: Date) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToPrevYear: () => void;
  goToNextYear: () => void;
  focusedDate: Date;
  setFocusedDate: (d: Date) => void;
  moveFocus: (delta: { days?: number; months?: number; years?: number }) => void;
  isDisabled: (d: Date) => boolean;
}

export function useMultiDatePicker(
  props: Pick<
    MultiDatePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'minDate' | 'maxDate' | 'disabledDates'
  >,
): UseMultiDatePickerResult {
  const [value, setValue] = useControllableState<Date[]>({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: props.onChange,
  });

  const dates = value ?? [];
  const seed = dates[0] ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(seed));
  const [focusedDate, setFocusedDate] = useState<Date>(seed);

  const isDisabled = useCallback(
    (d: Date) =>
      isDateDisabled(d, {
        minDate: props.minDate,
        maxDate: props.maxDate,
        disabledDates: props.disabledDates,
      }),
    [props.minDate, props.maxDate, props.disabledDates],
  );

  const isSelected = useCallback(
    (d: Date) => dates.some((sel) => isSameDay(sel, d)),
    [dates],
  );

  const toggleDate = useCallback(
    (d: Date) => {
      if (dates.some((sel) => isSameDay(sel, d))) {
        setValue(dates.filter((sel) => !isSameDay(sel, d)));
      } else {
        setValue([...dates, d].sort((a, b) => a.getTime() - b.getTime()));
      }
    },
    [dates, setValue],
  );

  const moveFocus = useCallback(
    (delta: { days?: number; months?: number; years?: number }) => {
      setFocusedDate((prev) => {
        let next = prev;
        if (delta.days) next = addDays(next, delta.days);
        if (delta.months) next = addMonths(next, delta.months);
        if (delta.years) next = addYears(next, delta.years);
        setVisibleMonth(startOfMonth(next));
        return next;
      });
    },
    [],
  );

  return useMemo<UseMultiDatePickerResult>(
    () => ({
      value: dates,
      toggleDate,
      setValue: (d) => setValue(d),
      isSelected,
      visibleMonth,
      setVisibleMonth,
      goToPrevMonth: () => setVisibleMonth((m) => addMonths(m, -1)),
      goToNextMonth: () => setVisibleMonth((m) => addMonths(m, 1)),
      goToPrevYear: () => setVisibleMonth((m) => addYears(m, -1)),
      goToNextYear: () => setVisibleMonth((m) => addYears(m, 1)),
      focusedDate,
      setFocusedDate,
      moveFocus,
      isDisabled,
    }),
    [dates, toggleDate, setValue, isSelected, visibleMonth, focusedDate, moveFocus, isDisabled],
  );
}
