import { Piano } from '../components/Piano';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { outside } from '../data/profile';
import './Outside.css';

export function Outside() {
  const { connection } = outside;

  return (
    <section className="section outside" id="outside" aria-labelledby="outside-title">
      <div className="shell">
        <SectionHeader
          sector="05"
          title={outside.title}
          id="outside-title"
          lede={outside.subtitle}
        />

        <div className="outside__intro">
          <Reveal>
            <p className="outside__lead">{outside.intro}</p>
          </Reveal>
          <Reveal delay={80}>
            <p className="outside__body">{outside.body}</p>
          </Reveal>
        </div>

        <Reveal delay={120} className="outside__instrument">
          <Piano />
        </Reveal>

        {/* The one place the two interests are deliberately joined. */}
        <Reveal delay={80} className="timing">
          <p className="timing__kicker mono">{connection.kicker}</p>
          <p className="timing__line">
            {connection.line}{' '}
            <span className="timing__emphasis">{connection.emphasis}</span>
          </p>

          <div className="timing__pair">
            <div className="timing__col">
              <h3 className="timing__col-title">{connection.left.title}</h3>
              <ol className="timing__steps">
                {connection.left.items.map((item, i) => (
                  <li key={item} style={{ '--i': i } as React.CSSProperties}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="timing__divider" aria-hidden="true">
              <span />
            </div>

            <div className="timing__col timing__col--right">
              <h3 className="timing__col-title">{connection.right.title}</h3>
              <ol className="timing__steps">
                {connection.right.items.map((item, i) => (
                  <li key={item} style={{ '--i': i } as React.CSSProperties}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className="timing__note">{connection.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
