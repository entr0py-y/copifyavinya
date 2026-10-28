'use client';

import React, { useState, useEffect } from 'react';

interface CodeDisplayProps {
  code: string;
  expiresAt: string;
  consumed: boolean;
  onReset: () => void;
}

export default function CodeDisplay({ code, expiresAt, consumed, onReset }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('EXPIRED');
        return;
      }
      
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(`Expires in ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateTimeLeft(); // initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="code-display-container">
      <div className="code-label text-caption">YOUR CODE</div>
      
      <div className="code-chars-container" aria-label={`Code: ${code}`}>
        {code.split('').map((char, index) => (
          <div 
            key={index} 
            className={`code-char animate-scale-in stagger-${index + 1}`}
            aria-hidden="true"
          >
            {char}
          </div>
        ))}
      </div>

      <button 
        type="button"
        className="btn-copy" 
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
      >
        {copied ? 'COPIED ✓' : 'COPY CODE'}
      </button>

      <div className={`code-expiry ${isExpired ? 'expired' : ''}`}>
        {timeLeft}
      </div>

      <div className="status-indicator">
        {consumed ? (
          <div className="text-success animate-fade-in-up">
            Text retrieved on another device ✓
          </div>
        ) : !isExpired ? (
          <div className="code-waiting pulse animate-fade-in-up">
            Waiting for another device...
          </div>
        ) : null}
      </div>

      <button 
        type="button"
        className="btn-primary mt-4" 
        onClick={onReset}
      >
        CREATE NEW
      </button>
    </div>
  );
}
