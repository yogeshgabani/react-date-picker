import { useId } from 'react';

/**
 * Returns a deterministic id prefixed with `rdk-`. Wraps React's useId so
 * SSR-safe ids are used for ARIA relationships.
 */
export function useRdkId(suffix?: string): string {
  const id = useId();
  return `rdk-${id}${suffix ? `-${suffix}` : ''}`;
}
