'use client';
import { useState, useRef } from 'react';

export function ReceiveSection({ minimalMobile = false }: { minimalMobile?: boolean }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultText, setResultText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRetrieve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleanCode.length !== 5) return;
    setStatus('loading');
    setErrorMsg('');
    setCopied(false);

    try {
      const res = await fetch(`/api/transfers/${cleanCode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to retrieve text');
      setResultText(data.content);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length <= 5) {
      setCode(val);
      if (status === 'error') setStatus('idle');
    }
  };

  const reset = () => {
    setStatus('idle');
    setCode('');
    setResultText('');
    setErrorMsg('');
    setCopied(false);
    setTimeout(() => inputRef.current?.focus(), 50);
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
          Receive Text
        </p>
      )}

      {status === 'idle' || status === 'loading' || status === 'error' ? (
        <form
          onSubmit={handleRetrieve}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
              flex: 1,
              padding: '1.5rem 0',
            }}
          >
            <p
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                color: 'var(--accent-dim)',
                textAlign: 'center',
              }}
            >
              Enter the 5-character code from your other device
            </p>

            {/* Code input — styled to show 5 character slots */}
            <input
              id="code-input"
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="· · · · ·"
              disabled={status === 'loading'}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={5}
              className="text-mono"
              style={{
                width: '100%',
                maxWidth: '320px',
                fontSize: '2.2rem',
                letterSpacing: '0.35em',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--panel-border)',
                color: 'var(--accent)',
                textAlign: 'center',
                outline: 'none',
                padding: '0.75rem 0',
                transition: 'border-color 0.2s',
                textTransform: 'uppercase',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--panel-border)')}
            />
          </div>

          {errorMsg && (
            <p
              style={{
                color: 'var(--error)',
                fontSize: '0.8rem',
                textAlign: 'center',
                letterSpacing: '0.02em',
              }}
            >
              {errorMsg}
            </p>
          )}

          <button
            id="retrieve-btn"
            type="submit"
            className="btn-secondary"
            disabled={code.length !== 5 || status === 'loading'}
          >
            {status === 'loading' ? <span className="spinner" /> : 'Retrieve Text'}
          </button>
        </form>
      ) : (
        /* success */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--success)',
              }}
            >
              Retrieved
            </span>
            <button
              onClick={reset}
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-dim)',
                letterSpacing: '0.06em',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              New code
            </button>
          </div>

          <div
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              color: 'var(--foreground)',
              fontSize: '0.9rem',
              lineHeight: 1.65,
              overflowY: 'auto',
              minHeight: '180px',
              maxHeight: '260px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {resultText}
          </div>

          <button
            id="copy-btn"
            className="btn-primary"
            onClick={handleCopy}
          >
            {copied ? 'Copied ✓' : 'Copy Text'}
          </button>
        </div>
      )}
    </div>
  );
}
