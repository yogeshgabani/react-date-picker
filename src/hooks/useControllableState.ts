import { useCallback, useRef, useState } from 'react';

/**
 * Implements the controlled/uncontrolled pattern. If `value` is provided, the
 * component is controlled and `onChange` is the only way to update. Otherwise
 * the hook owns the state internally seeded from `defaultValue`.
 */
export function useControllableState<T>(opts: {
  value?: T;
  defaultValue?: T;
  onChange?: (v: T) => void;
}): [T | undefined, (next: T) => void] {
  const isControlled = opts.value !== undefined;
  const [internal, setInternal] = useState<T | undefined>(opts.defaultValue);
  const onChangeRef = useRef(opts.onChange);
  onChangeRef.current = opts.onChange;

  const current = isControlled ? opts.value : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
