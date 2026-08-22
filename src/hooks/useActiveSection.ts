import { useEffect, useState } from 'react';

/**
 * Tracks which section the reader is currently in, for the nav highlight.
 *
 * This deliberately does not use IntersectionObserver ratios. Sections here
 * differ enormously in height — Projects is roughly three times the viewport,
 * About is under one — and `intersectionRatio` is measured against the
 * element's own size. A short section that happens to be fully on screen
 * therefore scores 1.0 and beats a tall section filling the entire viewport at
 * 0.33, so the highlight jumps to the wrong link.
 *
 * Measuring against a fixed reading line just below the header is height
 * independent: the active section is simply the last one whose top has passed
 * that line.
 *
 * @param offset Distance from the top of the viewport to the reading line.
 *               Should roughly match the fixed header height.
 */
export function useActiveSection(ids: string[], offset = 90) {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (!ids.length) return;

    let frame = 0;

    const measure = () => {
      frame = 0;

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset + 1) current = id;
      }

      // The last section is usually shorter than the viewport, so its top may
      // never reach the reading line. Once the page is scrolled to the bottom,
      // that section is what the reader is looking at.
      const doc = document.documentElement;
      const atBottom = doc.scrollHeight - doc.scrollTop - doc.clientHeight < 2;
      if (atBottom) {
        for (let i = ids.length - 1; i >= 0; i--) {
          if (document.getElementById(ids[i])) {
            current = ids[i];
            break;
          }
        }
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids, offset]);

  return active;
}
