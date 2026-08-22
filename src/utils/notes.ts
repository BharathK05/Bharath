export type Note = {
  /** e.g. "C4" */
  id: string;
  /** e.g. "C" */
  name: string;
  octave: number;
  frequency: number;
  sharp: boolean;
  /** Computer-keyboard key that plays this note, if any. */
  key?: string;
};

const NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

/** Equal temperament, A4 = 440 Hz, MIDI 69. */
function frequencyOf(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Two octaves, C4 → C6. The keyboard mapping uses the classic tracker layout:
 * the bottom rows are the lower octave, the top rows the upper one.
 */
const KEY_MAP: Record<string, string> = {
  C4: 'z',
  'C#4': 's',
  D4: 'x',
  'D#4': 'd',
  E4: 'c',
  F4: 'v',
  'F#4': 'g',
  G4: 'b',
  'G#4': 'h',
  A4: 'n',
  'A#4': 'j',
  B4: 'm',
  C5: 'q',
  'C#5': '2',
  D5: 'w',
  'D#5': '3',
  E5: 'e',
  F5: 'r',
  'F#5': '5',
  G5: 't',
  'G#5': '6',
  A5: 'y',
  'A#5': '7',
  B5: 'u',
  C6: 'i',
};

export const NOTES: Note[] = (() => {
  const out: Note[] = [];
  const startMidi = 60; // C4
  const endMidi = 84; // C6 inclusive

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const name = NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    const id = `${name}${octave}`;
    out.push({
      id,
      name,
      octave,
      frequency: frequencyOf(midi),
      sharp: name.includes('#'),
      key: KEY_MAP[id],
    });
  }
  return out;
})();

/**
 * A single octave, C4 -> C5. Used on narrow screens, where fifteen white keys
 * would each be too small to actually hit with a thumb.
 */
export const NOTES_COMPACT = NOTES.slice(0, 13);

export const WHITE_NOTES = NOTES.filter((n) => !n.sharp);

/** Lookup from a lowercased keyboard key to the note it triggers. */
export const NOTE_BY_KEY: Record<string, Note> = Object.fromEntries(
  NOTES.filter((n) => n.key).map((n) => [n.key as string, n]),
);

/** A short, recognisable phrase used by the "play a phrase" affordance. */
export const DEMO_PHRASE: { note: string; at: number; hold: number }[] = [
  { note: 'E5', at: 0, hold: 320 },
  { note: 'D#5', at: 340, hold: 320 },
  { note: 'E5', at: 680, hold: 320 },
  { note: 'D#5', at: 1020, hold: 320 },
  { note: 'E5', at: 1360, hold: 320 },
  { note: 'B4', at: 1700, hold: 320 },
  { note: 'D5', at: 2040, hold: 320 },
  { note: 'C5', at: 2380, hold: 320 },
  { note: 'A4', at: 2720, hold: 700 },
];
