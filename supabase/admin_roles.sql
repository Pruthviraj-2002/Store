-- Add Role-Based Access Control to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Forcefully upgrade the specific test account to an admin
UPDATE public.profiles
SET is_admin = true
WHERE email = 'yeshwanthg49@gmail.com';

-- Automatically update the schema cache so the API recognizes the new column instantly
NOTIFY pgrst, 'reload schema';
