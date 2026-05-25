import { useCallback, type KeyboardEvent } from 'react';

interface KeyboardNavOpts {
  onMove: (delta: { days?: number; months?: number; years?: number }) => void;
  onSelect: () => void;
  onCancel?: () => void;
}

/**
 * Standard calendar keyboard nav: arrows / PgUp / PgDn / Home / End / Enter / Esc.
 * Returned handler should be attached to the calendar's outer container.
 */
export function useCalendarKeyboard(opts: KeyboardNavOpts) {
  const { onMove, onSelect, onCancel } = opts;
  return useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onMove({ days: -1 });
          return;
        case 'ArrowRight':
          e.preventDefault();
          onMove({ days: 1 });
          return;
        case 'ArrowUp':
          e.preventDefault();
          onMove({ days: -7 });
          return;
        case 'ArrowDown':
          e.preventDefault();
          onMove({ days: 7 });
          return;
        case 'PageUp':
          e.preventDefault();
          onMove(e.shiftKey ? { years: -1 } : { months: -1 });
          return;
        case 'PageDown':
          e.preventDefault();
          onMove(e.shiftKey ? { years: 1 } : { months: 1 });
          return;
        case 'Home':
          e.preventDefault();
          onMove({ days: -((new Date().getDay() + 7) % 7) });
          return;
        case 'End':
          e.preventDefault();
          onMove({ days: 6 - new Date().getDay() });
          return;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect();
          return;
        case 'Escape':
          if (onCancel) {
            e.preventDefault();
            onCancel();
          }
          return;
      }
    },
    [onMove, onSelect, onCancel],
  );
}
