import type { Config } from 'tailwindcss';

/**
 * Theme tokens are authored as plain CSS custom properties holding *any*
 * CSS color (hex, rgb(), hsl(), a keyword — whatever the host app sets).
 * Tailwind can only apply an opacity modifier (`bg-rdk-primary/40`) to a
 * color it knows how to inject alpha into; for a bare `var(--x)` string it
 * silently DROPS the utility instead, which is how the "today" ring and
 * every other `/NN` class ended up missing from the built stylesheet.
 *
 * Returning a function lets us keep the tokens as opaque CSS colors while
 * still supporting modifiers: the un-modified case emits the raw `var()`
 * exactly as before (zero change in output), and only the `/NN` case falls
 * back to `color-mix()`.
 */
const token =
  (name: string) =>
  ({ opacityValue }: { opacityValue?: string; opacityVariable?: string }) => {
    // `opacityValue` is `var(--tw-bg-opacity, 1)` for the plain utility and a
    // literal like `0.4` for `/40`. Only the literal form needs color-mix.
    if (!opacityValue || opacityValue === '1' || opacityValue.startsWith('var(')) {
      return `var(${name})`;
    }
    return `color-mix(in srgb, var(${name}) calc(${opacityValue} * 100%), transparent)`;
  };

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './playground/**/*.{ts,tsx,html}'],
  prefix: 'rdk-',
  darkMode: ['class', '[data-rdk-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        rdk: {
          primary: token('--rdk-color-primary'),
          'primary-hover': token('--rdk-color-primary-hover'),
          'primary-soft': token('--rdk-color-primary-soft'),
          bg: token('--rdk-color-bg'),
          surface: token('--rdk-color-surface'),
          'surface-hover': token('--rdk-color-surface-hover'),
          text: token('--rdk-color-text'),
          'text-muted': token('--rdk-color-text-muted'),
          border: token('--rdk-color-border'),
          'border-strong': token('--rdk-color-border-strong'),
          danger: token('--rdk-color-danger'),
          disabled: token('--rdk-color-disabled'),
          'range-bg': token('--rdk-color-range-bg'),
        } as unknown as Record<string, string>,
      },
      borderRadius: {
        rdk: 'var(--rdk-radius)',
        'rdk-sm': 'var(--rdk-radius-sm)',
        'rdk-lg': 'var(--rdk-radius-lg)',
      },
      fontFamily: {
        rdk: ['var(--rdk-font)'],
      },
      boxShadow: {
        rdk: 'var(--rdk-shadow)',
        'rdk-lg': 'var(--rdk-shadow-lg)',
      },
      keyframes: {
        'rdk-fade-in': {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'rdk-fade-out': {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(-4px) scale(0.98)' },
        },
      },
      animation: {
        'rdk-in': 'rdk-fade-in 140ms cubic-bezier(0.16, 1, 0.3, 1)',
        'rdk-out': 'rdk-fade-out 100ms ease-in',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

export default config;
