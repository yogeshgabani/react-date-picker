import type { SVGProps } from 'react';

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function ChevronLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ChevronsLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}

export function ChevronsRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  );
}
