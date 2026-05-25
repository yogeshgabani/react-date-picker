import { useEffect, useRef } from 'react';

/**
 * Calls `handler` when a pointerdown happens outside any of the refs.
 * Used to close popovers when the user clicks/taps elsewhere.
 */
export function useOutsideClick(
  refs: Array<React.RefObject<HTMLElement>>,
  handler: (e: MouseEvent | TouchEvent) => void,
  enabled = true,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const listener = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      for (const ref of refs) {
        if (ref.current && ref.current.contains(target)) return;
      }
      handlerRef.current(e);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, enabled]);
}
