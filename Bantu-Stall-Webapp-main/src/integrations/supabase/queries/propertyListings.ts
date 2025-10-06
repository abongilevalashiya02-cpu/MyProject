import { supabase } from "@/integrations/supabase/client";

export interface PublicPropertyListing {
  id: string;
  property_name: string;
  description: string | null;
  property_type: string;
  location: string;
  area: string;
  proximity_to_landmark: string;
  min_capacity: number;
  max_capacity: number;
  total_rooms: number;
  meeting_rooms: number;
  eco_friendly: boolean;
  luxury: boolean;
  indoor_focus: boolean;
  outdoor_focus: boolean;
  csr_alignment: boolean;
  activities: string;
  amenities: string[];
  languages_spoken: string[] | null;
  accessibility: string[] | null;
  unique_selling_points: string | null;
  booking_flexibility: string | null;
  media_urls: string[] | null;
  price_range_usd: string;
  price_range_zar: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Fetch public-safe property listings via secure RPC (no contact fields)
export async function fetchPublicPropertyListings() {
  const { data, error } = await supabase.rpc("get_property_listings_public");
  if (error) throw error;
  return (data || []) as PublicPropertyListing[];
}
