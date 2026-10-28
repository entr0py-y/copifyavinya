'use client';
import { useState } from 'react';
import { useRealtimeTransfer } from '@/hooks/useRealtimeTransfer';

export function SendSection({ minimalMobile = false }: { minimalMobile?: boolean }) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'generated' | 'consumed' | 'error'>('idle');
  const [code, setCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useRealtimeTransfer({
    code,
    onConsumed: () => setStatus('consumed'),
  });

  const handleGenerate = async () => {
    if (!content.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to generate code');
      setCode(data.code);
      setStatus('generated');
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setContent('');
    setCode(null);
    setErrorMsg('');
  };

  return (
    <div
      className={minimalMobile ? '' : 'glass-panel'}
      style={minimalMobile 
        ? { display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' } 
        : { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }
      }
    >
      {/* Label - Hide on minimal mobile since it's redundant */}
      {!minimalMobile && (
        <p
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          Send Text
        </p>
      )}

      {status === 'idle' || status === 'loading' || status === 'error' ? (
        <>
          <textarea
            id="send-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text here…"
            disabled={status === 'loading'}
            rows={8}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.18)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--panel-border)')}
          />

          {errorMsg && (
            <p style={{ color: 'var(--error)', fontSize: '0.8rem', letterSpacing: '0.02em' }}>
              {errorMsg}
            </p>
          )}

          <button
            id="generate-code-btn"
            className="btn-primary"
            onClick={handleGenerate}
            disabled={!content.trim() || status === 'loading'}
          >
            {status === 'loading' ? <span className="spinner" /> : 'Generate Code'}
          </button>
        </>
      ) : status === 'generated' ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            padding: '1rem 0',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--accent-dim)', textTransform: 'uppercase' }}>
            Enter this code on your other device
          </p>

          <div
            className="text-mono"
            style={{
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'var(--accent)',
              lineHeight: 1,
            }}
          >
            {code}
          </div>

          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
            Expires in 10 minutes · used once
          </p>

          <button className="btn-secondary" onClick={reset}>
            Cancel
          </button>
        </div>
      ) : (
        /* consumed */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1rem 0',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
              fontSize: '1.2rem',
            }}
          >
            ✓
          </div>
          <div>
            <p style={{ marginBottom: '0.4rem', fontWeight: 400 }}>Transfer complete</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-dim)' }}>
              Received on the other device.
            </p>
          </div>
          <button className="btn-primary" onClick={reset}>
            Send New Text
          </button>
        </div>
      )}
    </div>
  );
}
