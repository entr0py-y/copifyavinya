'use client';

import React, { useRef, useState, KeyboardEvent, ChangeEvent, ClipboardEvent } from 'react';

interface CodeEntryProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
}

export default function CodeEntry({ onSubmit, isLoading }: CodeEntryProps) {
  const [chars, setChars] = useState<string[]>(Array(5).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    
    // Take only the last character if multiple are entered somehow
    val = val.slice(-1);
    
    const newChars = [...chars];
    newChars[index] = val;
    setChars(newChars);

    // Auto-advance
    if (val && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!chars[index] && index > 0) {
        // Move to previous input and clear it
        const newChars = [...chars];
        newChars[index - 1] = '';
        setChars(newChars);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newChars = [...chars];
        newChars[index] = '';
        setChars(newChars);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (pastedData) {
      const newChars = [...chars];
      for (let i = 0; i < 5; i++) {
        if (pastedData[i]) {
          newChars[i] = pastedData[i];
        }
      }
      setChars(newChars);
      
      // Focus the next empty input, or the last input
      const nextEmptyIndex = newChars.findIndex(c => !c);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 5) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[4]?.focus();
      }
    }
  };

  const isComplete = chars.every(char => char.length === 1);

  const handleSubmit = () => {
    if (isComplete && !isLoading) {
      onSubmit(chars.join(''));
    }
  };

  return (
    <div className="code-entry-container">
      <h2 className="code-entry-label text-heading">HAVE A CODE?</h2>
      
      <div className="code-inputs" aria-label="Enter 5-character code">
        {chars.map((char, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="text"
            autoComplete="off"
            maxLength={1}
            className="code-input"
            value={char}
            onChange={(e) => handleInput(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            aria-label={`Character ${index + 1}`}
          />
        ))}
      </div>

      <button
        type="button"
        className="btn-primary mt-6"
        onClick={handleSubmit}
        disabled={!isComplete || isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'FINDING...' : 'OPEN'}
        {!isLoading && <span className="arrow" aria-hidden="true">→</span>}
      </button>
    </div>
  );
}
