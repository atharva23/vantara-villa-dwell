-- Create enum for property categories
CREATE TYPE public.property_category AS ENUM ('Beach', 'Mountain', 'Heritage', 'Corporate');

-- Create enum for availability status
CREATE TYPE public.availability_status AS ENUM ('Available', 'Booked', 'Maintenance');

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10, 2) NOT NULL,
  no_of_bedrooms INTEGER NOT NULL DEFAULT 1,
  no_of_bathrooms INTEGER NOT NULL DEFAULT 1,
  amenities TEXT[] DEFAULT '{}',
  category property_category NOT NULL,
  images TEXT[] DEFAULT '{}',
  availability_status availability_status DEFAULT 'Available',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published properties
CREATE POLICY "Anyone can view published properties"
  ON public.properties
  FOR SELECT
  USING (published = TRUE);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', TRUE);

-- Storage policies for property images
CREATE POLICY "Anyone can view property images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'property-images');

-- Create form submissions tables
CREATE TABLE public.book_stay_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  no_of_guests INTEGER NOT NULL,
  property_id UUID REFERENCES public.properties(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.host_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  villa_name TEXT NOT NULL,
  location TEXT NOT NULL,
  amenities TEXT[],
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on form tables
ALTER TABLE public.book_stay_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create user roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies for properties table
CREATE POLICY "Admins can manage all properties"
  ON public.properties
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for storage
CREATE POLICY "Admins can upload property images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update property images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'property-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete property images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'property-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Anyone can submit inquiries and forms
CREATE POLICY "Anyone can submit book stay inquiries"
  ON public.book_stay_inquiries
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can submit host requests"
  ON public.host_submissions
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (TRUE);

-- Admins can view all submissions
CREATE POLICY "Admins can view all book stay inquiries"
  ON public.book_stay_inquiries
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all host submissions"
  ON public.host_submissions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();