'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseRealtimeTransferOptions {
  code: string | null;
  onConsumed?: () => void;
}

export function useRealtimeTransfer({ code, onConsumed }: UseRealtimeTransferOptions) {
  const supabase = useRef(createClient());

  useEffect(() => {
    if (!code) return;

    const channel = supabase.current
      .channel(`transfer-${code}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transfers',
          filter: `code=eq.${code}`,
        },
        (payload: RealtimePostgresChangesPayload<{ consumed_at: string | null }>) => {
          const newRecord = payload.new as { consumed_at: string | null };
          if (newRecord.consumed_at) {
            onConsumed?.();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.current.removeChannel(channel);
    };
  }, [code, onConsumed]);
}
