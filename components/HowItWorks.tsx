'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    number: '01.',
    title: 'PASTE',
    description: 'Paste the text you need to move.',
  },
  {
    number: '02.',
    title: 'CODE',
    description: 'Get a temporary 5-character code.',
  },
  {
    number: '03.',
    title: 'COPY',
    description: 'Enter the code on another device and copy the text.',
  },
] as const;

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const target = sectionRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="how-it-works section"
      ref={sectionRef}
      aria-labelledby="how-it-works-title"
    >
      <div className="container">
        <h2 id="how-it-works-title" className="text-caption text-center">
          HOW IT WORKS
        </h2>

        <div className="how-it-works-grid">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`step ${isVisible ? `animate-fade-in-up stagger-${index + 1}` : ''}`}
            >
              <div className="step-number" aria-hidden="true">
                {step.number}
              </div>
              <h3 className="step-title text-caption">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
