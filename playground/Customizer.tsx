import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
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
  PickerColors,
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
  showIcon: boolean;
  iconPosition: 'left' | 'right';
  view: 'day' | 'month' | 'year';
  headerPosition: 'top' | 'bottom';
  closeOnSelect: boolean;
  disablePast: boolean;
  disableFuture: boolean;
  colors: PickerColors;
  /** Dropdown-panel opacity in percent. 100 = fully opaque (no override). */
  popoverAlpha: number;
  /** Backdrop blur behind the dropdown panel, in px. 0 = off. */
  popoverBlur: number;
  /** Surface opacity in percent. Only applied once a Surface colour is set. */
  surfaceAlpha: number;
};

/**
 * Color keys exposed in the Customizer UI. We expose a curated subset
 * (not all 14) so the panel stays readable — these cover ~95% of theme
 * tweaks. Range pickers also get `rangeBg`.
 */
const COLOR_FIELDS: Array<{
  key: keyof PickerColors;
  label: string;
  hint: string;
  /** Hide the field for kinds where the token isn't painted at all. */
  showFor?: (k: PickerKind) => boolean;
}> = [
  { key: 'primary', label: 'Primary', hint: 'Selected day / Today button' },
  { key: 'primaryHover', label: 'Primary hover', hint: 'Hover state of primary' },
  { key: 'primarySoft', label: 'Primary soft', hint: 'Day-hover background' },
  { key: 'surface', label: 'Surface', hint: 'Panels, inputs, time columns' },
  {
    key: 'background',
    label: 'Background',
    hint: 'Today / Clear footer bar',
    // `--rdk-color-bg` is painted on exactly one element: the footer bar in
    // DatePicker and DateRangePicker. Offering it elsewhere just looks broken
    // — the swatch changes and nothing on screen moves.
    showFor: (k) => k === 'date' || k === 'date-range',
  },
  { key: 'text', label: 'Text', hint: 'Primary text' },
  { key: 'textMuted', label: 'Text muted', hint: 'Weekday labels' },
  { key: 'border', label: 'Border', hint: 'Dividers & outlines' },
  { key: 'danger', label: 'Danger', hint: 'Clear button hover' },
  {
    key: 'rangeBg',
    label: 'Range band',
    hint: 'Between start & end',
    // Inlined rather than referencing `isRange`, which is declared further
    // down the module — a bare reference here runs in its temporal dead zone.
    showFor: (k) => k.endsWith('-range'),
  },
];

/**
 * Apply a percentage alpha to any CSS colour. A 6-digit hex becomes
 * `rgb(r g b / n%)`; anything else (a `var()`, an existing `rgba()`, a
 * keyword) goes through `color-mix`, which handles them all without the
 * Customizer having to parse colour syntax.
 */
