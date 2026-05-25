import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './playground/**/*.{ts,tsx,html}'],
  prefix: 'rdk-',
  darkMode: ['class', '[data-rdk-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        rdk: {
          primary: 'var(--rdk-color-primary)',
          'primary-hover': 'var(--rdk-color-primary-hover)',
          'primary-soft': 'var(--rdk-color-primary-soft)',
          bg: 'var(--rdk-color-bg)',
          surface: 'var(--rdk-color-surface)',
          'surface-hover': 'var(--rdk-color-surface-hover)',
          text: 'var(--rdk-color-text)',
          'text-muted': 'var(--rdk-color-text-muted)',
          border: 'var(--rdk-color-border)',
          'border-strong': 'var(--rdk-color-border-strong)',
          danger: 'var(--rdk-color-danger)',
          disabled: 'var(--rdk-color-disabled)',
          'range-bg': 'var(--rdk-color-range-bg)',
        },
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
