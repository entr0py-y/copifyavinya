import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidCodeFormat } from '@/lib/code-generator';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const upperCode = code.toUpperCase();

    if (!isValidCodeFormat(upperCode)) {
      return NextResponse.json(
        { error: 'INVALID_CODE', message: 'Invalid code format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: transfer, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('code', upperCode)
      .single();

    if (error || !transfer) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Code not found' },
        { status: 404 }
      );
    }

    if (transfer.consumed_at) {
      return NextResponse.json(
        { error: 'CONSUMED', message: 'Transfer already retrieved' },
        { status: 410 }
      );
    }

    if (new Date(transfer.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'EXPIRED', message: 'Transfer has expired' },
        { status: 410 }
      );
    }

    const { error: updateError } = await supabase
      .from('transfers')
      .update({ consumed_at: new Date().toISOString() })
      .eq('code', upperCode);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      { content: transfer.content },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving transfer:', error);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
