import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { skills } from '../data/profile';
import './Skills.css';

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="shell">
        <SectionHeader
          sector="04"
          title="Skills"
          id="skills-title"
          lede="Tools I reach for. No proficiency bars depth varies by project, and a percentage would only pretend otherwise."
        />

        <div className="skills">
          {skills.map((group, i) => (
            <Reveal className="skillgroup" key={group.title} delay={i * 60}>
              <div className="skillgroup__head">
                <span className="mono skillgroup__num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="skillgroup__title">{group.title}</h3>
              </div>
              <ul className="skillgroup__items">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
