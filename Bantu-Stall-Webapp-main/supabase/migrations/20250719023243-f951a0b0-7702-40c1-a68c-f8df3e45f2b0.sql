-- First drop the existing table to avoid conflicts
DROP TABLE IF EXISTS property_listings CASCADE;

-- Create storage bucket for property media
INSERT INTO storage.buckets (id, name, public) VALUES ('property-media', 'property-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create property listings table with all required fields
CREATE TABLE public.property_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  property_name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  proximity_to_landmark TEXT NOT NULL,
  description TEXT NOT NULL,
  min_capacity INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL,
  total_rooms INTEGER NOT NULL,
  meeting_rooms INTEGER NOT NULL,
  price_range_usd TEXT NOT NULL,
  price_range_zar TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  website_url TEXT,
  activities TEXT NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  accessibility TEXT[] DEFAULT '{}',
  unique_selling_points TEXT,
  booking_flexibility TEXT,
  preferred_guest_types TEXT[] DEFAULT '{}',
  languages_spoken TEXT[] DEFAULT '{}',
  marketing_source TEXT,
  eco_friendly BOOLEAN NOT NULL DEFAULT false,
  luxury BOOLEAN NOT NULL DEFAULT false,
  indoor_focus BOOLEAN NOT NULL DEFAULT false,
  outdoor_focus BOOLEAN NOT NULL DEFAULT false,
  csr_alignment BOOLEAN NOT NULL DEFAULT false,
  special_requests TEXT,
  media_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert property listings" 
ON public.property_listings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view property listings" 
ON public.property_listings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own listings" 
ON public.property_listings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage policies for property media
CREATE POLICY "Anyone can view property media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-media');

CREATE POLICY "Authenticated users can upload property media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-media' AND auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_property_listings_updated_at
BEFORE UPDATE ON public.property_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();