import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useLayoutEffect,
  useState,
} from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
  FloatingFocusManager,
  useDismiss,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { cn } from '../../utils/cn';

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  className?: string;
  /** Distance from the trigger in pixels */
  gutter?: number;
  /**
   * `data-rdk-theme` value for the panel. The popover is portaled to
   * `document.body`, so it is NOT inside the picker's own theme scope — the
   * surface it paints has to carry the scope itself, otherwise the shell
   * resolves the page-level tokens while its children resolve the picker's.
   */
  theme?: 'light' | 'dark' | 'auto';
  /** `--rdk-color-*` overrides from the `colors` prop, scoped to the panel. */
  themeStyle?: CSSProperties;
}

/**
 * Floating panel anchored to a trigger. Handles outside-click dismiss,
 * focus trap, and viewport collision avoidance via @floating-ui/react.
 */
export function Popover({
  open,
  onOpenChange,
  anchorRef,
  children,
  className,
  gutter = 8,
  theme,
  themeStyle,
}: PopoverProps) {
  // Track the reference element via state so useFloating gets it BEFORE the
  // first render — otherwise the panel briefly paints at (0,0) and then jumps
  // to the correct position.
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(
    () => anchorRef.current,
  );

  // Sync on every render in case the anchor mounts after the popover (the
  // first DatePicker render commits the wrapper div's ref AFTER the Popover's
  // useState initializer runs, so the lazy init may have captured null).
  useLayoutEffect(() => {
    if (anchorRef.current && anchorRef.current !== referenceEl) {
      setReferenceEl(anchorRef.current);
    }
  });

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange,
    placement: 'bottom-start',
    middleware: [offset(gutter), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    elements: { reference: referenceEl },
  });

  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  // Hard guard: never render the popover until we actually have a reference
  // AND floating-ui has computed a position for it. This eliminates the
  // top-left flash before re-positioning runs.
  if (!open || !referenceEl) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            visibility: isPositioned ? 'visible' : 'hidden',
            zIndex: 9999,
          }}
          {...getFloatingProps()}
        >
          <div
            data-rdk-theme={theme}
            style={themeStyle}
            className={cn(
              'rdk-popover-surface rdk-text-rdk-text rdk-border rdk-border-rdk-border rdk-rounded-rdk-lg rdk-shadow-rdk-lg rdk-font-rdk rdk-animate-rdk-in rdk-overflow-hidden',
              className,
            )}
          >
            {children}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
