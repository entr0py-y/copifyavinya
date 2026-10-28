export const dynamic = 'force-dynamic';
import { HomeClient } from '@/components/HomeClient';
import { Chatbot } from '@/components/Chatbot';

export default function Home() {
  return (
    <div className="main-layout">
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Dynamic Responsive Layout */}
        <HomeClient />
      </main>

      <footer
        className="animate-fade-in delay-400"
        style={{
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        <p
          className="text-mono"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.18)',
            textTransform: 'uppercase',
          }}
        >
          No Login Required.
        </p>
      </footer>
      <Chatbot />
    </div>
  );
}
