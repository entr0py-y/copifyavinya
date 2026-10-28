'use client';
import { useRef, useState } from 'react';

interface ActionSliderProps {
  direction: 'ltr' | 'rtl';
  label: string;
  onComplete: () => void;
}

export function ActionSlider({ direction, label, onComplete }: ActionSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const dragState = useRef({
    startX: 0,
    currentX: 0,
    trackWidth: 0,
    active: false,
  });
  
  const lastVibrateX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCompleted || !trackRef.current || !handleRef.current) return;
    
    handleRef.current.setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    dragState.current.active = true;
    dragState.current.startX = e.clientX;
    dragState.current.currentX = 0;
    lastVibrateX.current = 0;
    
    dragState.current.trackWidth = trackRef.current.getBoundingClientRect().width - 56;
    
    handleRef.current.style.transition = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.active || !handleRef.current) return;
    
    const deltaX = e.clientX - dragState.current.startX;
    let clampedX = 0;
    
    if (direction === 'ltr') {
      clampedX = Math.max(0, Math.min(deltaX, dragState.current.trackWidth));
    } else {
      clampedX = Math.min(0, Math.max(deltaX, -dragState.current.trackWidth));
    }
    
    dragState.current.currentX = clampedX;
    
    // Increased haptic feedback intensity
    if (Math.abs(clampedX - lastVibrateX.current) > 15) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      lastVibrateX.current = clampedX;
    }
    
    const newWidth = 56 + Math.abs(clampedX);
    handleRef.current.style.width = `${newWidth}px`;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.current.active || !handleRef.current) return;
    
    handleRef.current.releasePointerCapture(e.pointerId);
    dragState.current.active = false;
    setIsDragging(false);
    
    const progress = Math.abs(dragState.current.currentX) / dragState.current.trackWidth;
    
    if (progress > 0.8) {
      setIsCompleted(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
      handleRef.current.style.transition = 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
      handleRef.current.style.width = '100%';
      
      setTimeout(() => {
        onComplete();
        setTimeout(() => {
            if (handleRef.current) {
                handleRef.current.style.transition = 'none';
                handleRef.current.style.width = '56px';
                setIsCompleted(false);
            }
        }, 300);
      }, 300);
    } else {
      handleRef.current.style.transition = 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      handleRef.current.style.width = '56px';
      dragState.current.currentX = 0;
    }
  };

  return (
    <div 
      ref={trackRef}
      style={{ 
        position: 'relative',
        width: '100%', 
        maxWidth: '320px',
        height: '56px',
        borderRadius: '28px',
        background: 'transparent', 
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.05), inset 0 0 10px rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'center',
        touchAction: 'none'
      }}
    >
      {/* 5 Dots Indicator */}
      <div style={{
        position: 'absolute',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)' }} />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        width: '100%',
        textAlign: direction === 'ltr' ? 'right' : 'left',
        padding: direction === 'ltr' ? '0 24px 0 0' : '0 0 0 24px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'var(--font-sans)',
        fontSize: '1rem',
        fontWeight: 500,
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        {label}
      </div>

      <div
        ref={handleRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'absolute',
          left: direction === 'ltr' ? 0 : 'auto',
          right: direction === 'rtl' ? 0 : 'auto',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: 'linear-gradient(90deg, #d4ff47, #47ffd4)',
          boxShadow: isDragging 
            ? '0 0 25px rgba(71, 255, 212, 0.6)' 
            : '0 0 15px rgba(71, 255, 212, 0.3)',
          cursor: 'grab',
          touchAction: 'none',
          zIndex: 2,
        }}
      />
    </div>
  );
}
