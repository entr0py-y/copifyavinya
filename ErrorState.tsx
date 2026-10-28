'use client';

import React from 'react';

type ErrorType = 'NOT_FOUND' | 'EXPIRED' | 'CONSUMED' | 'NETWORK' | 'UNKNOWN';

interface ErrorStateProps {
  type: ErrorType;
  onRetry: () => void;
}

const ERROR_MAP: Record<ErrorType, { title: string; message: string }> = {
  NOT_FOUND: {
    title: 'CODE NOT FOUND',
    message: 'Check the code and try again.',
  },
  EXPIRED: {
    title: 'TRANSFER EXPIRED',
    message: 'This code is no longer available.',
  },
  CONSUMED: {
    title: 'TRANSFER USED',
    message: 'This transfer has already been retrieved.',
  },
  NETWORK: {
    title: 'CONNECTION LOST',
    message: 'Please check your connection and try again.',
  },
  UNKNOWN: {
    title: 'SOMETHING WENT WRONG',
    message: 'An unexpected error occurred.',
  },
};

export default function ErrorState({ type, onRetry }: ErrorStateProps) {
  const errorDetails = ERROR_MAP[type] || ERROR_MAP.UNKNOWN;

  return (
    <div className="error-section animate-fade-in-up">
      <h2 className="error-title text-heading">{errorDetails.title}</h2>
      <p className="error-message text-body">{errorDetails.message}</p>
      
      <button 
        type="button"
        className="btn-primary mt-6" 
        onClick={onRetry}
      >
        TRY AGAIN
      </button>
    </div>
  );
}
