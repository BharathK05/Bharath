import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeaderProps = {
  /** Two-digit sector number — the quietest F1 reference on the page. */
  sector: string;
  title: string;
  id?: string;
  lede?: ReactNode;
};

export function SectionHeader({ sector, title, id, lede }: SectionHeaderProps) {
  return (
    <header className="sec-head">
      <Reveal>
        <p className="sec-kicker">
          <span className="sec-kicker__dot" aria-hidden="true" />
          <span aria-hidden="true">Sector {sector}</span>
          <span className="sr-only">Section {sector}</span>
        </p>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="sec-title" id={id}>
          {title}
        </h2>
      </Reveal>
      {lede ? (
        <Reveal delay={120}>
          <p className="sec-lede">{lede}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
