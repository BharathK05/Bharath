import { memo, useEffect, useState } from 'react';
import './HeroVisual.css';

/**
 * The hero visual.
 *
 * Reads as a generic engineering plot at a glance. Only on a second look do the
 * pieces resolve: the grey trace is a signal, the thin red curve is a racing
 * line through a corner, and the strip along the bottom is a waveform.
 */

/** The red "racing line" — corner entry, apex, exit. Deliberately restrained. */
const RACING_LINE =
  'M 24 250 C 92 250, 126 244, 158 214 C 190 184, 200 128, 244 112 C 288 96, 380 116, 452 96';

/** The grey signal trace, deterministic so the layout never jitters. */
const TRACE_POINTS: [number, number][] = [
  [24, 196],
  [56, 188],
  [88, 204],
  [120, 162],
  [152, 174],
  [184, 134],
  [216, 148],
  [248, 116],
  [280, 128],
  [312, 100],
  [344, 114],
  [376, 88],
  [408, 100],
  [440, 78],
  [452, 84],
];

const TRACE_PATH = TRACE_POINTS.map(
  ([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`,
).join(' ');

/** Waveform amplitudes — a phrase, not noise. Mirrored around a centre line. */
const WAVE = [
  4, 7, 13, 9, 17, 11, 6, 15, 22, 14, 8, 11, 19, 10, 5, 12, 16, 9, 6, 13, 20,
  11, 7, 4, 9, 15, 10, 5,
];

/**
 * Isolated so the ticking number does not re-render the whole diagram.
 */
const Delta = memo(function Delta() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let id = 0;
    const start = () => {
      if (id) return;
      id = window.setInterval(() => setTick((v) => (v + 1) % 800), 110);
    };
    const stop = () => {
      window.clearInterval(id);
      id = 0;
    };
    const onVisibility = () =>
      document.visibilityState === 'visible' ? start() : stop();

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <text x="456" y="18" className="hv__meta" textAnchor="end">
      Δ +{(0.214 + tick * 0.001).toFixed(3)}
    </text>
  );
});

export function HeroVisual() {
  return (
    <figure className="hv" aria-hidden="true">
      <svg viewBox="0 0 480 356" className="hv__svg" role="presentation">
        <defs>
          <pattern
            id="hv-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="hv-fade" x1="0" x2="1">
            <stop offset="0" stopColor="var(--bg)" stopOpacity="1" />
            <stop offset="0.16" stopColor="var(--bg)" stopOpacity="0" />
            <stop offset="0.86" stopColor="var(--bg)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--bg)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Substrate */}
        <rect width="480" height="290" fill="url(#hv-grid)" opacity="0.5" />
        <rect width="480" height="356" fill="url(#hv-fade)" />

        {/* Axes */}
        <line x1="24" y1="24" x2="24" y2="270" stroke="var(--line-strong)" strokeWidth="1" />
        <line x1="24" y1="270" x2="456" y2="270" stroke="var(--line-strong)" strokeWidth="1" />

        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={i}
            x1={24 + i * 72}
            y1="270"
            x2={24 + i * 72}
            y2="276"
            stroke="var(--line-strong)"
            strokeWidth="1"
          />
        ))}

        {/* Signal trace — the dominant element */}
        <path
          className="hv__trace"
          d={TRACE_PATH}
          fill="none"
          stroke="var(--ink-mute)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {TRACE_POINTS.filter((_, i) => i % 3 === 0).map(([x, y], i) => (
          <circle
            key={`${x}-${y}`}
            className="hv__dot"
            cx={x}
            cy={y}
            r="2"
            fill="var(--bg)"
            stroke="var(--ink-mute)"
            strokeWidth="1"
            style={{ animationDelay: `${900 + i * 110}ms` }}
          />
        ))}

        {/* The racing line — the only red on the canvas, and kept quiet */}
        <path
          className="hv__line"
          d={RACING_LINE}
          fill="none"
          stroke="var(--red)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Apex marker */}
        <circle cx="244" cy="112" r="3.5" fill="none" stroke="var(--red)" strokeWidth="0.9" opacity="0.55" />
        <circle className="hv__apex" cx="244" cy="112" r="1.5" fill="var(--red)" />

        {/* Waveform strip, mirrored around its own centre line */}
        <g className="hv__wave" transform="translate(24 318)">
          {WAVE.map((h, i) => (
            <rect
              key={i}
              x={i * 15.4}
              y={-h * 1.2}
              width="3"
              height={h * 2.4}
              rx="1"
              fill="var(--ink-faint)"
              opacity="0.4"
              style={{ animationDelay: `${i * 45}ms` }}
            />
          ))}
        </g>

        {/* Tiny telemetry annotations */}
        <text x="24" y="18" className="hv__meta">
          SIGNAL / 01
        </text>
        <Delta />
        <text x="254" y="106" className="hv__meta hv__meta--red">
          APEX
        </text>
        <text x="24" y="294" className="hv__meta">
          T 00.000
        </text>
        <text x="456" y="294" className="hv__meta" textAnchor="end">
          440 Hz
        </text>
      </svg>
    </figure>
  );
}
