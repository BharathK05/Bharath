import { useEffect, useRef } from 'react';
import './Waveform.css';

type WaveformProps = {
  analyser: AnalyserNode | null;
  active: boolean;
};

/**
 * Live oscilloscope for the piano. When nothing is playing it settles into a
 * flat line with a slow drift, so it never looks broken — just quiet.
 *
 * The loop is deliberately frugal: colours are resolved once rather than per
 * frame, and it stops entirely when the canvas is off screen. It is rebuilt
 * whenever `active` changes — tearing down one rAF loop costs nothing, and it
 * keeps the drawing code free of stale closures.
 */
export function Waveform({ analyser, active }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const live = Boolean(analyser) && active;
    const data = analyser ? new Uint8Array(analyser.fftSize) : null;

    let frame = 0;
    let running = false;
    let width = 0;
    let height = 0;

    // Resolved once — reading computed styles inside the loop would force a
    // style recalculation on every frame.
    const style = getComputedStyle(canvas);
    const idleColor = style.getPropertyValue('--ink-faint').trim() || '#4e525a';
    const liveColor = style.getPropertyValue('--red').trim() || '#e10600';

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      // Assigning width/height clears the canvas, so only do it when the size
      // has genuinely changed — otherwise every keypress would flicker.
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.25;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const mid = height / 2;

      if (live && analyser && data) {
        analyser.getByteTimeDomainData(data);
        const step = width / data.length;
        for (let i = 0; i < data.length; i++) {
          const y = mid + ((data[i] - 128) / 128) * (height * 0.44);
          if (i === 0) ctx.moveTo(0, y);
          else ctx.lineTo(i * step, y);
        }
        ctx.strokeStyle = liveColor;
        ctx.globalAlpha = 0.9;
      } else {
        // Idle: a nearly flat line with a very slow breath to it.
        const amp = reduce ? 0 : 1.6;
        for (let x = 0; x <= width; x += 6) {
          const y = mid + Math.sin(x * 0.045 + time * 0.0011) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = idleColor;
        ctx.globalAlpha = 0.55;
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();

    // Start drawing straight away, then let the observer pause the loop while
    // the keyboard is scrolled off screen. Starting eagerly matters: if the
    // observer never reports (a tab that is not being painted, say), the
    // visualisation still works rather than staying blank.
    start();

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? start() : stop()),
            { threshold: 0 },
          )
        : null;

    observer?.observe(canvas);

    window.addEventListener('resize', resize);

    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [analyser, active]);

  return (
    <div className="wave" aria-hidden="true">
      <canvas ref={canvasRef} className="wave__canvas" />
    </div>
  );
}
