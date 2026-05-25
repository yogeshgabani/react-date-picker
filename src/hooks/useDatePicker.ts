import { useCallback, useMemo, useState } from 'react';
import { addDays, addMonths, addYears, startOfMonth } from 'date-fns';
import type { DatePickerProps } from '../types';
import { useControllableState } from './useControllableState';
import { isDateDisabled } from '../utils/constraints';

export interface UseDatePickerResult {
  value: Date | null;
  setValue: (date: Date | null) => void;
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

export function useDatePicker(
  props: Pick<
    DatePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'minDate' | 'maxDate' | 'disabledDates'
  >,
): UseDatePickerResult {
  const [value, setValue] = useControllableState<Date | null>({
    value: props.value,
    defaultValue: props.defaultValue ?? null,
    onChange: props.onChange,
  });

  const seed = value ?? new Date();
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

  return useMemo<UseDatePickerResult>(
    () => ({
      value: value ?? null,
      setValue: (d) => setValue(d),
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
    [value, setValue, visibleMonth, focusedDate, moveFocus, isDisabled],
  );
}
