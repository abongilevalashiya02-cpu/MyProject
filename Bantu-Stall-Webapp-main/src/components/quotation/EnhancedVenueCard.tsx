import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MapPin, 
  Users, 
  Leaf, 
  Crown, 
  Check, 
  Phone, 
  Mail, 
  Wifi, 
  Car, 
  Coffee,
  TreePine,
  Play,
  X
} from 'lucide-react';
import { VenueType } from '@/types/venues';
import VenueVideoCard from '@/components/venues/VenueVideoCard';
import VenueDetailsModal from '@/components/venues/VenueDetailsModal';
import { useResponsiveVenueNavigation } from '@/hooks/useResponsiveVenueNavigation';

interface EnhancedVenueCardProps {
  venue: VenueType;
  isSelected: boolean;
  onSelect: (venue: VenueType) => void;
}

const EnhancedVenueCard: React.FC<EnhancedVenueCardProps> = ({ 
  venue, 
  isSelected, 
  onSelect 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
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
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getVenueActivities = () => {
    return venue.activities?.slice(0, 4) || [];
  };

  const getVenueHighlights = () => {
    const highlights = [];
    if (venue.features.ecoFriendly) highlights.push('Eco-Friendly');
    if (venue.features.luxury) highlights.push('Luxury Experience');
    if (venue.features.outdoorFocus) highlights.push('Outdoor Activities');
    if (venue.features.indoorFocus) highlights.push('Indoor Facilities');
    if (venue.csrAlignment) highlights.push('CSR Aligned');
    return highlights.slice(0, 3);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={`h-full transition-all duration-300 cursor-pointer relative overflow-hidden ${
          isSelected 
            ? 'ring-2 ring-primary bg-primary/5' 
            : 'hover:ring-1 hover:ring-border hover:shadow-xl'
        }`}>
          <div className="relative">
            {/* Video or Image */}
            {venue.videoId ? (
              <div className="relative h-48 overflow-hidden">
                <VenueVideoCard 
                  videoId={venue.videoId} 
                  title={`${venue.name} - Corporate retreat venue preview`}
                  className="w-full h-full"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
                  <Play className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <img
                src={venue.coverImage}
                alt={venue.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}

            {/* Feature badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[80%]">
              {venue.features.ecoFriendly && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  <Leaf className="h-3 w-3 mr-1" />
                  Eco
                </Badge>
              )}
              {venue.features.luxury && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Luxury
                </Badge>
              )}
              {venue.csrAlignment && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  <TreePine className="h-3 w-3 mr-1" />
                  CSR
                </Badge>
              )}
            </div>

            {/* View Details button on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isMobile) {
                        setSelectedVenue(venue);
                        setIsModalOpen(true);
                      } else {
                        setShowFullDetails(true);
                      }
                    }}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    View Full Details
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{venue.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(venue.bantuRating)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({venue.bantuRating}/5)
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {venue.summary}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="line-clamp-1">{venue.location.proximityToSandton}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                {venue.capacity.min}-{venue.capacity.max}
              </div>
            </div>

            {/* Quick highlights */}
            <div className="flex flex-wrap gap-1">
              {getVenueHighlights().map((highlight, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {highlight}
                </span>
              ))}
            </div>

            <div className="text-sm font-medium text-primary">
              {venue.pricingSnapshot.split(' - ')[0]}
            </div>

            <Button
              variant={isSelected ? "default" : "outline"}
              className="w-full"
              onClick={() => onSelect(venue)}
            >
              {isSelected ? "Selected" : "Select This Venue"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Full Details Modal */}
      <AnimatePresence>
        {showFullDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{venue.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Hero Image/Video */}
                <div className="relative h-64 rounded-lg overflow-hidden">
                  {venue.videoId ? (
                    <VenueVideoCard 
                      videoId={venue.videoId} 
                      title={`${venue.name} - Corporate retreat venue preview`}
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={venue.coverImage}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">About This Venue</h3>
                      <p className="text-muted-foreground">{venue.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Location & Access</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {venue.location.city}, {venue.location.area}
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          {venue.location.proximityToSandton}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Capacity</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {venue.capacity.min} - {venue.capacity.max} guests
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {venue.contact.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {venue.contact.email}
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>{venue.contact.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Venue Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {venue.features.ecoFriendly && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Leaf className="h-4 w-4" />
                            Eco-Friendly
                          </div>
                        )}
                        {venue.features.luxury && (
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <Crown className="h-4 w-4" />
                            Luxury
                          </div>
                        )}
                        {venue.features.indoorFocus && (
                          <div className="flex items-center gap-2 text-sm">
                            <Coffee className="h-4 w-4" />
                            Indoor Focus
                          </div>
                        )}
                        {venue.features.outdoorFocus && (
                          <div className="flex items-center gap-2 text-sm">
                            <TreePine className="h-4 w-4" />
                            Outdoor Focus
                          </div>
                        )}
                        {venue.csrAlignment && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <TreePine className="h-4 w-4" />
                            CSR Aligned
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Available Activities</h4>
                      <div className="flex flex-wrap gap-2">
                        {venue.activities.map((activity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Pricing</h4>
                      <div className="text-sm">
                        <div className="font-medium text-primary text-lg">
                          {venue.pricingSnapshot}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Bantu Rating</h4>
                      <div className="flex items-center gap-2">
                        {renderStars(venue.bantuRating)}
                        <span className="text-sm text-muted-foreground">
                          ({venue.bantuRating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="border-t pt-4">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => {
                      onSelect(venue);
                      setShowFullDetails(false);
                    }}
                  >
                    {isSelected ? "Selected" : "Select This Venue"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Mobile Modal */}
      <VenueDetailsModal
        venue={selectedVenue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGetQuotation={(venue) => {
          onSelect(venue);
          handleCloseModal();
        }}
      />
    </>
  );
};

export default EnhancedVenueCard;