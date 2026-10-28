import React from 'react';

export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="text-display">
        <span className="animate-fade-in-up stagger-1 block">MOVE TEXT.</span>
        <span className="animate-fade-in-up stagger-2 block">BETWEEN DEVICES.</span>
      </h1>
      <p className="hero-subtitle animate-fade-in-up stagger-3">
        A temporary bridge for the text you need somewhere else.
      </p>
    </section>
  );
}
