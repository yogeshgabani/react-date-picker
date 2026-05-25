import { useCallback, useMemo } from 'react';
import type { TimePickerProps, TimeValue } from '../types';
import { useControllableState } from './useControllableState';

export interface UseTimePickerResult {
  value: TimeValue | null;
  setHours: (h: number) => void;
  setMinutes: (m: number) => void;
  setSeconds: (s: number) => void;
  setMeridiem: (m: 'AM' | 'PM') => void;
  setValue: (t: TimeValue | null) => void;
}

export function useTimePicker(
  props: Pick<TimePickerProps, 'value' | 'defaultValue' | 'onChange'>,
): UseTimePickerResult {
  const [value, setValue] = useControllableState<TimeValue | null>({
    value: props.value,
    defaultValue: props.defaultValue ?? null,
    onChange: props.onChange,
  });
  const current: TimeValue = value ?? { hours: 0, minutes: 0, seconds: 0 };

  const setHours = useCallback(
    (h: number) => setValue({ ...current, hours: clamp(h, 0, 23) }),
    [current, setValue],
  );
  const setMinutes = useCallback(
    (m: number) => setValue({ ...current, minutes: clamp(m, 0, 59) }),
    [current, setValue],
  );
  const setSeconds = useCallback(
    (s: number) => setValue({ ...current, seconds: clamp(s, 0, 59) }),
    [current, setValue],
  );
  const setMeridiem = useCallback(
    (m: 'AM' | 'PM') => {
      const h = current.hours % 12;
      setValue({ ...current, hours: m === 'PM' ? h + 12 : h });
    },
    [current, setValue],
  );

  return useMemo<UseTimePickerResult>(
    () => ({
      value: value ?? null,
      setHours,
      setMinutes,
      setSeconds,
      setMeridiem,
      setValue: (t) => setValue(t),
    }),
    [value, setHours, setMinutes, setSeconds, setMeridiem, setValue],
  );
}

function clamp(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}
