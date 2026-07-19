-- Force drop the table in case an older version without the 'items' column already existed
DROP TABLE IF EXISTS public.carts CASCADE;

-- Recreate carts table to persist user shopping carts
CREATE TABLE public.carts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Policies for carts

-- Users can view their own cart
CREATE POLICY "Users can view own cart"
ON public.carts FOR SELECT
USING (auth.uid() = id);

-- Users can insert their own cart
CREATE POLICY "Users can insert own cart"
ON public.carts FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update their own cart
CREATE POLICY "Users can update own cart"
ON public.carts FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.carts;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.carts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';
