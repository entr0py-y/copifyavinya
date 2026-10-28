import { NextResponse } from 'next/server';

const HINDSIGHT_API_URL =
  process.env.HINDSIGHT_API_URL || 'https://api.hindsight.vectorize.io/v1/chat/completions';
const HINDSIGHT_MODEL = process.env.HINDSIGHT_MODEL || 'gpt-4o-mini';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4_000;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.HINDSIGHT_API_KEY;
  if (!apiKey) {
    console.error('HINDSIGHT_API_KEY is not configured');
    return NextResponse.json(
      { error: 'CHAT_NOT_CONFIGURED', message: 'Chat is not configured yet.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const messages = body?.messages;

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > MAX_MESSAGES ||
      !messages.every(isChatMessage)
    ) {
      return NextResponse.json(
        { error: 'INVALID_MESSAGES', message: 'Provide between 1 and 20 valid messages.' },
        { status: 400 }
      );
    }

    const hindsightResponse = await fetch(HINDSIGHT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HINDSIGHT_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are the helpful Copify assistant. Answer clearly and concisely. Copify transfers text between devices using short-lived codes. Do not claim to perform actions you cannot perform.',
          },
          ...messages,
        ],
        temperature: 0.4,
      }),
    });

    const responseBody = await hindsightResponse.json().catch(() => null);
    if (!hindsightResponse.ok) {
      console.error('Hindsight API request failed:', hindsightResponse.status, responseBody);
      return NextResponse.json(
        { error: 'CHAT_PROVIDER_ERROR', message: 'The assistant is temporarily unavailable.' },
        { status: 502 }
      );
    }

    const content = responseBody?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || content.trim().length === 0) {
      console.error('Hindsight API returned an invalid response');
      return NextResponse.json(
        { error: 'CHAT_INVALID_RESPONSE', message: 'The assistant returned an invalid response.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error handling chat request:', error);
    return NextResponse.json(
      { error: 'CHAT_REQUEST_FAILED', message: 'Unable to send your message.' },
      { status: 500 }
    );
  }
}
