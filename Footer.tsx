import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <Link href="/" className="footer-brand logo" aria-label="Copify home">
          COPIFY
        </Link>
        <p className="footer-tagline">
          Move text. Anywhere.
          <br />
          Temporary by design.
        </p>
        <p className="footer-copy text-caption">
          © 2026 Copify
        </p>
      </div>
    </footer>
  );
}
