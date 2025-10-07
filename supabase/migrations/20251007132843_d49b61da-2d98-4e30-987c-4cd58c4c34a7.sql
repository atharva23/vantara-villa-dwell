-- Add new columns to properties table to match CSV structure
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS weekday_price numeric,
ADD COLUMN IF NOT EXISTS weekend_price numeric,
ADD COLUMN IF NOT EXISTS max_guests_base_price integer DEFAULT 8,
ADD COLUMN IF NOT EXISTS max_guests integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS extra_person_cost numeric DEFAULT 1000,
ADD COLUMN IF NOT EXISTS meal_charges_per_person numeric DEFAULT 1500;

-- Update existing price_per_night to use weekday_price if not set
UPDATE public.properties 
SET weekday_price = price_per_night 
WHERE weekday_price IS NULL;

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();