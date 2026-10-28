import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCode, MAX_CONTENT_LENGTH, EXPIRY_MINUTES } from '@/lib/code-generator';

export async function POST(request: Request) {
  try {
    // Rate limiting would go here
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'INVALID_CONTENT', message: 'Content must be a non-empty string' },
        { status: 400 }
      );
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: 'INVALID_CONTENT', message: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const expires_at = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000).toISOString();
    
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const code = generateCode();
      
      const { error } = await supabase
        .from('transfers')
        .insert({
          code,
          content,
          expires_at
        });

      if (!error) {
        return NextResponse.json(
          { code, expires_at },
          { status: 201 }
        );
      }

      if (error.code === '23505') {
        attempts++;
        continue;
      }

      throw error;
    }

    return NextResponse.json(
      { error: 'GENERATION_FAILED', message: 'Failed to generate a unique transfer code' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating transfer:', error);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
