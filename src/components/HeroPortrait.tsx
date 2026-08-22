import { memo, useEffect, useState } from 'react';
import { profile } from '../data/profile';
import './HeroPortrait.css';

/**
 * The hero portrait.
 *
 * A photograph, but framed the way an instrument panel would frame it: corner
 * ticks, a measurement grid, tiny telemetry annotations, one red hairline, and
 * a waveform strip along the bottom. The face reads first; the engineering
 * detail around it only registers on a second look.
 */

/** Waveform amplitudes — a phrase, not noise. */
const WAVE = [
  4, 7, 13, 9, 17, 11, 6, 15, 22, 14, 8, 11, 19, 10, 5, 12, 16, 9, 6, 13, 20,
  11, 7, 4, 9, 15, 10, 5,
];

/** Isolated so the ticking number does not re-render the portrait. */
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

  return <span className="hp__meta-value">Δ +{(0.214 + tick * 0.001).toFixed(3)}</span>;
});

export function HeroPortrait() {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="hp">
      <div className="hp__frame">
        {/* Corner ticks — the frame reads as a measurement, not a border. */}
        <span className="hp__corner hp__corner--tl" aria-hidden="true" />
        <span className="hp__corner hp__corner--tr" aria-hidden="true" />
        <span className="hp__corner hp__corner--bl" aria-hidden="true" />
        <span className="hp__corner hp__corner--br" aria-hidden="true" />

        <div className="hp__media">
          {failed ? (
            <div className="hp__placeholder" role="note">
              <p className="mono hp__placeholder-title">No photo yet</p>
              <p className="mono hp__placeholder-path">
                save it to <b>public/bharath.jpg</b>
              </p>
            </div>
          ) : (
            <img
              className="hp__img"
              src={profile.photo}
              alt={profile.photoAlt}
              width={720}
              height={900}
              loading="eager"
              decoding="async"
              onError={() => setFailed(true)}
            />
          )}

          {/* A very fine grid over the image, and the one red hairline. */}
          <span className="hp__grid" aria-hidden="true" />
          <span className="hp__scanline" aria-hidden="true" />
        </div>

        {/* Telemetry annotations around the frame */}
        <div className="hp__meta hp__meta--top" aria-hidden="true">
          <span>PORTRAIT / 01</span>
          <Delta />
        </div>
        <div className="hp__meta hp__meta--bottom" aria-hidden="true">
          <span>CHENNAI · IN</span>
          <span>440 Hz</span>
        </div>
      </div>

      {/* Waveform strip — the quiet piano reference. */}
      <svg
        className="hp__wave"
        viewBox="0 0 432 56"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g transform="translate(0 28)">
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
      </svg>
    </figure>
  );
}
