import { supabase } from "@/integrations/supabase/client";
import { PublicPropertyListing } from "./propertyListings";
import { VENUE_TYPE_MAPPING } from "@/utils/venuePricingUtils";

export interface PropertyListingWithVenueType extends PublicPropertyListing {
  venueType?: string;
}

/**
 * Fetch property listings filtered by venue type
 * Maps venue types to property types in the database
 */
export async function fetchPropertyListingsByVenueType(
  venueType: string
): Promise<PropertyListingWithVenueType[]> {
  // Get mapped property types for this venue type
  const propertyTypes = VENUE_TYPE_MAPPING[venueType] || [];
  
  if (propertyTypes.length === 0) {
    return [];
  }
  
  const { data, error } = await supabase.rpc("get_property_listings_public");
  
  if (error) throw error;
  
  // Filter by property type and add venueType field
  const filtered = (data || [])
    .filter((listing) => propertyTypes.includes(listing.property_type))
    .map((listing) => ({
      ...listing,
      venueType
    }));
  
  return filtered;
}

/**
 * Fetch all property listings with inferred venue types
 */
export async function fetchAllPropertyListingsWithVenueType(): Promise<PropertyListingWithVenueType[]> {
  const { data, error } = await supabase.rpc("get_property_listings_public");
  
  if (error) throw error;
  
  // Infer venue type from property type
  const withVenueTypes = (data || []).map((listing) => {
    let inferredVenueType: string | undefined;
    
    // Find matching venue type
    for (const [venueType, propertyTypes] of Object.entries(VENUE_TYPE_MAPPING)) {
      if (propertyTypes.includes(listing.property_type)) {
        inferredVenueType = venueType;
        break;
      }
    }
    
    return {
      ...listing,
      venueType: inferredVenueType
    };
  });
  
  return withVenueTypes;
}
