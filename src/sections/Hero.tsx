import { HeroPortrait } from '../components/HeroPortrait';
import { profile } from '../data/profile';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="shell hero__inner">
        <div className="hero__copy">
          {/* Both of these disappear entirely when their value is blank —
              an empty string must not leave its dot or its rule behind. */}
          {profile.availability ? (
            <p className="hero__eyebrow mono">
              <span className="hero__status" aria-hidden="true" />
              {profile.availability}
            </p>
          ) : null}

          <h1 className="hero__name">
            {(() => {
              const words = profile.headline.split(' ');
              // Match on letters only and ignore case, so the accent still
              // lands whether the headline reads "Bharath," or "bharath".
              const bare = (s: string) =>
                s.replace(/[^\p{L}\p{N}]/gu, '').toLocaleLowerCase();
              const accent = bare(profile.headlineAccent);

              return words.map((word, i) => (
                <span
                  className={`hero__word${
                    accent && bare(word) === accent ? ' hero__word--accent' : ''
                  }`}
                  key={`${word}-${i}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  {word}
                  {/* The caret rides on the last word so it hugs the full
                      stop instead of sitting a whole word-gap away. */}
                  {i === words.length - 1 ? (
                    <span className="hero__caret" aria-hidden="true" />
                  ) : null}
                </span>
              ));
            })()}
          </h1>

          {profile.role ? (
            <p className="hero__role mono">{profile.role}</p>
          ) : null}

          <p className="hero__statement">{profile.statement}</p>
          <p className="hero__personality">{profile.personalityLine}</p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">
              View my work
              <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href="#about">
              About me
            </a>
            <a className="btn" href="#contact">
              Contact
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <HeroPortrait />
        </div>
      </div>

      <div className="hero__foot shell">
        <span className="mono">Scroll</span>
        <span className="hero__rule" aria-hidden="true" />
        <span className="mono hero__foot-meta">01 / 07</span>
      </div>
    </section>
  );
}
