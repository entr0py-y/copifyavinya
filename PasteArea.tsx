'use client';

import React, { useState } from 'react';

interface PasteAreaProps {
  onGenerate: (content: string) => void;
  isLoading: boolean;
}

export default function PasteArea({ onGenerate, isLoading }: PasteAreaProps) {
  const [content, setContent] = useState('');
  const MAX_CHARS = 50000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setContent(value);
    }
  };

  const handleSubmit = () => {
    if (content.trim() && !isLoading) {
      onGenerate(content);
    }
  };

  return (
    <div className="paste-area-container">
      <label htmlFor="paste-input" className="paste-label text-caption">
        PASTE TEXT
      </label>
      <textarea
        id="paste-input"
        className="paste-textarea"
        placeholder="Paste anything here..."
        value={content}
        onChange={handleChange}
        disabled={isLoading}
        aria-label="Paste text content"
      />
      <div className="paste-meta text-caption">
        {content.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
      </div>
      <button
        type="button"
        className="btn-primary"
        onClick={handleSubmit}
        disabled={content.trim().length === 0 || isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'GENERATING...' : 'GENERATE CODE'}
        {!isLoading && <span className="arrow" aria-hidden="true">→</span>}
      </button>
    </div>
  );
}
