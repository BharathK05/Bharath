import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PianoEngine } from '../utils/audio';
import {
  DEMO_PHRASE,
  NOTES,
  NOTES_COMPACT,
  NOTE_BY_KEY,
} from '../utils/notes';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Waveform } from './Waveform';
import './Piano.css';

export function Piano() {
  // Fifteen white keys on a phone would be about 23px each — unplayable. Below
  // this width the keyboard drops to a single octave instead.
  const compact = useMediaQuery('(max-width: 700px)');

  const engineRef = useRef<PianoEngine | null>(null);
  const [active, setActive] = useState<Set<string>>(() => new Set());
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [lastNote, setLastNote] = useState('—');
  const timers = useRef<number[]>([]);

  const engine = () => {
    if (!engineRef.current) engineRef.current = new PianoEngine();
    return engineRef.current;
  };

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(window.clearTimeout);
      engineRef.current?.dispose();
    };
  }, []);

  const press = useCallback((id: string) => {
    const note = NOTES.find((n) => n.id === id);
    if (!note) return;
    const eng = engine();
    void eng.resume();
    eng.attack(note.id, note.frequency);
    // The analyser only exists once the audio graph has been built.
    setAnalyser((prev) => prev ?? eng.getAnalyser());
    setLastNote(note.id);
    setActive((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const lift = useCallback((id: string) => {
    engineRef.current?.release(id);
    setActive((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const liftAll = useCallback(() => {
    engineRef.current?.releaseAll();
    setActive((prev) => (prev.size ? new Set() : prev));
  }, []);

  /* ---- Computer keyboard ------------------------------------------------ */

  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node || !node.tagName) return false;
      return (
        node.tagName === 'INPUT' ||
        node.tagName === 'TEXTAREA' ||
        node.isContentEditable
      );
    };

    const onDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      const note = NOTE_BY_KEY[e.key.toLowerCase()];
      if (!note) return;
      e.preventDefault();
      press(note.id);
    };

    const onUp = (e: KeyboardEvent) => {
      const note = NOTE_BY_KEY[e.key.toLowerCase()];
      if (note) lift(note.id);
    };

    // Nothing should be left ringing if focus or the pointer leaves.
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', liftAll);
    window.addEventListener('pointerup', liftAll);
    window.addEventListener('pointercancel', liftAll);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', liftAll);
      window.removeEventListener('pointerup', liftAll);
      window.removeEventListener('pointercancel', liftAll);
    };
  }, [press, lift, liftAll]);

  /* ---- Demo phrase ------------------------------------------------------ */

  const playPhrase = () => {
    if (playing) return;
    setPlaying(true);
    const eng = engine();
    void eng.resume();
    setAnalyser((prev) => prev ?? eng.getAnalyser());

    const end = DEMO_PHRASE.reduce(
      (max, step) => Math.max(max, step.at + step.hold),
      0,
    );

    for (const step of DEMO_PHRASE) {
      timers.current.push(window.setTimeout(() => press(step.note), step.at));
      timers.current.push(
        window.setTimeout(() => lift(step.note), step.at + step.hold),
      );
    }

    timers.current.push(window.setTimeout(() => setPlaying(false), end + 300));
  };

  /* ---- Key event wiring, shared by white and black keys ------------------ */

  const keyHandlers = (id: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      press(id);
    },
    onPointerUp: () => lift(id),
    onPointerLeave: () => lift(id),
    // Dragging across the keyboard should sound like a glissando.
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.buttons === 1) press(id);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!e.repeat) press(id);
      }
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') lift(id);
    },
    onBlur: () => lift(id),
  });

  /* ---- Key layout -------------------------------------------------------- */

  const { whiteKeys, blackKeys } = useMemo(() => {
    const notes = compact ? NOTES_COMPACT : NOTES;
    const whites = notes.filter((n) => !n.sharp);
    const blacks = notes
      .filter((n) => n.sharp)
      .map((note) => ({
        note,
        // Black keys sit on the boundary between the two whites they divide.
        left:
          (whites.filter((w) => w.frequency < note.frequency).length /
            whites.length) *
          100,
      }));
    return { whiteKeys: whites, blackKeys: blacks };
  }, [compact]);

  // Anything still sounding when the layout swaps would have no key to release.
  const lastLayout = useRef(compact);
  useEffect(() => {
    if (lastLayout.current === compact) return;
    lastLayout.current = compact;
    liftAll();
  }, [compact, liftAll]);

  return (
    <div className="piano">
      <div className="piano__bar">
        <div className="piano__status">
          <span className="label">Note</span>
          <span className="mono piano__note">{lastNote}</span>
        </div>

        <Waveform analyser={analyser} active={active.size > 0} />

        <button
          type="button"
          className="piano__play btn"
          onClick={playPhrase}
          disabled={playing}
        >
          <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
          {playing ? 'Playing' : 'Play a phrase'}
        </button>
      </div>

      <div
        className="piano__keys"
        style={{ '--white-count': whiteKeys.length } as React.CSSProperties}
        role="group"
        aria-label={`Interactive piano keyboard, ${
          compact ? 'one octave' : 'two octaves'
        }`}
      >
        <div className="piano__whites">
          {whiteKeys.map((note) => (
            <button
              key={note.id}
              type="button"
              className={`key key--white ${active.has(note.id) ? 'is-down' : ''}`}
              aria-label={`Play ${note.name} ${note.octave}`}
              aria-pressed={active.has(note.id)}
              {...keyHandlers(note.id)}
            >
              <span className="key__label mono" aria-hidden="true">
                {note.key ?? ''}
              </span>
            </button>
          ))}
        </div>

        <div className="piano__blacks">
          {blackKeys.map(({ note, left }) => (
            <button
              key={note.id}
              type="button"
              className={`key key--black ${active.has(note.id) ? 'is-down' : ''}`}
              style={{ left: `${left}%` }}
              aria-label={`Play ${note.name.replace('#', ' sharp')} ${note.octave}`}
              aria-pressed={active.has(note.id)}
              {...keyHandlers(note.id)}
            >
              <span className="key__label mono" aria-hidden="true">
                {note.key ?? ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="piano__hint">
        {compact ? (
          'Tap the keys.'
        ) : (
          <>
            Click the keys, or use your keyboard —{' '}
            <span className="mono">z x c v b n m</span> for the lower octave,{' '}
            <span className="mono">q w e r t y u</span> for the upper one.
          </>
        )}
      </p>
    </div>
  );
}
