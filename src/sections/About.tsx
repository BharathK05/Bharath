import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { about, profile } from '../data/profile';
import './About.css';

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="shell">
        <SectionHeader sector="01" title="About Me" id="about-title" />

        <div className="about">
          <div className="about__body">
            <Reveal>
              <p className="about__lead">{about.lead}</p>
            </Reveal>
            {about.paragraphs.map((text, i) => (
              <Reveal key={i} delay={80 + i * 60}>
                <p className="about__p">{text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="about__side">
            {/* A quiet telemetry-style readout — the F1 detail in this section. */}
            <div className="readout">
              <div className="readout__head">
                <span className="mono">Readout</span>
                <span className="mono readout__delta">+0.214</span>
              </div>

              <dl className="readout__list">
                {about.readout.map((row) => (
                  <div className="readout__row" key={row.label}>
                    <dt className="mono">{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
                <div className="readout__row">
                  <dt className="mono">Interests</dt>
                  <dd className="readout__interests">
                    {profile.interests.join(' • ')}
                  </dd>
                </div>
              </dl>

              <div className="readout__trace" aria-hidden="true">
                <svg viewBox="0 0 240 40" preserveAspectRatio="none">
                  <path
                    d="M0 30 L28 30 L40 12 L64 12 L76 26 L108 26 L120 8 L152 8 L164 22 L196 22 L208 14 L240 14"
                    fill="none"
                    stroke="var(--red)"
                    strokeWidth="1.25"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
