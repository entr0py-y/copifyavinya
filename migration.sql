-- Copify Database Migration
-- Run this in the Supabase SQL Editor

-- 1. Create transfers table
CREATE TABLE IF NOT EXISTS public.transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ DEFAULT NULL
);

-- 2. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_transfers_code ON public.transfers (code);
CREATE INDEX IF NOT EXISTS idx_transfers_expires_at ON public.transfers (expires_at);

-- 3. Enable Row Level Security
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for anonymous access
CREATE POLICY "Allow public insert"
ON public.transfers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public select"
ON public.transfers
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public update"
ON public.transfers
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.transfers;

-- 6. Full replica identity for realtime payloads
ALTER TABLE public.transfers REPLICA IDENTITY FULL;
