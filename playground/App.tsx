import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
} from "react-datetime-kit";
import type { DateRange, TimeValue, TimeRange } from "react-datetime-kit";
import { Customizer, type PickerKind } from "./Customizer";

type Category = "all" | "date" | "range" | "time" | "datetime" | "theming";

const SITE_LAST_UPDATED = "May 28, 2026";
const STATS_NAMESPACE = "react-datetime-kit-playground";
const SESSION_VISIT_FLAG = "rdtk_visited";
const THEME_STORAGE_KEY = "rdtk-theme-pref";

// Resolve the initial dark-mode value: explicit user choice from a
// previous visit wins; otherwise mirror the OS / browser preference.
function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
  } catch {
    /* localStorage blocked — fall through to system preference */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

type VisitorStats = {
  hits: number | null;
  visitors: number | null;
};

function useVisitorStats(): VisitorStats {
  const [stats, setStats] = useState<VisitorStats>({
    hits: null,
    visitors: null,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchJson = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = (await res.json()) as { value?: number };
        return typeof data.value === "number" ? data.value : null;
      } catch {
        return null;
      }
    };

    const load = async () => {
      const hitsUrl = `https://abacus.jasoncameron.dev/hit/${STATS_NAMESPACE}/hits`;
      const alreadyVisited =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(SESSION_VISIT_FLAG) === "1";
      const visitorsUrl = alreadyVisited
        ? `https://abacus.jasoncameron.dev/get/${STATS_NAMESPACE}/visitors`
        : `https://abacus.jasoncameron.dev/hit/${STATS_NAMESPACE}/visitors`;

      const [hits, visitors] = await Promise.all([
        fetchJson(hitsUrl),
        fetchJson(visitorsUrl),
      ]);

      if (cancelled) return;
      if (!alreadyVisited && visitors !== null) {
        window.sessionStorage.setItem(SESSION_VISIT_FLAG, "1");
      }
      setStats({ hits, visitors });
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}

function useCountUp(target: number | null, durationMs = 1400): number | null {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (target === null) {
      setValue(null);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

const formatStat = (n: number | null) =>
  n === null ? "—" : n.toLocaleString("en-US");

type SocialKey =
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "youtube"
  | "twitter"
  | "linkedin"
  | "github";

type SocialLink = {
  key: SocialKey;
  label: string;
  url: string | undefined;
  brand: string;
  icon: ReactNode;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    url: import.meta.env.VITE_SOCIAL_WHATSAPP,
    brand: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2a9.94 9.94 0 00-8.6 14.92L2 22l5.25-1.38A9.94 9.94 0 1012.04 2zm0 18.18a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 1115.15-4.4 8.22 8.22 0 01-8.18 8.26zm4.5-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.4-.12-.56.13-.17.25-.65.8-.8.97-.15.17-.3.18-.55.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.39.11-.51.12-.11.25-.3.37-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.34-.77-1.84-.2-.48-.4-.42-.56-.43h-.48a.92.92 0 00-.67.31c-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.11-.23-.17-.48-.29z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    url: import.meta.env.VITE_SOCIAL_INSTAGRAM,
    brand: "#E1306C",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    url: import.meta.env.VITE_SOCIAL_FACEBOOK,
    brand: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 10-11.56 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0022 12z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    url: import.meta.env.VITE_SOCIAL_YOUTUBE,
    brand: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 00-2.1-2.13C19.56 3.5 12 3.5 12 3.5s-7.56 0-9.4.57A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.1 2.13c1.84.57 9.4.57 9.4.57s7.56 0 9.4-.57a3 3 0 002.1-2.13A31.3 31.3 0 0024 12a31.3 31.3 0 00-.5-5.8zM9.75 15.57V8.43L15.82 12l-6.07 3.57z" />
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    url: import.meta.env.VITE_SOCIAL_TWITTER,
    brand: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.674l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.16 17.52h1.833L7.084 4.126H5.117L17.084 19.77z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    url: import.meta.env.VITE_SOCIAL_LINKEDIN,
    brand: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05a3.73 3.73 0 013.36-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    url: import.meta.env.VITE_SOCIAL_GITHUB,
    brand: "#181717",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3" />
      </svg>
    ),
  },
];

export function App() {
  const [dark, setDark] = useState<boolean>(getInitialDark);
  const [category, setCategory] = useState<Category>("all");
  const [copied, setCopied] = useState<"install" | "import" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // Toggle dark mode AND persist the user's manual choice so the next
  // visit honors it instead of snapping back to system preference.
  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      } catch {
        /* localStorage blocked (private mode etc.) — fail silently */
      }
      return next;
    });
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-rdk-theme",
      dark ? "dark" : "light",
    );
  }, [dark]);

  // Live-follow the OS theme — but only while the user hasn't made a
  // manual override. If they've clicked the toggle, localStorage has
  // a value and we ignore system changes until they reset.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== "dark" && stored !== "light") {
        setDark(e.matches);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setShowTop(y > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Picker state
  const [date, setDate] = useState<Date | null>(new Date());
  const [dateEmpty, setDateEmpty] = useState<Date | null>(null);
  const [dateInline, setDateInline] = useState<Date | null>(new Date());
  const [dateWide, setDateWide] = useState<Date | null>(new Date());

  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [rangePresets, setRangePresets] = useState<DateRange>({
    start: null,
    end: null,
  });

  const [time24, setTime24] = useState<TimeValue | null>({
    hours: 9,
    minutes: 30,
  });
  const [time12, setTime12] = useState<TimeValue | null>(null);
  const [timeSec, setTimeSec] = useState<TimeValue | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: { hours: 9, minutes: 0 },
    end: { hours: 17, minutes: 0 },
  });

  const [dt, setDt] = useState<Date | null>(null);
  const [dtRange, setDtRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  // Custom format demo
  const [fmtDate, setFmtDate] = useState<Date | null>(new Date(2026, 1, 19));
  const [fmtChoice, setFmtChoice] = useState<string>("DD/MM/YYYY");
  const [fmtCustom, setFmtCustom] = useState<string>("");
  const activeFormat = fmtCustom.trim() || fmtChoice;

  // Per-card customizer modal
  const [customizer, setCustomizer] = useState<PickerKind | null>(null);

  const copy = async (kind: "install" | "import", text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  };

  const showCat = (c: Category) => category === "all" || category === c;

  const { hits, visitors } = useVisitorStats();
  const hitsAnim = useCountUp(hits);
  const visitorsAnim = useCountUp(visitors);

  const [comingSoon, setComingSoon] = useState<SocialLink | null>(null);

  useEffect(() => {
    if (!comingSoon) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setComingSoon(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [comingSoon]);

  const handleSocialClick = (
    e: ReactMouseEvent<HTMLAnchorElement>,
    link: SocialLink,
  ) => {
    if (!link.url || link.url.trim() === "") {
      e.preventDefault();
      setComingSoon(link);
    }
  };

  return (
    <>
      {/* ============ STICKY TOPBAR ============ */}
      <div className={`pg-topbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="pg-topbar-inner pg-hero-top">
          <div className="pg-brand">
            <span className="pg-brand-dots">
              <span />
              <span />
              <span />
            </span>
            <span className="pg-brand-name">react-datetime-kit</span>
          </div>

          <div className="pg-hero-actions">
            <a
              className="pg-pill"
              href="https://www.npmjs.com/package/react-datetime-kit"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 7.2v9.6h6.857V18h5.143v-1.2H24V7.2zM6.857 15.6h-2.4V9.6h2.4zm5.143 0V9.6h2.4v6h-2.4zm9.6 0h-2.4V12h-1.2v3.6h-1.2V9.6h4.8z" />
              </svg>
              npm
            </a>
            <a
              className="pg-pill"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3" />
              </svg>
              GitHub
            </a>
            <button
              type="button"
              className="pg-pill"
              onClick={toggleDark}
              aria-label="Toggle theme"
            >
              {dark ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                  </svg>
                  Light
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  Dark
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="pg-page">
        {/* ============ HERO ============ */}
        <header className="pg-hero">
          <div className="pg-tag">
            <span className="pg-tag-dot" />
            v1.0.0 · TypeScript · Tailwind · 6 pickers
          </div>

          <h1 className="pg-title">
            Modern date &amp; time pickers
            <br />
            <span className="pg-title-grad">for delightful React apps.</span>
          </h1>

          <p className="pg-lede">
            A complete, accessible date &amp; time picker toolkit — single date,
            date range, time, time range, datetime, and datetime range.
            Themeable, keyboard-friendly, RTL-ready, and built on Floating UI
            &amp; date-fns.
          </p>

          <div className="pg-hero-cta">
            <div className="pg-install-stack">
              <div className="pg-install">
                <span className="pg-install-prompt">$</span>
                <span>npm install react-datetime-kit</span>
                <button
                  type="button"
                  className={`pg-copy ${copied === "install" ? "is-copied" : ""}`}
                  onClick={() =>
                    copy("install", "npm install react-datetime-kit")
                  }
                >
                  {copied === "install" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div className="pg-install">
                <span className="pg-install-prompt">↳</span>
                <span>
                  <span className="tok-key">import</span>{" "}
                  <span className="tok-str">
                    'react-datetime-kit/styles.css'
                  </span>
                  ;
                </span>
                <button
                  type="button"
                  className={`pg-copy ${copied === "import" ? "is-copied" : ""}`}
                  onClick={() =>
                    copy("import", "import 'react-datetime-kit/styles.css';")
                  }
                >
                  {copied === "import" ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
            <button
              type="button"
              className="pg-cta-primary"
              onClick={() => {
                document
                  .getElementById("demos")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Try a picker
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16"
                height="16"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </header>

        {/* ============ FEATURES ============ */}
        <section className="pg-stack" style={{ marginTop: 56 }}>
          <div>
            <div className="pg-section-label">Why</div>
            <h2 className="pg-section-title">Built for production</h2>
            <p className="pg-section-sub">
              Every detail polished — keyboard navigation, screen-reader labels,
              range hover previews, presets, and smooth animations.
            </p>
          </div>
          <div className="pg-feature-grid">
            <Feature
              icon="📅"
              title="6 picker variants"
              desc="Date, range, time, time-range, datetime, datetime-range — same API, same theming."
            />
            <Feature
              icon="♿"
              title="Accessible by default"
              desc="WAI-ARIA roles, keyboard nav (arrows/Home/End/PgUp/PgDn), focus trap, screen-reader friendly."
            />
            <Feature
              icon="🎨"
              title="Themeable"
              desc="CSS variables for colors, radius, shadows, fonts — drop your design tokens in seconds."
            />
            <Feature
              icon="🌍"
              title="Locale & RTL"
              desc="Full date-fns locale support, RTL direction, first-day-of-week customization."
            />
            <Feature
              icon="⚡"
              title="Fast & tiny"
              desc="No moment.js. date-fns peer dep, Floating UI for positioning, tree-shakeable exports."
            />
            <Feature
              icon="🧩"
              title="Headless inside"
              desc="Composable controllers (useDatePicker, useDateRange, useTimePicker) for full custom UIs."
            />
          </div>
        </section>

        {/* ============ QUICK START ============ */}
        <section className="pg-stack" style={{ marginTop: 56 }}>
          <div>
            <div className="pg-section-label">Quick start</div>
            <h2 className="pg-section-title">Up and running in 30 seconds</h2>
            <p className="pg-section-sub">
              Import the picker you need, drop it in, control it with state.
            </p>
          </div>
          <div className="pg-card pg-card-strong">
            <pre className="pg-snippet" style={{ margin: 0 }}>
              {`import { useState } from 'react';
import { DatePicker } from 'react-datetime-kit';
import 'react-datetime-kit/styles.css';

export function App() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      clearable
      placeholder="Pick a date"
    />
  );
}`}
            </pre>
          </div>
        </section>

        {/* ============ TABS + DEMOS ============ */}
        <section className="pg-stack" style={{ marginTop: 56 }} id="demos">
          <div>
            <div className="pg-section-label">Live demos</div>
            <h2 className="pg-section-title">Every variant, every state</h2>
            <p className="pg-section-sub">
              Click any picker below — they’re all live and controlled by React
              state. Filter by category.
            </p>
          </div>

          <div className="pg-tabs" role="tablist">
            {(
              [
                ["all", "All"],
                ["date", "Date"],
                ["range", "Range"],
                ["time", "Time"],
                ["datetime", "Date + Time"],
                ["theming", "Themes"],
              ] as [Category, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={category === id}
                className={`pg-tab ${category === id ? "is-active" : ""}`}
                onClick={() => setCategory(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="pg-grid">
            {showCat("date") && (
              <>
                <Demo
                  title="DatePicker"
                  hint="Popover, clearable, default"
                  badge="Date"
                  kind="date"
                  onCustomize={setCustomizer}
                  code={`<DatePicker value={date} onChange={setDate} clearable />`}
                  value={date?.toISOString() ?? "null"}
                >
                  <DatePicker value={date} onChange={setDate} clearable />
                </Demo>

                <Demo
                  title="DatePicker (empty)"
                  hint="Placeholder when no value"
                  badge="Date"
                  kind="date"
                  onCustomize={setCustomizer}
                  code={`<DatePicker
  value={value}
  onChange={setValue}
  placeholder="Pick a date"
  clearable
/>`}
                  value={dateEmpty?.toISOString() ?? "null"}
                >
                  <DatePicker
                    value={dateEmpty}
                    onChange={setDateEmpty}
                    placeholder="Pick a date"
                    clearable
                  />
                </Demo>

                <Demo
                  title="DatePicker (two months)"
                  hint="Monday start, week numbers"
                  badge="Date"
                  kind="date"
                  onCustomize={setCustomizer}
                  code={`<DatePicker
  value={date}
  onChange={setDate}
  numberOfMonths={2}
  weekStartsOn={1}
  showWeekNumbers
  clearable
/>`}
                  value={dateWide?.toISOString() ?? "null"}
                >
                  <DatePicker
                    value={dateWide}
                    onChange={setDateWide}
                    numberOfMonths={2}
                    weekStartsOn={1}
                    showWeekNumbers
                    clearable
                  />
                </Demo>

                <Demo
                  title="DatePicker (inline)"
                  hint="Always-open calendar"
                  badge="Date"
                  kind="date"
                  onCustomize={setCustomizer}
                  code={`<DatePicker
  value={date}
  onChange={setDate}
  inline
/>`}
                  value={dateInline?.toISOString() ?? "null"}
                >
                  <DatePicker
                    value={dateInline}
                    onChange={setDateInline}
                    inline
                  />
                </Demo>
              </>
            )}

            {showCat("range") && (
              <>
                <Demo
                  title="DateRangePicker"
                  hint="Two months, hover preview"
                  badge="Range"
                  kind="date-range"
                  onCustomize={setCustomizer}
                  code={`<DateRangePicker
  value={range}
  onChange={setRange}
  clearable
/>`}
                  value={`${range.start?.toDateString() ?? "…"} → ${range.end?.toDateString() ?? "…"}`}
                >
                  <DateRangePicker
                    value={range}
                    onChange={setRange}
                    clearable
                  />
                </Demo>

                <Demo
                  title="DateRangePicker (presets)"
                  hint="Quick-select sidebar"
                  badge="Range"
                  kind="date-range"
                  onCustomize={setCustomizer}
                  code={`<DateRangePicker
  value={range}
  onChange={setRange}
  showDefaultPresets
  clearable
/>`}
                  value={`${rangePresets.start?.toDateString() ?? "…"} → ${rangePresets.end?.toDateString() ?? "…"}`}
                >
                  <DateRangePicker
                    value={rangePresets}
                    onChange={setRangePresets}
                    showDefaultPresets
                    clearable
                  />
                </Demo>
              </>
            )}

            {showCat("time") && (
              <>
                <Demo
                  title="TimePicker (24h)"
                  hint="Hour + minute columns"
                  badge="Time"
                  kind="time"
                  onCustomize={setCustomizer}
                  code={`<TimePicker
  value={time}
  onChange={setTime}
  clearable
/>`}
                  value={JSON.stringify(time24)}
                >
                  <TimePicker value={time24} onChange={setTime24} clearable />
                </Demo>

                <Demo
                  title="TimePicker (12h)"
                  hint="AM/PM toggle"
                  badge="Time"
                  kind="time"
                  onCustomize={setCustomizer}
                  code={`<TimePicker
  value={time}
  onChange={setTime}
  hourFormat={12}
  clearable
/>`}
                  value={JSON.stringify(time12)}
                >
                  <TimePicker
                    value={time12}
                    onChange={setTime12}
                    hourFormat={12}
                    clearable
                  />
                </Demo>

                <Demo
                  title="TimePicker (with seconds)"
                  hint="HH:mm:ss"
                  badge="Time"
                  kind="time"
                  onCustomize={setCustomizer}
                  code={`<TimePicker
  value={time}
  onChange={setTime}
  showSeconds
  clearable
/>`}
                  value={JSON.stringify(timeSec)}
                >
                  <TimePicker
                    value={timeSec}
                    onChange={setTimeSec}
                    showSeconds
                    clearable
                  />
                </Demo>

                <Demo
                  title="TimeRangePicker"
                  hint="Start / end side-by-side"
                  badge="Range"
                  kind="time-range"
                  onCustomize={setCustomizer}
                  code={`<TimeRangePicker
  value={range}
  onChange={setRange}
  minuteStep={5}
  clearable
/>`}
                  value={JSON.stringify(timeRange)}
                >
                  <TimeRangePicker
                    value={timeRange}
                    onChange={setTimeRange}
                    minuteStep={5}
                    clearable
                  />
                </Demo>
              </>
            )}

            {showCat("datetime") && (
              <>
                <Demo
                  title="DateTimePicker"
                  hint="Calendar + time columns"
                  badge="Date+Time"
                  kind="datetime"
                  onCustomize={setCustomizer}
                  code={`<DateTimePicker
  value={dt}
  onChange={setDt}
  hourFormat={12}
  minuteStep={5}
  clearable
/>`}
                  value={dt?.toISOString() ?? "null"}
                >
                  <DateTimePicker
                    value={dt}
                    onChange={setDt}
                    hourFormat={12}
                    minuteStep={5}
                    clearable
                  />
                </Demo>

                <Demo
                  title="DateTimeRangePicker"
                  hint="Separate start/end times"
                  badge="Date+Time"
                  kind="datetime-range"
                  onCustomize={setCustomizer}
                  code={`<DateTimeRangePicker
  value={range}
  onChange={setRange}
  minuteStep={15}
  showDefaultPresets
  clearable
/>`}
                  value={`${dtRange.start?.toISOString() ?? "…"} → ${dtRange.end?.toISOString() ?? "…"}`}
                >
                  <DateTimeRangePicker
                    value={dtRange}
                    onChange={setDtRange}
                    hourFormat={24}
                    minuteStep={15}
                    showDefaultPresets
                    clearable
                  />
                </Demo>
              </>
            )}

            {showCat("theming") && (
              <>
                <Demo
                  title="Size variants"
                  hint="sm / md / lg"
                  badge="Theming"
                  kind="date"
                  onCustomize={setCustomizer}
                  code={`<DatePicker size="sm" />
<DatePicker size="md" />
<DatePicker size="lg" />`}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <DatePicker size="sm" defaultValue={new Date()} clearable />
                    <DatePicker size="md" defaultValue={new Date()} clearable />
                    <DatePicker size="lg" defaultValue={new Date()} clearable />
                  </div>
                </Demo>
                <Demo
                  title="Disabled state"
                  hint="Read-only & disabled"
                  badge="Theming"
                  kind="date"
                  onCustomize={setCustomizer}
                  code={`<DatePicker disabled />
<DatePicker readOnly />`}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <DatePicker disabled defaultValue={new Date()} />
                    <DatePicker readOnly defaultValue={new Date()} />
                  </div>
                </Demo>
              </>
            )}
          </div>
        </section>

        {/* ============ CUSTOM FORMAT DEMO ============ */}
        <section className="pg-stack" style={{ marginTop: 56 }} id="format">
          <div>
            <div className="pg-section-label">Custom format</div>
            <h2 className="pg-section-title">
              Display dates in any format you want
            </h2>
            <p className="pg-section-sub">
              Pass a <code>format</code> prop with <strong>Moment-style</strong>{" "}
              tokens (<code>DD/MM/YYYY</code>, <code>dddd, D MMMM, YYYY</code>)
              — the input updates live.
            </p>
          </div>

          <div className="pg-card pg-card-strong">
            <div className="pg-format-grid">
              <div className="pg-format-controls">
                <label className="pg-format-field">
                  <span className="pg-format-field-label">Choose a preset</span>
                  <select
                    className="pg-format-select"
                    value={fmtChoice}
                    onChange={(e) => {
                      setFmtChoice(e.target.value);
                      setFmtCustom("");
                    }}
                  >
                    <optgroup label="Day · Month · Year">
                      {[
                        "D/M/YYYY",
                        "DD/M/YYYY",
                        "D/MM/YYYY",
                        "DD/MM/YYYY",
                        "D-M-YYYY",
                        "DD-MM-YYYY",
                        "D.M.YYYY",
                        "DD.MM.YYYY",
                        "D_M_YYYY",
                        "DD_MM_YYYY",
                        "D/M/YY",
                        "DD/MM/YY",
                        "D-M-YY",
                        "DD-MM-YY",
                        "D.M.YY",
                        "DD.MM.YY",
                      ].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Year · Month · Day (ISO-like)">
                      {["YYYY/MM/DD", "YYYY-MM-DD", "YYYY.MM.DD"].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="With month names">
                      {[
                        "D MMM YYYY",
                        "DD MMM YYYY",
                        "D-MMM-YYYY",
                        "DD-MMM-YYYY",
                        "D MMMM YYYY",
                        "DD MMMM YYYY",
                        "D MMM, YYYY",
                        "DD MMM, YYYY",
                      ].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="With weekday names">
                      {[
                        "dddd, D MMMM, YYYY",
                        "dddd, DD MMMM, YYYY",
                        "dddd, D MMM, YYYY",
                        "dddd, DD MMM, YYYY",
                      ].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </label>

                <label className="pg-format-field">
                  <span className="pg-format-field-label">
                    …or type your own
                  </span>
                  <input
                    type="text"
                    className="pg-format-input"
                    placeholder="e.g. DD-MMM-YYYY"
                    value={fmtCustom}
                    onChange={(e) => setFmtCustom(e.target.value)}
                  />
                </label>

                <div className="pg-format-preview">
                  <span className="pg-format-preview-label">Live preview</span>
                  <code className="pg-format-preview-value">
                    {activeFormat}
                  </code>
                </div>
              </div>

              <div className="pg-format-picker">
                <div>
                  <span className="pg-format-field-label">Date Preview</span>
                  <DatePicker
                    value={fmtDate}
                    onChange={setFmtDate}
                    format={activeFormat}
                    clearable
                  />
                </div>
                <pre className="pg-snippet" style={{ margin: 0 }}>
                  {`<DatePicker
  value={date}
  onChange={setDate}
  format="${activeFormat}"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROPS REFERENCE ============ */}
        <section className="pg-stack" style={{ marginTop: 56 }}>
          <div>
            <div className="pg-section-label">API reference</div>
            <h2 className="pg-section-title">Props for every picker</h2>
            <p className="pg-section-sub">
              All pickers share a common base of input/display props, plus
              type-specific extensions.
            </p>
          </div>

          <PropTable
            title="Common props (all pickers)"
            rows={[
              [
                "inline",
                "boolean",
                "false",
                "Always-open calendar instead of popover",
              ],
              ["disabled", "boolean", "false", "Disable the entire picker"],
              [
                "readOnly",
                "boolean",
                "false",
                "Show value but prevent changes",
              ],
              [
                "clearable",
                "boolean",
                "false",
                "Show an X clear button when value exists",
              ],
              [
                "placeholder",
                "string",
                '"Select…"',
                "Placeholder when there is no value",
              ],
              ["size", '"sm" | "md" | "lg"', '"md"', "Input size variant"],
              [
                "theme",
                '"light" | "dark" | "auto"',
                '"auto"',
                "Color scheme override",
              ],
              ["dir", '"ltr" | "rtl"', '"ltr"', "Text direction"],
              ["locale", "Locale", "—", "date-fns Locale object"],
              [
                "className",
                "string",
                "—",
                "Extra className for the root wrapper",
              ],
              [
                "inputClassName",
                "string",
                "—",
                "Extra className for the input element",
              ],
              [
                "popoverClassName",
                "string",
                "—",
                "Extra className for the popover panel",
              ],
              ["id", "string", "—", "id attribute for the input"],
              ["name", "string", "—", "name attribute (useful inside forms)"],
              [
                "autoFocus",
                "boolean",
                "false",
                "Auto-focus the input on mount",
              ],
            ]}
          />

          <PropTable
            title="Date pickers — extra props"
            rows={[
              ["value", "Date | null", "—", "Controlled value"],
              ["defaultValue", "Date | null", "—", "Uncontrolled default"],
              [
                "onChange",
                "(date: Date | null) => void",
                "—",
                "Called when value changes",
              ],
              ["minDate", "Date", "—", "Earliest selectable date (inclusive)"],
              ["maxDate", "Date", "—", "Latest selectable date (inclusive)"],
              [
                "disabledDates",
                "Date[] | (d: Date) => boolean",
                "—",
                "Disable specific dates",
              ],
              ["format", "string", "locale-default", "date-fns format string"],
              ["weekStartsOn", "0..6", "0 (Sun)", "First day of week"],
              ["showWeekNumbers", "boolean", "false", "Show ISO week numbers"],
              ["numberOfMonths", "number", "1", "Months visible side-by-side"],
              [
                "renderDay",
                "(d, defaultNode) => ReactNode",
                "—",
                "Custom day cell render",
              ],
            ]}
          />

          <PropTable
            title="DateRangePicker — extra props"
            rows={[
              ["value", "DateRange", "—", "{ start, end }"],
              [
                "onChange",
                "(r: DateRange) => void",
                "—",
                "Called when range changes",
              ],
              ["presets", "Preset[]", "—", "Custom quick-select presets"],
              [
                "showDefaultPresets",
                "boolean",
                "false",
                "Today, Last 7 days, This month, etc.",
              ],
            ]}
          />

          <PropTable
            title="Time pickers — extra props"
            rows={[
              [
                "value",
                "TimeValue | null",
                "—",
                "{ hours, minutes, seconds? }",
              ],
              ["onChange", "(t) => void", "—", "Called on change"],
              ["hourFormat", "12 | 24", "24", "12-hour or 24-hour clock"],
              [
                "minuteStep",
                "number",
                "1",
                "Minute increments (e.g. 5, 15, 30)",
              ],
              ["secondStep", "number", "1", "Second increments"],
              ["showSeconds", "boolean", "false", "Display seconds column"],
              ["format", "string", "auto", "Time format string"],
            ]}
          />
        </section>

        {/* ============ THEMING ============ */}
        <section className="pg-stack" style={{ marginTop: 56 }}>
          <div>
            <div className="pg-section-label">Theming</div>
            <h2 className="pg-section-title">CSS variables, no JS config</h2>
            <p className="pg-section-sub">
              Override these on <code>:root</code> or any ancestor — the picker
              picks them up automatically.
            </p>
          </div>
          <div className="pg-card pg-card-strong">
            <pre className="pg-snippet" style={{ margin: 0 }}>
              {`:root {
  --rdk-color-primary:       #7c3aed;
  --rdk-color-primary-hover: #6d28d9;
  --rdk-color-primary-soft:  #f3e8ff;
  --rdk-color-bg:            #fafafa;
  --rdk-color-surface:       #ffffff;
  --rdk-color-surface-hover: #f5f3ff;
  --rdk-color-text:          #18181b;
  --rdk-color-text-muted:    #71717a;
  --rdk-color-border:        #e4e4e7;
  --rdk-color-danger:        #ef4444;
  --rdk-color-range-bg:      #f3e8ff;

  --rdk-radius:    0.75rem;
  --rdk-radius-sm: 0.5rem;
  --rdk-radius-lg: 1.25rem;

  --rdk-font:      'Inter', system-ui, sans-serif;
}

/* Or scope to a container */
[data-rdk-theme="dark"] {
  --rdk-color-primary: #a78bfa;
  /* …all dark overrides */
}`}
            </pre>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="pg-footer">
          <div className="pg-footer-top">
            <div className="pg-footer-brand">
              <span className="pg-brand-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <div className="pg-footer-brand-text">
                <span className="pg-footer-brand-name">react-datetime-kit</span>
                <span className="pg-footer-brand-tag">
                  Modern date &amp; time pickers for React
                </span>
              </div>
            </div>

            <nav className="pg-footer-nav" aria-label="Footer">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3" />
                </svg>
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/react-datetime-kit"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M0 7.2v9.6h6.857V18h5.143v-1.2H24V7.2zM6.857 15.6h-2.4V9.6h2.4zm5.143 0V9.6h2.4v6h-2.4zm9.6 0h-2.4V12h-1.2v3.6h-1.2V9.6h4.8z" />
                </svg>
                npm
              </a>
              <a href="#demos">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 4v4M16 4v4" />
                </svg>
                Demos
              </a>
            </nav>
          </div>

          <div className="pg-footer-divider" aria-hidden="true" />

          <div className="pg-footer-social">
            <div className="pg-footer-social-text">
              <span className="pg-footer-social-title">
                Connect with Yogesh
              </span>
              <span className="pg-footer-social-sep" aria-hidden="true">
                —
              </span>
              <span className="pg-footer-social-tag">
                follow for updates &amp; new releases
              </span>
            </div>
            <div className="pg-footer-social-icons" role="list">
              {SOCIAL_LINKS.map((link) => {
                const hasUrl = !!link.url && link.url.trim() !== "";
                return (
                  <a
                    key={link.key}
                    role="listitem"
                    href={hasUrl ? link.url : "#"}
                    target={hasUrl ? "_blank" : undefined}
                    rel={hasUrl ? "noreferrer noopener" : undefined}
                    className={`pg-social-icon pg-social-${link.key}${
                      hasUrl ? "" : " is-empty"
                    }`}
                    aria-label={
                      hasUrl ? link.label : `${link.label} — coming soon`
                    }
                    title={hasUrl ? link.label : `${link.label} — coming soon`}
                    onClick={(e) => handleSocialClick(e, link)}
                    style={
                      link.key === "twitter"
                        ? undefined
                        : ({ "--pg-social-brand": link.brand } as CSSProperties)
                    }
                  >
                    {link.icon}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="pg-footer-divider" aria-hidden="true" />

          <div className="pg-footer-bottom">
            <span className="pg-footer-meta">
              <span className="pg-footer-meta-row">
                <span className="pg-footer-badge">MIT</span>
                <span className="pg-footer-meta-sep" aria-hidden="true">
                  ·
                </span>
                <span>© {new Date().getFullYear()} react-datetime-kit</span>
              </span>
              <span className="pg-footer-meta-row pg-footer-meta-sub">
                Crafted with
                <span className="pg-footer-heart" aria-label="love">
                  ♥
                </span>
                for the React community
              </span>
            </span>

            <a
              className="pg-footer-credit"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Built by Yogesh Gabani"
            >
              <span className="pg-footer-credit-label">Built by</span>
              <span className="pg-footer-credit-name">Yogesh Gabani</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </footer>
      </div>

      {/* ============ SITE STATS STRIP (outside footer card) ============ */}
      <div className="pg-stats-strip" role="group" aria-label="Site stats">
        <div className="pg-stats-strip-inner">
          <div className="pg-stat">
            <span className="pg-stat-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <span className="pg-stat-body">
              <span className="pg-stat-label">Last Updated</span>
              <span className="pg-stat-value">{SITE_LAST_UPDATED}</span>
            </span>
          </div>

          <div className="pg-stat">
            <span className="pg-stat-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <span className="pg-stat-body">
              <span className="pg-stat-label">Total Hits</span>
              <span className="pg-stat-value pg-stat-num">
                {formatStat(hitsAnim)}
              </span>
            </span>
          </div>

          <div className="pg-stat pg-stat-highlight">
            <span className="pg-stat-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </span>
            <span className="pg-stat-body">
              <span className="pg-stat-label">
                Total Visitors
                <span className="pg-stat-live" aria-label="live">
                  <span className="pg-stat-live-dot" />
                  LIVE
                </span>
              </span>
              <span className="pg-stat-value pg-stat-num">
                {formatStat(visitorsAnim)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ============ CUSTOMIZER MODAL ============ */}
      {customizer && (
        <Customizer kind={customizer} onClose={() => setCustomizer(null)} />
      )}

      {/* ============ SCROLL TO TOP ============ */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className={`pg-to-top ${showTop ? "is-visible" : ""}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

      {/* ============ COMING SOON MODAL ============ */}
      {comingSoon && (
        <div
          className="pg-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pg-cs-title"
          aria-describedby="pg-cs-desc"
          onClick={() => setComingSoon(null)}
        >
          <div
            className="pg-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ "--pg-social-brand": comingSoon.brand } as CSSProperties}
          >
            <button
              type="button"
              className="pg-modal-close"
              aria-label="Close"
              onClick={() => setComingSoon(null)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="pg-modal-glow" aria-hidden="true" />

            <div className={`pg-modal-icon pg-social-${comingSoon.key}`}>
              {comingSoon.icon}
              <span className="pg-modal-icon-ring" aria-hidden="true" />
            </div>

            <span className="pg-modal-chip">
              <span className="pg-modal-chip-dot" />
              Coming Soon
            </span>

            <h3 id="pg-cs-title" className="pg-modal-title">
              {comingSoon.label} is on the way!
            </h3>
            <p id="pg-cs-desc" className="pg-modal-desc">
              We're polishing the {comingSoon.label} link and it'll be live
              shortly. Meanwhile, check out the other socials — thanks for
              showing love!
            </p>

            <div className="pg-modal-actions">
              <button
                type="button"
                className="pg-modal-btn pg-modal-btn-ghost"
                onClick={() => setComingSoon(null)}
              >
                Got it
              </button>
              <a
                className="pg-modal-btn pg-modal-btn-primary"
                href={
                  SOCIAL_LINKS.find((l) => l.key === "github" && !!l.url)
                    ?.url ?? "#"
                }
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e) => {
                  const githubLink = SOCIAL_LINKS.find(
                    (l) => l.key === "github",
                  );
                  if (!githubLink?.url) {
                    e.preventDefault();
                    setComingSoon(null);
                  } else {
                    setComingSoon(null);
                  }
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.4-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.3.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3" />
                </svg>
                Follow on GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   Helper components
   ============================================================ */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="pg-feature">
      <div className="pg-feature-icon">{icon}</div>
      <h3 className="pg-feature-title">{title}</h3>
      <p className="pg-feature-desc">{desc}</p>
    </div>
  );
}

function Demo({
  title,
  hint,
  badge,
  code,
  value,
  children,
  kind,
  onCustomize,
}: {
  title: string;
  hint?: string;
  badge?: string;
  code?: string;
  value?: string;
  children: ReactNode;
  kind?: PickerKind;
  onCustomize?: (kind: PickerKind) => void;
}) {
  const [showCode, setShowCode] = useState(false);
  const clickable = !!(kind && onCustomize);
  const handleCardClick = () => {
    if (clickable && kind) onCustomize(kind);
  };
  const swallow = (e: ReactMouseEvent) => e.stopPropagation();
  return (
    <div
      className={`pg-demo ${clickable ? "is-clickable" : ""}`}
      onClick={clickable ? handleCardClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }
          : undefined
      }
      aria-label={clickable ? `Customize ${title}` : undefined}
    >
      <div className="pg-demo-head">
        <div>
          <h3 className="pg-demo-title">{title}</h3>
          {hint && <p className="pg-demo-hint">{hint}</p>}
        </div>
        <div className="pg-demo-head-right">
          {badge && <span className="pg-demo-badge">{badge}</span>}
          {clickable && (
            <span
              className="pg-demo-tweak"
              aria-hidden="true"
              title="Click card to customize"
            >
              <svg
                viewBox="0 0 24 24"
                width={14}
                height={14}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              Customize
            </span>
          )}
        </div>
      </div>
      {/* Clicks inside the picker shouldn't open the modal */}
      <div className="pg-demo-body" onClick={clickable ? swallow : undefined}>
        {children}
      </div>
      {value !== undefined && (
        <div className="pg-value" onClick={clickable ? swallow : undefined}>
          {value}
        </div>
      )}
      {code && (
        <div onClick={clickable ? swallow : undefined}>
          <button
            type="button"
            onClick={() => setShowCode((s) => !s)}
            style={{
              background: "transparent",
              border: 0,
              color: "var(--pg-text-mute)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            {showCode ? "− Hide code" : "+ Show code"}
          </button>
          {showCode && (
            <pre className="pg-snippet" style={{ marginTop: 8 }}>
              {code}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function PropTable({
  title,
  rows,
}: {
  title: string;
  rows: [string, string, string, string][];
}) {
  const tableRows = useMemo(() => rows, [rows]);
  return (
    <div>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          margin: "0 0 12px",
          color: "var(--pg-text)",
        }}
      >
        {title}
      </h3>
      <div className="pg-table-wrap">
        <table className="pg-table">
          <thead>
            <tr>
              <th style={{ width: "22%" }}>Prop</th>
              <th style={{ width: "28%" }}>Type</th>
              <th style={{ width: "15%" }}>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(([name, type, def, desc]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>
                  <code>{type}</code>
                </td>
                <td className="col-default">
                  <code>{def}</code>
                </td>
                <td className="col-desc">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
