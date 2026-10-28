export function Header() {
  return (
    <header style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
      <h1
        style={{
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--accent)',
        }}
      >
        COPIFY
      </h1>
    </header>
  );
}
