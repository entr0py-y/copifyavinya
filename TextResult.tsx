'use client';

import React, { useState } from 'react';

interface TextResultProps {
  content: string;
  onReset: () => void;
}

export default function TextResult({ content, onReset }: TextResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="text-result-wrapper animate-fade-in-up">
      <div className="result-header">
        <div className="result-label text-success">TEXT FOUND</div>
        <button 
          type="button" 
          className={`btn-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'COPIED ✓' : 'COPY TEXT'}
        </button>
      </div>

      <div className="result-container" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {content}
      </div>

      <button 
        type="button"
        className="btn-primary mt-6" 
        onClick={onReset}
      >
        NEW TRANSFER
      </button>
    </div>
  );
}
