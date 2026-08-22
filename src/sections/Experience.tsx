import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { experience, openSource } from '../data/profile';
import './Experience.css';

export function Experience() {
  return (
    <section
      className="section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="shell">
        <SectionHeader sector="03" title="Experience" id="experience-title" />

        {/* The connecting line curves out of each node — a racing line, if you
            squint, and an ordinary timeline if you don't. */}
        <ol className="tl">
          {experience.map((role, i) => (
            <Reveal as="li" className="tl__item" key={role.id} delay={i * 90}>
              <div className="tl__marker" aria-hidden="true">
                <span className="tl__dot" />
              </div>

              <div className="tl__body">
                <p className="tl__period mono">{role.period}</p>
                <h3 className="tl__title">{role.title}</h3>
                <p className="tl__company">
                  {role.company}
                  <span className="tl__sep" aria-hidden="true">
                    /
                  </span>
                  <span className="tl__location">{role.location}</span>
                </p>
                <p className="tl__summary">{role.summary}</p>

                <ul className="tl__highlights">
                  {role.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>

                <ul className="tl__tech">
                  {role.tech.map((t, j) => (
                    <li key={`${t}-${j}`} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="subblock">
          <Reveal>
            <h3 className="subblock__title">Open Source</h3>
          </Reveal>

          <ul className="subblock__list">
            {openSource.map((item, i) => (
              <Reveal
                as="li"
                className="subblock__item"
                key={item.id}
                delay={i * 80}
              >
                <p className="subblock__meta mono">Merged</p>
                <div>
                  <h4 className="subblock__name">{item.project}</h4>
                  <p className="subblock__detail">{item.detail}</p>
                  <ul className="tl__tech">
                    {item.tech.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
