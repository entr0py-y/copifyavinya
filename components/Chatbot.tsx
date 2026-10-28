'use client';

import { FormEvent, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to reach the assistant.');
      setMessages([...nextMessages, { role: 'assistant', content: data.content }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach the assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      {open && (
        <section className="chatbot-panel" aria-label="Copify assistant">
          <div className="chatbot-header">
            <div>
              <p className="chatbot-eyebrow">Hindsight AI</p>
              <h2>Ask Copify</h2>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className="chatbot-messages" aria-live="polite">
            {messages.length === 0 && (
              <p className="chatbot-empty">How can I help you today?</p>
            )}
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`chatbot-message chatbot-message-${message.role}`}>
                {message.content}
              </p>
            ))}
            {loading && <p className="chatbot-message chatbot-message-assistant">Thinking…</p>}
          </div>

          {error && <p className="chatbot-error">{error}</p>}

          <form className="chatbot-form" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question…"
              aria-label="Message"
              maxLength={4000}
              disabled={loading}
            />
            <button type="submit" className="chatbot-send" disabled={!input.trim() || loading} aria-label="Send message">
              →
            </button>
          </form>
        </section>
      )}

      <button type="button" className="chatbot-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? '×' : 'Chat'}
      </button>
    </div>
  );
}
