import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
} from 'react-datetime-kit';
import type { DateRange, TimeValue, TimeRange } from 'react-datetime-kit';

type Category =
  | 'all'
  | 'date'
  | 'range'
  | 'time'
  | 'datetime'
  | 'theming';

export function App() {
  const [dark, setDark] = useState(false);
  const [category, setCategory] = useState<Category>('all');
  const [copied, setCopied] = useState<'install' | 'import' | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.setAttribute(
      'data-rdk-theme',
      dark ? 'dark' : 'light',
    );
  }, [dark]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setShowTop(y > 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const copy = async (kind: 'install' | 'import', text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  };

  const showCat = (c: Category) => category === 'all' || category === c;

  return (
    <>
      {/* ============ STICKY TOPBAR ============ */}
      <div className={`pg-topbar ${scrolled ? 'is-scrolled' : ''}`}>
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
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
            >
              {dark ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                  </svg>
                  Light
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          v0.1.0 · TypeScript · Tailwind · 6 pickers
        </div>

        <h1 className="pg-title">
          Modern date &amp; time pickers
          <br />
          <span className="pg-title-grad">for delightful React apps.</span>
        </h1>

        <p className="pg-lede">
          A complete, accessible date &amp; time picker toolkit — single date,
          date range, time, time range, datetime, and datetime range. Themeable,
          keyboard-friendly, RTL-ready, and built on Floating UI &amp; date-fns.
        </p>

        <div className="pg-hero-cta">
          <div className="pg-install-stack">
            <div className="pg-install">
              <span className="pg-install-prompt">$</span>
              <span>npm install react-datetime-kit</span>
              <button
                type="button"
                className={`pg-copy ${copied === 'install' ? 'is-copied' : ''}`}
                onClick={() =>
                  copy('install', 'npm install react-datetime-kit')
                }
              >
                {copied === 'install' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="pg-install">
              <span className="pg-install-prompt">↳</span>
              <span>
                <span className="tok-key">import</span>{' '}
                <span className="tok-str">'react-datetime-kit/styles.css'</span>;
              </span>
              <button
                type="button"
                className={`pg-copy ${copied === 'import' ? 'is-copied' : ''}`}
                onClick={() =>
                  copy('import', "import 'react-datetime-kit/styles.css';")
                }
              >
                {copied === 'import' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <button
            type="button"
            className="pg-cta-primary"
            onClick={() => {
              document
                .getElementById('demos')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Try a picker
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
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
          <Feature icon="📅" title="6 picker variants" desc="Date, range, time, time-range, datetime, datetime-range — same API, same theming." />
          <Feature icon="♿" title="Accessible by default" desc="WAI-ARIA roles, keyboard nav (arrows/Home/End/PgUp/PgDn), focus trap, screen-reader friendly." />
          <Feature icon="🎨" title="Themeable" desc="CSS variables for colors, radius, shadows, fonts — drop your design tokens in seconds." />
          <Feature icon="🌍" title="Locale & RTL" desc="Full date-fns locale support, RTL direction, first-day-of-week customization." />
          <Feature icon="⚡" title="Fast & tiny" desc="No moment.js. date-fns peer dep, Floating UI for positioning, tree-shakeable exports." />
          <Feature icon="🧩" title="Headless inside" desc="Composable controllers (useDatePicker, useDateRange, useTimePicker) for full custom UIs." />
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
              ['all', 'All'],
              ['date', 'Date'],
              ['range', 'Range'],
              ['time', 'Time'],
              ['datetime', 'Date + Time'],
              ['theming', 'Themes'],
            ] as [Category, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={category === id}
              className={`pg-tab ${category === id ? 'is-active' : ''}`}
              onClick={() => setCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pg-grid">
          {showCat('date') && (
            <>
              <Demo
                title="DatePicker"
                hint="Popover, clearable, default"
                badge="Date"
                code={`<DatePicker value={date} onChange={setDate} clearable />`}
                value={date?.toISOString() ?? 'null'}
              >
                <DatePicker value={date} onChange={setDate} clearable />
              </Demo>

              <Demo
                title="DatePicker (empty)"
                hint="Placeholder when no value"
                badge="Date"
                code={`<DatePicker
  value={value}
  onChange={setValue}
  placeholder="Pick a date"
  clearable
/>`}
                value={dateEmpty?.toISOString() ?? 'null'}
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
                code={`<DatePicker
  value={date}
  onChange={setDate}
  numberOfMonths={2}
  weekStartsOn={1}
  showWeekNumbers
  clearable
/>`}
                value={dateWide?.toISOString() ?? 'null'}
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
                code={`<DatePicker
  value={date}
  onChange={setDate}
  inline
/>`}
                value={dateInline?.toISOString() ?? 'null'}
              >
                <DatePicker
                  value={dateInline}
                  onChange={setDateInline}
                  inline
                />
              </Demo>
            </>
          )}

          {showCat('range') && (
            <>
              <Demo
                title="DateRangePicker"
                hint="Two months, hover preview"
                badge="Range"
                code={`<DateRangePicker
  value={range}
  onChange={setRange}
  clearable
/>`}
                value={`${range.start?.toDateString() ?? '…'} → ${range.end?.toDateString() ?? '…'}`}
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
                code={`<DateRangePicker
  value={range}
  onChange={setRange}
  showDefaultPresets
  clearable
/>`}
                value={`${rangePresets.start?.toDateString() ?? '…'} → ${rangePresets.end?.toDateString() ?? '…'}`}
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

          {showCat('time') && (
            <>
              <Demo
                title="TimePicker (24h)"
                hint="Hour + minute columns"
                badge="Time"
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

          {showCat('datetime') && (
            <>
              <Demo
                title="DateTimePicker"
                hint="Calendar + time columns"
                badge="Date+Time"
                code={`<DateTimePicker
  value={dt}
  onChange={setDt}
  hourFormat={12}
  minuteStep={5}
  clearable
/>`}
                value={dt?.toISOString() ?? 'null'}
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
                code={`<DateTimeRangePicker
  value={range}
  onChange={setRange}
  minuteStep={15}
  showDefaultPresets
  clearable
/>`}
                value={`${dtRange.start?.toISOString() ?? '…'} → ${dtRange.end?.toISOString() ?? '…'}`}
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

          {showCat('theming') && (
            <>
              <Demo
                title="Size variants"
                hint="sm / md / lg"
                badge="Theming"
                code={`<DatePicker size="sm" />
<DatePicker size="md" />
<DatePicker size="lg" />`}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <DatePicker size="sm" defaultValue={new Date()} clearable />
                  <DatePicker size="md" defaultValue={new Date()} clearable />
                  <DatePicker size="lg" defaultValue={new Date()} clearable />
                </div>
              </Demo>
              <Demo
                title="Disabled state"
                hint="Read-only & disabled"
                badge="Theming"
                code={`<DatePicker disabled />
<DatePicker readOnly />`}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <DatePicker disabled defaultValue={new Date()} />
                  <DatePicker readOnly defaultValue={new Date()} />
                </div>
              </Demo>
            </>
          )}
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
            ['inline', 'boolean', 'false', 'Always-open calendar instead of popover'],
            ['disabled', 'boolean', 'false', 'Disable the entire picker'],
            ['readOnly', 'boolean', 'false', 'Show value but prevent changes'],
            ['clearable', 'boolean', 'false', 'Show an X clear button when value exists'],
            ['placeholder', 'string', '"Select…"', 'Placeholder when there is no value'],
            ['size', '"sm" | "md" | "lg"', '"md"', 'Input size variant'],
            ['theme', '"light" | "dark" | "auto"', '"auto"', 'Color scheme override'],
            ['dir', '"ltr" | "rtl"', '"ltr"', 'Text direction'],
            ['locale', 'Locale', '—', 'date-fns Locale object'],
            ['className', 'string', '—', 'Extra className for the root wrapper'],
            ['inputClassName', 'string', '—', 'Extra className for the input element'],
            ['popoverClassName', 'string', '—', 'Extra className for the popover panel'],
            ['id', 'string', '—', 'id attribute for the input'],
            ['name', 'string', '—', 'name attribute (useful inside forms)'],
            ['autoFocus', 'boolean', 'false', 'Auto-focus the input on mount'],
          ]}
        />

        <PropTable
          title="Date pickers — extra props"
          rows={[
            ['value', 'Date | null', '—', 'Controlled value'],
            ['defaultValue', 'Date | null', '—', 'Uncontrolled default'],
            ['onChange', '(date: Date | null) => void', '—', 'Called when value changes'],
            ['minDate', 'Date', '—', 'Earliest selectable date (inclusive)'],
            ['maxDate', 'Date', '—', 'Latest selectable date (inclusive)'],
            ['disabledDates', 'Date[] | (d: Date) => boolean', '—', 'Disable specific dates'],
            ['format', 'string', 'locale-default', 'date-fns format string'],
            ['weekStartsOn', '0..6', '0 (Sun)', 'First day of week'],
            ['showWeekNumbers', 'boolean', 'false', 'Show ISO week numbers'],
            ['numberOfMonths', 'number', '1', 'Months visible side-by-side'],
            ['renderDay', '(d, defaultNode) => ReactNode', '—', 'Custom day cell render'],
          ]}
        />

        <PropTable
          title="DateRangePicker — extra props"
          rows={[
            ['value', 'DateRange', '—', '{ start, end }'],
            ['onChange', '(r: DateRange) => void', '—', 'Called when range changes'],
            ['presets', 'Preset[]', '—', 'Custom quick-select presets'],
            ['showDefaultPresets', 'boolean', 'false', 'Today, Last 7 days, This month, etc.'],
          ]}
        />

        <PropTable
          title="Time pickers — extra props"
          rows={[
            ['value', 'TimeValue | null', '—', '{ hours, minutes, seconds? }'],
            ['onChange', '(t) => void', '—', 'Called on change'],
            ['hourFormat', '12 | 24', '24', '12-hour or 24-hour clock'],
            ['minuteStep', 'number', '1', 'Minute increments (e.g. 5, 15, 30)'],
            ['secondStep', 'number', '1', 'Second increments'],
            ['showSeconds', 'boolean', 'false', 'Display seconds column'],
            ['format', 'string', 'auto', 'Time format string'],
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

        <div className="pg-footer-bottom">
          <span className="pg-footer-meta">
            <span className="pg-footer-meta-row">
              <span className="pg-footer-badge">MIT</span>
              <span className="pg-footer-meta-sep" aria-hidden="true">·</span>
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

      {/* ============ SCROLL TO TOP ============ */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className={`pg-to-top ${showTop ? 'is-visible' : ''}`}
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
}: {
  title: string;
  hint?: string;
  badge?: string;
  code?: string;
  value?: string;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);
  return (
    <div className="pg-demo">
      <div className="pg-demo-head">
        <div>
          <h3 className="pg-demo-title">{title}</h3>
          {hint && <p className="pg-demo-hint">{hint}</p>}
        </div>
        {badge && <span className="pg-demo-badge">{badge}</span>}
      </div>
      <div className="pg-demo-body">{children}</div>
      {value !== undefined && <div className="pg-value">{value}</div>}
      {code && (
        <div>
          <button
            type="button"
            onClick={() => setShowCode((s) => !s)}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--pg-text-mute)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            {showCode ? '− Hide code' : '+ Show code'}
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
          margin: '0 0 12px',
          color: 'var(--pg-text)',
        }}
      >
        {title}
      </h3>
      <div className="pg-table-wrap">
        <table className="pg-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Prop</th>
              <th style={{ width: '28%' }}>Type</th>
              <th style={{ width: '15%' }}>Default</th>
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
