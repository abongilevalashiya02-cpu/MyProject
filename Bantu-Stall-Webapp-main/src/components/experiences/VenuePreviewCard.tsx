
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users } from 'lucide-react';
import { VenueType } from '@/types/venues';
import VenueVideoCard from '@/components/venues/VenueVideoCard';
import { useNavigate } from 'react-router-dom';
import VenueDetailsModal from '@/components/venues/VenueDetailsModal';
import { useResponsiveVenueNavigation } from '@/hooks/useResponsiveVenueNavigation';

interface VenuePreviewCardProps {
  venue: VenueType;
}

const VenuePreviewCard: React.FC<VenuePreviewCardProps> = ({ venue }) => {
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = useState<VenueType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleVenueClick, createVenueLink, isMobile } = useResponsiveVenueNavigation({
    onVenueModal: (venue) => {
      setSelectedVenue(venue);
      setIsModalOpen(true);
    }
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'fill-bantu-orange text-bantu-orange' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer"
        onClick={(e) => handleVenueClick(e, venue)}
      >
      <div className="relative h-48 overflow-hidden">
        {venue.videoId ? (
          <VenueVideoCard 
            videoId={venue.videoId} 
            title={`${venue.name} - Corporate retreat venue preview`}
            className="w-full h-full"
          />
        ) : (
          <img
            src={venue.coverImage}
            alt={`${venue.name} - Corporate retreat venue`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        
        {venue.csrAlignment && (
          <Badge className="absolute top-3 left-3 bg-green-600 text-white text-xs">
            CSR Aligned
          </Badge>
        )}
        {venue.features.ecoFriendly && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white text-xs">
            Eco-Friendly
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1">
            {renderStars(venue.bantuRating)}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{venue.location.proximityToSandton}</span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {venue.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{venue.capacity.min}-{venue.capacity.max} guests</span>
          </div>
          {venue.features.luxury && (
            <Badge variant="outline" className="text-xs">
              Luxury
            </Badge>
          )}
        </div>

        <Button 
          onClick={(e) => {
            e.stopPropagation();
            handleVenueClick(e, venue);
          }}
          className="w-full bg-bantu-orange hover:bg-bantu-orange/90 text-white text-sm py-2"
        >
          View Full Details
        </Button>
      </CardContent>
    </Card>

    <VenueDetailsModal
      venue={selectedVenue}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    />
  </>
  );
};

export default VenuePreviewCard;
