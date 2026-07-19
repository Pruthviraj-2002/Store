ALTER TABLE public.user_addresses 
RENAME COLUMN full_name TO first_name;

ALTER TABLE public.user_addresses 
ADD COLUMN last_name TEXT NOT NULL DEFAULT '';
