import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllVenues } from '@/data/venues';
import { VenueType } from '@/types/venues';
import NewVenueDetail from '@/components/venues/NewVenueDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VenueDetail = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<VenueType | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (venueId) {
      const loadVenues = async () => {
        const allVenues = await getAllVenues();
        const foundVenue = allVenues.find(v => v.id.toString() === venueId);
        setVenue(foundVenue || null);
      };
      loadVenues();
    }
  }, [venueId]);

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
            <Button onClick={() => navigate('/musika')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Venues
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <NewVenueDetail venue={venue} />
      </main>
      
      <Footer />
    </div>
  );
};

export default VenueDetail;