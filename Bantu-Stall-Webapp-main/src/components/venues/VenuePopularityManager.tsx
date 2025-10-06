
import React, { useEffect, useState } from 'react';
import { VenueType } from '@/types/venues';
import { getAllVenues } from '@/data/venues';
import { supabase } from '@/integrations/supabase/client';

interface VenuePopularity {
  venue_id: number;
  request_count: number;
}

interface VenuePopularityManagerProps {
  onVenuesUpdate: (venues: VenueType[]) => void;
}

const VenuePopularityManager: React.FC<VenuePopularityManagerProps> = ({ onVenuesUpdate }) => {
  const [venuePopularity, setVenuePopularity] = useState<VenuePopularity[]>([]);
  const [isLoadingPopularity, setIsLoadingPopularity] = useState(true);

  // Fetch venue popularity data
  useEffect(() => {
    const fetchVenuePopularity = async () => {
      try {
        setIsLoadingPopularity(true);
        const { data, error } = await supabase
          .from('quotations')
          .select('id, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching venue popularity:', error);
          return;
        }

        // Count requests (simplified for now since venue_id is not in quotations table)
        const popularityMap: { [key: number]: number } = {};
        data?.forEach((request, index) => {
          const venueId = index + 1; // Simple mapping for demo
          popularityMap[venueId] = (popularityMap[venueId] || 0) + 1;
        });

        const popularityData = Object.entries(popularityMap).map(([venueId, count]) => ({
          venue_id: parseInt(venueId),
          request_count: count
        }));

        setVenuePopularity(popularityData);
      } catch (error) {
        console.error('Error fetching venue popularity:', error);
      } finally {
        setIsLoadingPopularity(false);
      }
    };

    fetchVenuePopularity();
  }, []);

  // Sort venues by popularity
  useEffect(() => {
    const sortVenuesByPopularity = async () => {
      const allVenues = await getAllVenues();
      const venuesWithPopularity = allVenues.map(venue => {
        const popularityData = venuePopularity.find(p => p.venue_id.toString() === venue.id.toString());
        return {
          ...venue,
          quotationRequests: popularityData?.request_count || 0
        };
      });

      // Sort by quotation requests (descending), then by bantu rating
      const sorted = venuesWithPopularity.sort((a, b) => {
        if (b.quotationRequests !== a.quotationRequests) {
          return b.quotationRequests - a.quotationRequests;
        }
        return b.bantuRating - a.bantuRating;
      });

      onVenuesUpdate(sorted);
    };

    if (!isLoadingPopularity) {
      sortVenuesByPopularity();
    }
  }, [venuePopularity, isLoadingPopularity, onVenuesUpdate]);

  return null; // This component only manages data, no UI
};

export default VenuePopularityManager;
