'use client';

import { useEffect, useRef } from 'react';
import { Sacramento } from 'next/font/google';

const sacramento = Sacramento({ weight: '400', subsets: ['latin'], display: 'swap' });

/**
 * Copify logo: one continuous visual left→right reveal animation.
 *
 * Structure:
 *   [left wavy SVG line]  [copify in Sacramento font]  [right wavy SVG line]
 *   All three sit in a flex row, perfectly y-aligned.
 *
 * Animation:
 *   A CSS mask (linear-gradient black→black, no-repeat) is applied to the
 *   wrapper. Its size goes from 0% → 100% width, driven by a JS rAF loop.
 *   This sweeps a reveal from left to right over everything in one motion —
 *   line → letters → line — exactly like a pen drawing across the page.
 *
 * Why this works:
 *   The font renders truly readable "copify". The mask animation makes it
 *   look like it's being drawn. The SVG lines use vectorEffect="non-scaling-stroke"
 *   so they stay 1px regardless of viewport width. Wave amplitude is fixed.
 */
export function HandwrittenLogo() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const DELAY    = 300;  // ms before start
    const DURATION = 2500; // ms total

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let startTs: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts + DELAY;
      const elapsed = ts - startTs;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }

      const pct = Math.min(ease(elapsed / DURATION) * 100, 100);
      const maskVal = `${pct}% 100%`;
      el.style.setProperty('-webkit-mask-size', maskVal);
      el.style.setProperty('mask-size', maskVal);

      if (pct < 100) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Organic wavy lines — subtle ±5px y deviation, varied spacing
  const leftPath =
    'M 0,32 ' +
    'C 20,27 35,37 62,32 ' +
    'C 88,27 107,36 133,32 ' +
    'C 158,28 177,35 204,32 ' +
    'C 228,29 248,34 274,32 ' +
    'C 297,30 318,33 344,32 ' +
    'C 366,31 384,32 400,32';

  const rightPath =
    'M 0,32 ' +
    'C 16,32 30,33 54,32 ' +
    'C 80,28 98,37 125,32 ' +
    'C 150,27 170,35 197,32 ' +
    'C 221,29 241,34 268,32 ' +
    'C 292,30 313,33 340,32 ' +
    'C 363,31 382,32 400,32';

  return (
    <div aria-label="Copify" style={{ width: '100%' }}>
      <div
        ref={wrapperRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '70px',
          // CSS mask starts fully hidden; JS animates mask-size left→right
          WebkitMaskImage:  'linear-gradient(to right, black, black)',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize:   '0% 100%',
          maskImage:        'linear-gradient(to right, black, black)',
          maskRepeat:       'no-repeat',
          maskSize:         '0% 100%',
        } as React.CSSProperties}
      >
        {/* ── Left wavy line ── */}
        <svg
          viewBox="0 0 400 70"
          style={{ flex: 1, height: '70px', display: 'block', minWidth: 0 }}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cfy-lg-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0"    />
              <stop offset="10%"  stopColor="white" stopOpacity="0.44" />
              <stop offset="100%" stopColor="white" stopOpacity="0.44" />
            </linearGradient>
          </defs>
          <path
            d={leftPath}
            fill="none"
            stroke="url(#cfy-lg-left)"
            strokeWidth="1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* ── "copify" — Sacramento font, readable natural script ── */}
        <span
          className={sacramento.className}
          aria-hidden="true"
          style={{
            fontSize: '3rem',
            color: 'rgba(255,255,255,0.88)',
            whiteSpace: 'nowrap',
            display: 'block',
            lineHeight: 1,
            flexShrink: 0,
            padding: '0 0.3rem',
            // Sacramento's visual spine (midline of lowercase letters) sits
            // at roughly 55–60% of the em box from the top.
            // The SVG line is at y=32/70 ≈ 46% from top of container.
            // A small top offset closes the gap optically.
            position: 'relative',
            top: '7px',
          }}
        >
          copify
        </span>

        {/* ── Right wavy line ── */}
        <svg
          viewBox="0 0 400 70"
          style={{ flex: 1, height: '70px', display: 'block', minWidth: 0 }}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cfy-lg-right" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0.44" />
              <stop offset="90%"  stopColor="white" stopOpacity="0.44" />
              <stop offset="100%" stopColor="white" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <path
            d={rightPath}
            fill="none"
            stroke="url(#cfy-lg-right)"
            strokeWidth="1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
