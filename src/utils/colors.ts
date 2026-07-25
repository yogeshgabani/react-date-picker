import type { CSSProperties } from 'react';
import type { PickerColors } from '../types';

const VAR_MAP: Record<keyof PickerColors, string> = {
  primary: '--rdk-color-primary',
  primaryHover: '--rdk-color-primary-hover',
  primarySoft: '--rdk-color-primary-soft',
  background: '--rdk-color-bg',
  surface: '--rdk-color-surface',
  popover: '--rdk-color-popover',
  popoverBlur: '--rdk-popover-backdrop',
  surfaceHover: '--rdk-color-surface-hover',
  text: '--rdk-color-text',
  textMuted: '--rdk-color-text-muted',
  border: '--rdk-color-border',
  borderStrong: '--rdk-color-border-strong',
  danger: '--rdk-color-danger',
  disabled: '--rdk-color-disabled',
  rangeBg: '--rdk-color-range-bg',
  focus: '--rdk-color-primary',
};

/**
 * Convert a {@link PickerColors} object into a style object containing
 * `--rdk-color-*` CSS variables. Returns `undefined` when no keys are
 * set so callers can spread the result without producing an empty
 * `style` attribute.
 */
export function colorsToCssVars(
  colors: PickerColors | undefined,
): CSSProperties | undefined {
  if (!colors) return undefined;
  const out: Record<string, string> = {};
  let any = false;
  for (const key of Object.keys(colors) as Array<keyof PickerColors>) {
    const v = colors[key];
    if (typeof v === 'string' && v.length > 0) {
      // `popoverBlur` feeds a filter list, not a colour. Accept the common
      // shorthand (a bare length) as well as a full filter function.
      out[VAR_MAP[key]] =
        key === 'popoverBlur' && !v.includes('(') ? `blur(${v})` : v;
      any = true;
    }
  }
  return any ? (out as CSSProperties) : undefined;
}

/**
 * Merge a user-provided style object with the CSS-variable style
 * generated from {@link PickerColors}. User-provided keys win.
 */
export function mergeColorStyle(
  colors: PickerColors | undefined,
  userStyle?: CSSProperties,
): CSSProperties | undefined {
  const vars = colorsToCssVars(colors);
  if (!vars) return userStyle;
  if (!userStyle) return vars;
  return { ...vars, ...userStyle };
}
