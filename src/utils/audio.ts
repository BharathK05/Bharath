/**
 * A very small Web Audio piano.
 *
 * No samples, no libraries: each note is a short additive stack (fundamental +
 * two quiet partials) through a percussive envelope and a lowpass that closes
 * as the note decays. It will never be a Steinway, but it is warm, tiny, and
 * loads instantly.
 */

type Voice = {
  stop: (when: number) => void;
};

export class PianoEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private voices = new Map<string, Voice>();

  /** Created lazily on the first user gesture, as autoplay policy requires. */
  private ensureContext(): AudioContext | null {
    if (this.ctx) return this.ctx;

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;

    const ctx = new Ctor();

    const master = ctx.createGain();
    master.gain.value = 0.9;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.75;

    // A touch of high-end roll-off keeps the additive stack from sounding brittle.
    const shelf = ctx.createBiquadFilter();
    shelf.type = 'highshelf';
    shelf.frequency.value = 3200;
    shelf.gain.value = -6;

    master.connect(shelf);
    shelf.connect(analyser);
    analyser.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    this.analyser = analyser;
    return ctx;
  }

  async resume() {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        /* the browser will let us try again on the next gesture */
      }
    }
    return ctx;
  }

  getAnalyser() {
    return this.analyser;
  }

  attack(id: string, frequency: number) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    if (ctx.state === 'suspended') void ctx.resume();

    // Re-triggering a held key should restart it, not stack voices.
    this.release(id, true);

    const now = ctx.currentTime;

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, now);

    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.Q.value = 0.6;
    tone.frequency.setValueAtTime(Math.min(9000, frequency * 9), now);
    tone.frequency.exponentialRampToValueAtTime(
      Math.max(420, frequency * 2.2),
      now + 1.6,
    );

    // Higher notes ring shorter and quieter, as they do on a real instrument.
    const brightness = Math.min(1, 320 / frequency);
    const peak = 0.16 + brightness * 0.1;

    voiceGain.gain.exponentialRampToValueAtTime(peak, now + 0.006);
    voiceGain.gain.exponentialRampToValueAtTime(peak * 0.28, now + 0.34);

    const partials: [number, number, OscillatorType][] = [
      [1, 1, 'triangle'],
      [2, 0.26, 'sine'],
      [3, 0.1, 'sine'],
    ];

    const oscillators = partials.map(([ratio, level, type]) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency * ratio;
      // A little inharmonicity, the way real strings behave.
      osc.detune.value = (ratio - 1) * 4;

      const gain = ctx.createGain();
      gain.gain.value = level;

      osc.connect(gain);
      gain.connect(tone);
      osc.start(now);
      return osc;
    });

    tone.connect(voiceGain);
    voiceGain.connect(this.master);

    this.voices.set(id, {
      stop: (when: number) => {
        const t = Math.max(when, ctx.currentTime);
        voiceGain.gain.cancelScheduledValues(t);
        voiceGain.gain.setValueAtTime(
          Math.max(voiceGain.gain.value, 0.0001),
          t,
        );
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        oscillators.forEach((osc) => osc.stop(t + 0.75));
        window.setTimeout(() => {
          try {
            voiceGain.disconnect();
            tone.disconnect();
          } catch {
            /* already torn down */
          }
        }, 900);
      },
    });
  }

  release(id: string, immediate = false) {
    const voice = this.voices.get(id);
    if (!voice || !this.ctx) return;
    this.voices.delete(id);
    voice.stop(this.ctx.currentTime + (immediate ? 0 : 0.02));
  }

  releaseAll() {
    for (const id of [...this.voices.keys()]) this.release(id);
  }

  dispose() {
    this.releaseAll();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.analyser = null;
  }
}
