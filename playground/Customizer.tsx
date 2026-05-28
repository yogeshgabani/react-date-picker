import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
} from 'react-datetime-kit';
import type {
  DateRange,
  TimeValue,
  TimeRange,
} from 'react-datetime-kit';

export type PickerKind =
  | 'date'
  | 'date-range'
  | 'time'
  | 'time-range'
  | 'datetime'
  | 'datetime-range';

type Config = {
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  readOnly: boolean;
  clearable: boolean;
  inline: boolean;
  autoFocus: boolean;
  placeholder: string;
  className: string;
  name: string;
  format: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers: boolean;
  numberOfMonths: number;
  hourFormat: 12 | 24;
  minuteStep: number;
  showSeconds: boolean;
  showDefaultPresets: boolean;
};

const DEFAULTS: Config = {
  size: 'md',
  disabled: false,
  readOnly: false,
  clearable: false,
  inline: false,
  autoFocus: false,
  placeholder: '',
  className: '',
  name: '',
  format: '',
  weekStartsOn: 0,
  showWeekNumbers: false,
  numberOfMonths: 1,
  hourFormat: 24,
  minuteStep: 1,
  showSeconds: false,
  showDefaultPresets: false,
};

const COMPONENT_NAME: Record<PickerKind, string> = {
  date: 'DatePicker',
  'date-range': 'DateRangePicker',
  time: 'TimePicker',
  'time-range': 'TimeRangePicker',
  datetime: 'DateTimePicker',
  'datetime-range': 'DateTimeRangePicker',
};

const hasDate = (k: PickerKind) =>
  k === 'date' || k === 'date-range' || k === 'datetime' || k === 'datetime-range';
const hasTime = (k: PickerKind) =>
  k === 'time' || k === 'time-range' || k === 'datetime' || k === 'datetime-range';
const isRange = (k: PickerKind) =>
  k === 'date-range' || k === 'time-range' || k === 'datetime-range';

const FORMAT_PRESETS_DATE = [
  'D/M/YYYY',
  'DD/MM/YYYY',
  'DD-MM-YYYY',
  'DD.MM.YYYY',
  'DD/MM/YY',
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'D MMM YYYY',
  'DD MMMM YYYY',
  'D MMM, YYYY',
  'dddd, D MMMM, YYYY',
  'ddd, DD MMM YYYY',
];

const FORMAT_PRESETS_TIME = [
  'HH:mm',
  'HH:mm:ss',
  'hh:mm A',
  'hh:mm:ss A',
  'h:mm A',
  'h:mm a',
];

const FORMAT_PRESETS_DATETIME = [
  'DD/MM/YYYY HH:mm',
  'DD/MM/YYYY HH:mm:ss',
  'YYYY-MM-DD HH:mm',
  'D MMM YYYY, hh:mm A',
  'dddd, D MMM YYYY, hh:mm A',
];

