# Bharath K — Portfolio

A personal portfolio for a software / AI engineer. Modern, minimal, dark by
default, with a restrained Formula 1 influence and a quieter piano one.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
npm run lint
```

## Your photo

Save your portrait to **`public/bharath.jpg`**. Until that file exists the hero
shows a dashed placeholder frame telling you where to put it — it will never
show a broken image. A portrait-orientation shot works best (the frame is 4:5);
anything from about 720×900 up is plenty.

To point at a different filename, change `profile.photo` in `src/data/profile.ts`.

## Editing your content

**Everything you need to change lives in one file: `src/data/profile.ts`.**

It is filled in from your resume. Two things are still marked
`TODO: REPLACE WITH YOUR INFORMATION`:

1. `projects[0].result` — DocuMindAI has no measured outcome yet.
2. `outside.body` — the paragraph about your piano playing.

Everything else is real. Where to find things:

| What                        | Where in `profile.ts`          |
| --------------------------- | ------------------------------ |
| Name, role, hero statement  | `profile`                      |
| Email, GitHub, LinkedIn     | `profile.links`, `profile.email` |
| About paragraphs + readout  | `about`                        |
| Skill groups                | `skills`                       |
| Projects                    | `projects`                     |
| Jobs                        | `experience`                   |
| Open source                 | `openSource`                   |
| Education                   | `education`                    |
| Music section + timing idea | `outside`                      |
| Contact blurb               | `contact`                      |

The `<title>` and meta description live in `index.html`.

## Structure

```
src/
  components/   Nav, Footer, Reveal, SectionHeader, HeroVisual, Piano, Waveform
  sections/     Hero, About, Projects, Experience, Skills, Outside, Contact
  data/         profile.ts  <- all content
  hooks/        useReveal, useScrollProgress, useActiveSection, useMediaQuery
  utils/        audio.ts (Web Audio piano), notes.ts (note table + key map)
  styles/       global.css (design tokens, layout primitives, shared atoms)
```

Each component owns a sibling `.css` file. Design tokens are the only place
colours are defined — `src/styles/global.css`.

## Notes on the design

- The palette is black / white / graphite. Red is an accent and gold appears
  exactly once (the word "timing"). Strip every accent and the layout still
  stands on its own.
- The hero visual is an SVG engineering plot; the red curve through it is a
  racing line, and the strip along the bottom is a waveform.
- The piano is synthesised with the Web Audio API — no audio files, no
  libraries. It drops to a single octave below 700px so the keys stay big
  enough to hit. Audio starts only on a real user gesture, as browsers require.
- `prefers-reduced-motion` disables the reveals and animation throughout.

## The contact form

The form validates client-side and then hands the message to the visitor's own
mail client via a `mailto:` link — there is no backend. To make it send
properly, replace the `window.location.href = 'mailto:...'` line in
`src/sections/Contact.tsx` with a POST to a form service (Formspree, Resend, or
your own endpoint).
