'use client';
import { useState } from 'react';
import { SendSection } from './SendSection';
import { ReceiveSection } from './ReceiveSection';
import { ActionSlider } from './ActionSlider';

export function HomeClient() {
  const [mobileView, setMobileView] = useState<'home' | 'send' | 'receive'>('home');

  const LogoHeader = () => (
    <div className="animate-fade-in" style={{ width: '100%', textAlign: 'center', zIndex: 50, marginBottom: '2rem' }}>
      <h1 
        style={{ 
          fontFamily: 'var(--font-dancing-script), cursive',
          fontSize: '2.5rem', 
          fontWeight: 400,
          background: 'linear-gradient(90deg, #d4ff47, #47ffd4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          textTransform: 'lowercase',
          display: 'inline-block',
          filter: 'drop-shadow(0 0 8px rgba(135, 255, 142, 0.5))',
          margin: 0
        }}
      >
        copify
      </h1>
    </div>
  );

  const Hero = () => (
    <div
      className="container animate-fade-in delay-200"
      style={{ textAlign: 'center', marginBottom: '3rem' }}
    >
      <h2 className="heading-editorial">
        Move text between devices.
        <br />
        <span style={{ color: 'var(--accent-dim)', textShadow: 'none' }}>Instantly.</span>
      </h2>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP LAYOUT (Unchanged) ── */}
      <div className="desktop-only" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LogoHeader />
        <Hero />
        <div
          className="container animate-fade-in delay-300"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          <SendSection />
          <ReceiveSection />
        </div>
      </div>

      {/* ── MOBILE LAYOUT (New Redesign) ── */}
      <div
        className="mobile-only container animate-fade-in delay-300"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          width: '100%',
        }}
      >
        <LogoHeader />
        {mobileView === 'home' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5rem', // Increased gap for the sliders
              alignItems: 'center',
              width: '100%',
              maxWidth: '320px',
            }}
          >
            <Hero />
            
            <ActionSlider 
              direction="ltr" 
              label="Send" 
              onComplete={() => setMobileView('send')} 
            />
            
            <ActionSlider 
              direction="rtl" 
              label="Receive" 
              onComplete={() => setMobileView('receive')} 
            />
          </div>
        )}

        {mobileView === 'send' && (
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
            <button
              onClick={() => setMobileView('home')}
              className="mobile-back-btn text-mono"
            >
              &larr; Back
            </button>
            <SendSection minimalMobile={true} />
          </div>
        )}

        {mobileView === 'receive' && (
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
            <button
              onClick={() => setMobileView('home')}
              className="mobile-back-btn text-mono"
            >
              &larr; Back
            </button>
            <ReceiveSection minimalMobile={true} />
          </div>
        )}
      </div>
    </>
  );
}