export function Customizer({
  kind,
  onClose,
}: {
  kind: PickerKind;
  onClose: () => void;
}) {
  const [cfg, setCfg] = useState<Config>(DEFAULTS);
  const [vDate, setVDate] = useState<Date | null>(null);
  const [vRange, setVRange] = useState<DateRange>({ start: null, end: null });
  const [vTime, setVTime] = useState<TimeValue | null>(null);
  const [vTimeRange, setVTimeRange] = useState<TimeRange>({
    start: null,
    end: null,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const update = <K extends keyof Config>(k: K, v: Config[K]) =>
    setCfg((p) => ({ ...p, [k]: v }));

  const formatPresets =
    hasDate(kind) && hasTime(kind)
      ? FORMAT_PRESETS_DATETIME
      : hasTime(kind)
        ? FORMAT_PRESETS_TIME
        : FORMAT_PRESETS_DATE;

  const liveProps = useMemo(() => {
    const p: Record<string, unknown> = {};
    if (cfg.size !== 'md') p.size = cfg.size;
    if (cfg.disabled) p.disabled = true;
    if (cfg.readOnly) p.readOnly = true;
    if (cfg.clearable) p.clearable = true;
    if (cfg.autoFocus) p.autoFocus = true;
    if (cfg.inline && !isRange(kind)) p.inline = true;
    if (cfg.placeholder.trim()) p.placeholder = cfg.placeholder;
    if (cfg.className.trim()) p.className = cfg.className;
    if (cfg.name.trim()) p.name = cfg.name;
    if (cfg.format.trim()) p.format = cfg.format;
    if (hasDate(kind)) {
      if (cfg.weekStartsOn !== 0) p.weekStartsOn = cfg.weekStartsOn;
      if (cfg.showWeekNumbers) p.showWeekNumbers = true;
      if (cfg.numberOfMonths !== 1) p.numberOfMonths = cfg.numberOfMonths;
    }
    if (hasTime(kind)) {
      if (cfg.hourFormat !== 24) p.hourFormat = cfg.hourFormat;
      if (cfg.minuteStep !== 1) p.minuteStep = cfg.minuteStep;
      if (cfg.showSeconds) p.showSeconds = true;
    }
    if (isRange(kind) && cfg.showDefaultPresets) p.showDefaultPresets = true;
    return p;
  }, [cfg, kind]);

  const previewEl = (() => {
    switch (kind) {
      case 'date':
        return (
          <DatePicker {...liveProps} value={vDate} onChange={setVDate} />
        );
      case 'date-range':
        return (
          <DateRangePicker
            {...liveProps}
            value={vRange}
            onChange={setVRange}
          />
        );
      case 'time':
        return (
          <TimePicker {...liveProps} value={vTime} onChange={setVTime} />
        );
      case 'time-range':
        return (
          <TimeRangePicker
            {...liveProps}
            value={vTimeRange}
            onChange={setVTimeRange}
          />
        );
      case 'datetime':
        return (
          <DateTimePicker {...liveProps} value={vDate} onChange={setVDate} />
        );
      case 'datetime-range':
        return (
          <DateTimeRangePicker
            {...liveProps}
            value={vRange}
            onChange={setVRange}
          />
        );
    }
  })();

  const code = useMemo(() => {
    const compName = COMPONENT_NAME[kind];
    const props: string[] = ['value={value}', 'onChange={setValue}'];
    for (const [k, v] of Object.entries(liveProps)) {
      if (typeof v === 'boolean') {
        if (v) props.push(k);
      } else if (typeof v === 'number') {
        props.push(`${k}={${v}}`);
      } else {
        props.push(`${k}="${String(v)}"`);
      }
    }
    const body = props.map((p) => `  ${p}`).join('\n');
    return `import { ${compName} } from 'react-datetime-kit';\n\n<${compName}\n${body}\n/>`;
  }, [liveProps, kind]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div
      className="pg-cz-overlay"
      onClick={(e) => {
        // Only close when the click lands directly on the dimmed
        // backdrop — not when it bubbles from anything inside the
        // modal (which would otherwise close as the user interacts
        // with the picker preview).
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pg-cz-title"
    >
      <div className="pg-cz">
        <header className="pg-cz-head">
          <div>
            <h3 id="pg-cz-title" className="pg-cz-title">
              {COMPONENT_NAME[kind]}
            </h3>
            <span className="pg-cz-sub">kind="{kind}"</span>
          </div>
          <button
            type="button"
            className="pg-cz-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              width={18}
              height={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="pg-cz-controls">
          <Field label="Size">
            <ButtonGroup
              options={[
                ['sm', 'SM'],
                ['md', 'MD'],
                ['lg', 'LG'],
              ]}
              value={cfg.size}
              onChange={(v) => update('size', v as Config['size'])}
            />
          </Field>

          <Field label="Disabled">
            <Toggle
              on={cfg.disabled}
              onChange={(v) => update('disabled', v)}
            />
          </Field>
          <Field label="Read only">
            <Toggle
              on={cfg.readOnly}
              onChange={(v) => update('readOnly', v)}
            />
          </Field>
          <Field label="Clearable">
            <Toggle
              on={cfg.clearable}
              onChange={(v) => update('clearable', v)}
            />
          </Field>

          {!isRange(kind) && (
            <Field label="Inline (always open)">
              <Toggle
                on={cfg.inline}
                onChange={(v) => update('inline', v)}
              />
            </Field>
          )}
          <Field label="Auto focus">
            <Toggle
              on={cfg.autoFocus}
              onChange={(v) => update('autoFocus', v)}
            />
          </Field>

          <Field label="Placeholder">
            <input
              className="pg-cz-input"
              placeholder="Select…"
              value={cfg.placeholder}
              onChange={(e) => update('placeholder', e.target.value)}
            />
          </Field>

          <Field label="className">
            <input
              className="pg-cz-input"
              placeholder="e.g. my-picker"
              value={cfg.className}
              onChange={(e) => update('className', e.target.value)}
            />
          </Field>

          <Field label="name (form)">
            <input
              className="pg-cz-input"
              placeholder="e.g. dob"
              value={cfg.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </Field>

          <Field label="Format" wide>
            <div className="pg-cz-row">
              <select
                className="pg-cz-select"
                value={
                  formatPresets.includes(cfg.format) ? cfg.format : ''
                }
                onChange={(e) => update('format', e.target.value)}
              >
                <option value="">(default · pick a preset)</option>
                {formatPresets.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <input
                className="pg-cz-input"
                placeholder="…or custom (DD/MM/YYYY)"
                value={cfg.format}
                onChange={(e) => update('format', e.target.value)}
              />
            </div>
          </Field>

          {hasDate(kind) && (
            <>
              <Field label="Week starts on">
                <ButtonGroup
                  options={[
                    ['0', 'Sun'],
                    ['1', 'Mon'],
                    ['6', 'Sat'],
                  ]}
                  value={String(cfg.weekStartsOn)}
                  onChange={(v) =>
                    update(
                      'weekStartsOn',
                      Number(v) as Config['weekStartsOn'],
                    )
                  }
                />
              </Field>
              <Field label="Week numbers">
                <Toggle
                  on={cfg.showWeekNumbers}
                  onChange={(v) => update('showWeekNumbers', v)}
                />
              </Field>
              <Field label={`Months visible · ${cfg.numberOfMonths}`}>
                <input
                  className="pg-cz-range"
                  type="range"
                  min={1}
                  max={3}
                  value={cfg.numberOfMonths}
                  onChange={(e) =>
                    update('numberOfMonths', Number(e.target.value))
                  }
                />
              </Field>
            </>
          )}

          {hasTime(kind) && (
            <>
              <Field label="Hour format">
                <ButtonGroup
                  options={[
                    ['24', '24h'],
                    ['12', '12h'],
                  ]}
                  value={String(cfg.hourFormat)}
                  onChange={(v) =>
                    update(
                      'hourFormat',
                      Number(v) as Config['hourFormat'],
                    )
                  }
                />
              </Field>
              <Field label={`Minute step · ${cfg.minuteStep}`}>
                <input
                  className="pg-cz-range"
                  type="range"
                  min={1}
                  max={30}
                  value={cfg.minuteStep}
                  onChange={(e) =>
                    update('minuteStep', Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Show seconds">
                <Toggle
                  on={cfg.showSeconds}
                  onChange={(v) => update('showSeconds', v)}
                />
              </Field>
            </>
          )}

          {isRange(kind) && (
            <Field label="Default presets sidebar">
              <Toggle
                on={cfg.showDefaultPresets}
                onChange={(v) => update('showDefaultPresets', v)}
              />
            </Field>
          )}
        </div>

        <div className="pg-cz-output">
          <div className="pg-cz-panel pg-cz-code-panel">
            <div className="pg-cz-panel-head">
              <span className="pg-cz-panel-label">Code</span>
              <button
                type="button"
                className={`pg-cz-copy ${copied ? 'is-copied' : ''}`}
                onClick={copy}
              >
                {copied ? 'Copied!' : 'Copy code'}
              </button>
            </div>
            <pre className="pg-cz-code">
              <code>{code}</code>
            </pre>
          </div>

          <div className="pg-cz-panel pg-cz-preview-panel">
            <div className="pg-cz-panel-head">
              <span className="pg-cz-panel-label">Live preview</span>
            </div>
            <div className="pg-cz-preview">{previewEl}</div>
          </div>
        </div>

        <footer className="pg-cz-foot">
          Press <kbd>ESC</kbd> or click outside to close
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`pg-cz-field ${wide ? 'is-wide' : ''}`}>
      <span className="pg-cz-field-label">{label}</span>
      <div className="pg-cz-field-control">{children}</div>
    </div>
  );
}

function ButtonGroup({
  options,
  value,
  onChange,
}: {
  options: [string, string][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="pg-cz-btngroup">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          className={`pg-cz-btn ${v === value ? 'is-active' : ''}`}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`pg-cz-toggle ${on ? 'is-on' : ''}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}
    >
      <span className="pg-cz-toggle-thumb" />
    </button>
  );
}