function withAlpha(color: string, percent: number): string {
  const hex = /^#([0-9a-fA-F]{6})$/.exec(color.trim());
  if (hex) {
    const n = parseInt(hex[1], 16);
    // eslint-disable-next-line no-bitwise
    return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${percent}%)`;
  }
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/**
 * Blend a colour over an opaque base instead of over transparency.
 *
 * Surface paints the panel the dates sit on, so making it *translucent*
 * would let whatever is behind the popover — page cards, other controls —
 * read straight through the calendar. Mixing over the theme's own surface
 * keeps the panel opaque and just tints it, which is what actually makes a
 * saturated pick legible. The base has to be a literal: writing
 * `color-mix(…, var(--rdk-color-surface))` into `--rdk-color-surface` is a
 * self-reference, and CSS throws the whole property away as invalid.
 */
function withTint(color: string, percent: number, base: string): string {
  return `color-mix(in srgb, ${color} ${percent}%, ${base})`;
}

const DEFAULTS: Config = {
  size: 'md',
  disabled: false,
  readOnly: false,
  clearable: true,
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
  showIcon: true,
  iconPosition: 'left',
  view: 'day',
  headerPosition: 'top',
  closeOnSelect: true,
  disablePast: false,
  disableFuture: false,
  colors: {},
  popoverAlpha: 100,
  popoverBlur: 0,
  // Surface paints the whole panel, so a saturated colour at full strength
  // buries the dates in it. Start as a light tint — the slider goes to 100%
  // for anyone who does want a solid block.
  surfaceAlpha: 15,
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
  dark,
}: {
  kind: PickerKind;
  onClose: () => void;
  /** Active site theme — decides what a Surface tint is blended over. */
  dark: boolean;
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
  const [codeType, setCodeType] = useState<'jsx' | 'tsx'>('jsx');

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
    p.clearable = cfg.clearable;
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
    if (!cfg.showIcon) p.showIcon = false;
    if (cfg.iconPosition !== 'left') p.iconPosition = cfg.iconPosition;
    if (hasDate(kind)) {
      if (cfg.view !== 'day' && kind === 'date') p.view = cfg.view;
      if (cfg.headerPosition !== 'top') p.headerPosition = cfg.headerPosition;
      if (cfg.disablePast) p.disablePast = true;
      if (cfg.disableFuture) p.disableFuture = true;
    }
    if (!cfg.closeOnSelect && (kind === 'date' || kind === 'date-range'))
      p.closeOnSelect = false;
    const activeColors: PickerColors = {};
    let anyColor = false;
    for (const k of Object.keys(cfg.colors) as Array<keyof PickerColors>) {
      const v = cfg.colors[k];
      if (typeof v === 'string' && v.trim()) {
        activeColors[k] = v;
        anyColor = true;
      }
    }
    // Surface covers every panel, so it is the one colour where a full-strength
    // pick makes the picker unreadable — dark text buried in a dark fill.
    if (activeColors.surface?.trim() && cfg.surfaceAlpha < 100) {
      activeColors.surface = withTint(
        activeColors.surface,
        cfg.surfaceAlpha,
        dark ? '#18181b' : '#ffffff',
      );
    }

    // Dropdown panel. The alpha slider composes a translucent colour out of
    // whatever base is in play: the picked colour when there is one, and the
    // live theme surface when there isn't — so lowering opacity alone still
    // reads as "the system background, just see-through". At 100% with no
    // colour picked we emit nothing at all and the library falls back to
    // `--rdk-color-surface` on its own.
    const alpha = cfg.popoverAlpha;
    const base = activeColors.popover?.trim();
    if (base || alpha < 100) {
      const source = base || 'var(--rdk-color-surface)';
      activeColors.popover =
        alpha >= 100
          ? source
          : withAlpha(source, alpha);
      anyColor = true;
    }
    if (cfg.popoverBlur > 0) {
      activeColors.popoverBlur = `${cfg.popoverBlur}px`;
      anyColor = true;
    }
    if (anyColor) p.colors = activeColors;
    return p;
  }, [cfg, kind, dark]);

  const setColor = (key: keyof PickerColors, value: string) =>
    setCfg((p) => {
      const next: PickerColors = { ...p.colors };
      if (value) next[key] = value;
      else delete next[key];
      return { ...p, colors: next };
    });

  const resetColors = () =>
    setCfg((p) => ({
      ...p,
      colors: {},
      popoverAlpha: DEFAULTS.popoverAlpha,
      popoverBlur: DEFAULTS.popoverBlur,
      surfaceAlpha: DEFAULTS.surfaceAlpha,
    }));
  const colorsDirty =
    Object.keys(cfg.colors).length > 0 ||
    cfg.popoverAlpha !== DEFAULTS.popoverAlpha ||
    cfg.popoverBlur !== DEFAULTS.popoverBlur ||
    cfg.surfaceAlpha !== DEFAULTS.surfaceAlpha;
  const colorFields = COLOR_FIELDS.filter((f) => !f.showFor || f.showFor(kind));

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

  const getValueType = () => {
    if (isRange(kind)) return 'null | { start: Date | null; end: Date | null }';
    return 'Date | null';
  };

  const generateCode = () => {
    const compName = COMPONENT_NAME[kind];
    const props: string[] = ['value={value}', 'onChange={setValue}'];
    for (const [k, v] of Object.entries(liveProps)) {
      if (k === 'colors' && v && typeof v === 'object') {
        const entries = Object.entries(v as Record<string, string>);
        if (entries.length === 0) continue;
        const inner = entries
          .map(([ck, cv]) => `    ${ck}: '${cv}',`)
          .join('\n');
        props.push(`colors={{\n${inner}\n  }}`);
      } else if (typeof v === 'boolean') {
        if (v) props.push(k);
      } else if (typeof v === 'number') {
        props.push(`${k}={${v}}`);
      } else {
        props.push(`${k}="${String(v)}"`);
      }
    }
    const body = props.map((p) => `  ${p}`).join('\n');

    if (codeType === 'jsx') {
      return `import { useState } from 'react';\nimport { ${compName} } from 'react-datetime-kit';\n\nexport default function App() {\n  const [value, setValue] = useState(null);\n\n  return (\n    <${compName}\n${body}\n    />\n  );\n}`;
    } else {
      // TSX version
      const valueType = getValueType();
      return `import { useState } from 'react';\nimport { ${compName} } from 'react-datetime-kit';\nimport type { ${isRange(kind) ? 'DateRange, TimeRange, ' : ''}TimeValue } from 'react-datetime-kit';\n\nexport default function App() {\n  const [value, setValue] = useState<${valueType}>(null);\n\n  return (\n    <${compName}\n${body}\n    />\n  );\n}`;
    }
  };

  const code = useMemo(() => generateCode(), [liveProps, kind, codeType]);

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

          <Field label="Show icon">
            <Toggle
              on={cfg.showIcon}
              onChange={(v) => update('showIcon', v)}
            />
          </Field>
          <Field label="Icon position">
            <ButtonGroup
              options={[
                ['left', 'Left'],
                ['right', 'Right'],
              ]}
              value={cfg.iconPosition}
              onChange={(v) =>
                update('iconPosition', v as Config['iconPosition'])
              }
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
              {kind === 'date' && (
                <Field label="View">
                  <ButtonGroup
                    options={[
                      ['day', 'Day'],
                      ['month', 'Month'],
                      ['year', 'Year'],
                    ]}
                    value={cfg.view}
                    onChange={(v) => update('view', v as Config['view'])}
                  />
                </Field>
              )}
              <Field label="Header position">
                <ButtonGroup
                  options={[
                    ['top', 'Top'],
                    ['bottom', 'Bottom'],
                  ]}
                  value={cfg.headerPosition}
                  onChange={(v) =>
                    update('headerPosition', v as Config['headerPosition'])
                  }
                />
              </Field>
              <Field label="Disable past dates">
                <Toggle
                  on={cfg.disablePast}
                  onChange={(v) => update('disablePast', v)}
                />
              </Field>
              <Field label="Disable future dates">
                <Toggle
                  on={cfg.disableFuture}
                  onChange={(v) => update('disableFuture', v)}
                />
              </Field>
              {(kind === 'date' || kind === 'date-range') && (
                <Field label="Close on select">
                  <Toggle
                    on={cfg.closeOnSelect}
                    onChange={(v) => update('closeOnSelect', v)}
                  />
                </Field>
              )}
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

          <div className="pg-cz-colors-section">
            <div className="pg-cz-colors-head">
              <span className="pg-cz-colors-title">Theme colors</span>
              <button
                type="button"
                className="pg-cz-colors-reset"
                onClick={resetColors}
                disabled={!colorsDirty}
              >
                Reset
              </button>
            </div>
            <div className="pg-cz-colors-grid">
              {colorFields.map(({ key, label, hint }) => (
                <Fragment key={key}>
                  <ColorField
                    label={label}
                    hint={hint}
                    value={cfg.colors[key] ?? ''}
                    onChange={(v) => setColor(key, v)}
                  />
                  {key === 'surface' ? (
                    <RangeField
                      label={`Surface tint · ${cfg.surfaceAlpha}%`}
                      hint="Blended over the theme background"
                      min={5}
                      max={100}
                      step={5}
                      value={cfg.surfaceAlpha}
                      onChange={(v) =>
                        setCfg((p) => ({ ...p, surfaceAlpha: v }))
                      }
                    />
                  ) : null}
                </Fragment>
              ))}
            </div>

            <div className="pg-cz-colors-sub">
              <span className="pg-cz-colors-sub-title">Dropdown panel</span>
              <span className="pg-cz-colors-sub-hint">
                Floating popover only — inline panels and the input keep using
                Surface. Leave the colour empty to keep the system background
                and just dial its opacity.
              </span>
            </div>
            <div className="pg-cz-colors-grid">
              <ColorField
                label="Dropdown background"
                hint="Defaults to Surface"
                value={cfg.colors.popover ?? ''}
                onChange={(v) => setColor('popover', v)}
              />
              <RangeField
                label={`Opacity · ${cfg.popoverAlpha}%`}
                hint="See-through — pair with blur"
                min={10}
                max={100}
                step={5}
                value={cfg.popoverAlpha}
                onChange={(v) => setCfg((p) => ({ ...p, popoverAlpha: v }))}
              />
              <RangeField
                label={`Blur · ${cfg.popoverBlur}px`}
                hint="Backdrop filter behind the panel"
                min={0}
                max={24}
                step={2}
                value={cfg.popoverBlur}
                onChange={(v) => setCfg((p) => ({ ...p, popoverBlur: v }))}
              />
            </div>
          </div>
        </div>

        <div className="pg-cz-output">
          <div className="pg-cz-panel pg-cz-code-panel">
            <div className="pg-cz-panel-head">
              <span className="pg-cz-panel-label">Code</span>
              <div className="pg-cz-toggle-group">
                <button
                  type="button"
                  className={`pg-cz-toggle-btn ${codeType === 'jsx' ? 'is-active' : ''}`}
                  onClick={() => setCodeType('jsx')}
                >
                  JS
                </button>
                <button
                  type="button"
                  className={`pg-cz-toggle-btn ${codeType === 'tsx' ? 'is-active' : ''}`}
                  onClick={() => setCodeType('tsx')}
                >
                  TS
                </button>
              </div>
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

/** A slider shaped like a ColorField so it drops into the same grid. */
function RangeField({
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="pg-cz-color">
      <div className="pg-cz-color-label">
        <span className="pg-cz-color-name">{label}</span>
        <span className="pg-cz-color-hint">{hint}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // `<input type="color">` always wants a 7-char hex. When the user
  // hasn't picked anything yet (or typed a non-hex like `var(--brand)`),
  // we fall back to a neutral swatch so the swatch still looks reasonable.
  const swatchValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#7c3aed';
  const isSet = value.length > 0;
  return (
    <div className={`pg-cz-color ${isSet ? 'is-set' : ''}`}>
      <div className="pg-cz-color-label">
        <span className="pg-cz-color-name">{label}</span>
        <span className="pg-cz-color-hint">{hint}</span>
      </div>
      <div className="pg-cz-color-row">
        <label className="pg-cz-color-swatch" aria-label={`Pick ${label}`}>
          <span
            className="pg-cz-color-swatch-fill"
            style={{ background: isSet ? value : 'transparent' }}
          />
          <input
            type="color"
            value={swatchValue}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
        <input
          className="pg-cz-input pg-cz-color-input"
          placeholder="#7c3aed or var(--brand)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
        {isSet ? (
          <button
            type="button"
            className="pg-cz-color-clear"
            onClick={() => onChange('')}
            aria-label={`Reset ${label}`}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
