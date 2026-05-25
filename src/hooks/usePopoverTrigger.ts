import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Manages open state for a popover that is anchored to a focusable trigger.
 *
 * When the popover closes via selection / Escape / outside click, Floating UI's
 * focus manager returns focus to the trigger. Without a guard, the trigger's
 * onFocus handler immediately reopens the popover, causing a visible flicker.
 *
 * This hook returns an `open` flag, a `setOpen` setter, and `openFromFocus` —
 * the focus opener swallows the focus event that fires right after a close.
 */
export function usePopoverTrigger(initial = false) {
  const [open, setOpen] = useState(initial);
  const justClosedRef = useRef(false);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (prevOpenRef.current && !open) {
      justClosedRef.current = true;
      const t = window.setTimeout(() => {
        justClosedRef.current = false;
      }, 150);
      prevOpenRef.current = open;
      return () => window.clearTimeout(t);
    }
    prevOpenRef.current = open;
  }, [open]);

  const openFromFocus = useCallback(() => {
    if (justClosedRef.current) return;
    setOpen(true);
  }, []);

  return { open, setOpen, openFromFocus };
}
