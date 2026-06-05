import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import type { Size } from '../../types';

interface PickerInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  clearable?: boolean;
  onClear?: () => void;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  hasValue?: boolean;
  invalid?: boolean;
  rootClassName?: string;
}

const sizeMap: Record<Size, string> = {
  sm: 'rdk-h-9 rdk-text-sm rdk-px-3',
  md: 'rdk-h-10 rdk-text-sm rdk-px-3.5',
  lg: 'rdk-h-12 rdk-text-base rdk-px-4',
};

export const PickerInput = forwardRef<HTMLInputElement, PickerInputProps>(
  function PickerInput(
    {
      size = 'md',
      clearable = false,
      onClear,
      icon,
      iconPosition = 'left',
      hasValue,
      invalid,
      className,
      rootClassName,
      disabled,
      readOnly,
      ...rest
    },
    ref,
  ) {
    const iconNode = icon ? (
      <span
        className={cn(
          'rdk-flex rdk-items-center rdk-text-rdk-text-muted rdk-pointer-events-none rdk-transition-colors group-hover:rdk-text-rdk-primary group-focus-within:rdk-text-rdk-primary [&_svg]:rdk-h-4 [&_svg]:rdk-w-4',
          iconPosition === 'right'
            ? 'rdk-pr-3 rdk-pl-1'
            : 'rdk-pl-3 rdk-pr-1',
        )}
      >
        {icon}
      </span>
    ) : null;
    return (
      <div
        className={cn(
          'rdk-group rdk-relative rdk-inline-flex rdk-items-center rdk-w-full rdk-text-rdk-text rdk-border-2 rdk-rounded-rdk rdk-transition-all rdk-duration-200 rdk-font-rdk',
          invalid
            ? 'rdk-bg-rdk-surface rdk-border-rdk-danger focus-within:rdk-ring-4 focus-within:rdk-ring-rdk-danger/15'
            : 'rdk-bg-rdk-surface-hover rdk-border-rdk-border-strong hover:rdk-bg-rdk-surface hover:rdk-border-rdk-primary hover:rdk-shadow-rdk focus-within:rdk-bg-rdk-surface focus-within:rdk-border-rdk-primary focus-within:rdk-ring-4 focus-within:rdk-ring-rdk-primary/15 focus-within:rdk-shadow-rdk',
          disabled && 'rdk-opacity-60 rdk-cursor-not-allowed',
          rootClassName,
        )}
      >
        {iconPosition === 'left' ? iconNode : null}
        <input
          ref={ref}
          {...rest}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            'rdk-flex-1 rdk-bg-transparent rdk-outline-none rdk-w-full rdk-min-w-0 rdk-placeholder:rdk-text-rdk-text-muted rdk-font-medium',
            sizeMap[size],
            icon && iconPosition === 'left' ? 'rdk-pl-3' : null,
            icon && iconPosition === 'right' ? 'rdk-pr-3' : null,
            className,
          )}
        />
        {clearable && hasValue && !disabled && !readOnly ? (
          <button
            type="button"
            aria-label="Clear input"
            title="Clear"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear?.();
            }}
            className="rdk-mr-2 rdk-h-7 rdk-w-7 rdk-rounded-full rdk-flex rdk-items-center rdk-justify-center rdk-text-rdk-text-muted rdk-bg-rdk-surface-hover rdk-border rdk-border-rdk-border rdk-transition-all hover:rdk-bg-rdk-danger hover:rdk-border-rdk-danger hover:rdk-text-white hover:rdk-shadow-[0_2px_6px_rgba(239,68,68,0.35)] hover:rdk-scale-110 active:rdk-scale-95 focus:rdk-outline-none focus-visible:rdk-ring-2 focus-visible:rdk-ring-rdk-danger/40"
          >
            <svg viewBox="0 0 20 20" className="rdk-h-3.5 rdk-w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </button>
        ) : null}
        {iconPosition === 'right' ? iconNode : null}
      </div>
    );
  },
);
