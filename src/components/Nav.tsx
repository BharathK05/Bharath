import { useEffect, useMemo, useRef, useState } from 'react';
import { nav, profile } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useScrollProgress } from '../hooks/useScrollProgress';
import './Nav.css';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useScrollProgress();
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Must match the breakpoint in Nav.css that swaps the links for the toggle.
  const isCompact = useMediaQuery('(max-width: 860px)');

  const ids = useMemo(() => nav.map((item) => item.href.slice(1)), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Derived rather than synced: widening the window past the breakpoint hides
  // the toggle, and an open menu would otherwise be stranded — invisible, but
  // still locking the page from scrolling.
  const menuOpen = open && isCompact;

  // Lock the page behind the mobile menu, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/* The racing line: a single red hair that tracks scroll position. */}
      <div className="progress" aria-hidden="true">
        <div className="progress__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav__inner shell">
          <a className="nav__brand" href="#home" onClick={() => setOpen(false)}>
            <span className="nav__mark" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="nav__brand-text">
              {profile.name}
              {profile.role ? (
                <span className="nav__brand-role">{profile.role}</span>
              ) : null}
            </span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            <ul>
              {nav.map((item) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`nav__link ${isActive ? 'is-active' : ''}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className={`nav__toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">
              {menuOpen ? 'Close menu' : 'Open menu'}
            </span>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* `hidden` alone was not enough: `.menu { display: grid }` beat the UA
          rule for [hidden], so when closed the panel stayed in the layout and
          its links stayed in the tab order. The CSS now keeps it display:none
          until `.is-open`, and `inert` is belt-and-braces. */}
      <div
        id="mobile-menu"
        className={`menu ${menuOpen ? 'is-open' : ''}`}
        hidden={!menuOpen}
        inert={!menuOpen}
      >
        <ul className="menu__list">
          {nav.map((item, i) => (
            <li key={item.href} style={{ '--i': i } as React.CSSProperties}>
              <a href={item.href} onClick={() => setOpen(false)}>
                <span className="mono menu__num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="menu__foot mono">{profile.email}</p>
      </div>
    </>
  );
}
