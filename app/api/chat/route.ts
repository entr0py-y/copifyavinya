import { NextResponse } from 'next/server';
import { HindsightClient } from '@vectorize-io/hindsight-client';

const HINDSIGHT_BASE_URL =
  process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
const HINDSIGHT_BANK_ID = process.env.HINDSIGHT_BANK_ID || 'copify-assistant';
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

    const client = new HindsightClient({
      baseUrl: HINDSIGHT_BASE_URL,
      apiKey,
    });
    const latestMessage = messages[messages.length - 1];
    const conversation = messages
      .map((message) => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}`)
      .join('\n');

    try {
      await client.retain(HINDSIGHT_BANK_ID, conversation);
    } catch (error) {
      const status = error instanceof Error ? error.message : error;
      if (!String(status).includes('404')) throw error;
      await client.createBank(HINDSIGHT_BANK_ID, { name: 'Copify Assistant' });
      await client.retain(HINDSIGHT_BANK_ID, conversation);
    }

    const response = await client.reflect(
      HINDSIGHT_BANK_ID,
      `You are the helpful Copify assistant. Answer clearly and concisely. Copify transfers text between devices using short-lived codes. Do not claim to perform actions you cannot perform.

Based on the conversation history, respond to the user's latest message:
${latestMessage.content}`
    );

    if (typeof response.text !== 'string' || response.text.trim().length === 0) {
      console.error('Hindsight API returned an invalid response');
      return NextResponse.json(
        { error: 'CHAT_INVALID_RESPONSE', message: 'The assistant returned an invalid response.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ content: response.text });
  } catch (error) {
    console.error('Error handling chat request:', error);
    return NextResponse.json(
      { error: 'CHAT_REQUEST_FAILED', message: 'Unable to send your message.' },
      { status: 500 }
    );
  }
}
