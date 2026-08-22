import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import './Footer.css';

/** mm:ss.mmm */
function formatLap(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = Math.floor(ms % 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
    millis,
  ).padStart(3, '0')}`;
}

export function Footer() {
  // The easter egg: a stopwatch that starts at a plausible lap time and only
  // runs if someone is curious enough to click it.
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(83456);
  const frame = useRef(0);

  useEffect(() => {
    if (!running) return;
    let start = performance.now() - elapsed;
    const tick = (now: number) => {
      setElapsed(now - start);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      start = 0;
    };
    // Restarting on every `elapsed` change would defeat the point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__id">
          <p className="footer__name">{profile.displayName}</p>
        </div>

        <nav className="footer__links" aria-label="Social">
          <a href={profile.links.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          <span aria-hidden="true">·</span>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn
          </a>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${profile.email}`}>Email</a>
        </nav>

        <div className="footer__meta">
          <button
            type="button"
            className={`footer__lap mono ${running ? 'is-running' : ''}`}
            onClick={() => setRunning((v) => !v)}
            aria-label={running ? 'Stop the timer' : 'Start the timer'}
            title="Lap timer"
          >
            <span aria-hidden="true">{running ? '❚❚' : '▶'}</span>
            {formatLap(elapsed)}
          </button>
        </div>
      </div>

      <div className="shell footer__base">
        <p className="footer__credit mono">
          Designed and Built by Bharath · © All rights reserved {year}
        </p>
      </div>
    </footer>
  );
}
