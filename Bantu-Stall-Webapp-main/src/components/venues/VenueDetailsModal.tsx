import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Star, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Car,
  Leaf, 
  Crown, 
  TreePine,
  Coffee,
  Play
} from 'lucide-react';
import { VenueType } from '@/types/venues';
import VenueVideoCard from './VenueVideoCard';

interface VenueDetailsModalProps {
  venue: VenueType | null;
  isOpen: boolean;
  onClose: () => void;
  onGetQuotation?: (venue: VenueType) => void;
}

const VenueDetailsModal: React.FC<VenueDetailsModalProps> = ({ 
  venue, 
  isOpen, 
  onClose,
  onGetQuotation 
}) => {
  if (!venue) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'fill-bantu-orange text-bantu-orange' : 'text-gray-300'}`}
      />
    ));
  };

  const getVenueDescription = () => {
    const name = venue.name.toLowerCase();
    
    if (name.includes('valverde')) {
      return "A pioneering eco-hotel that seamlessly blends sustainability with luxury, featuring an on-site aquaponics farm that supplies fresh produce to their restaurant. The venue runs entirely on solar power and rainwater harvesting systems. Their CSR programs include community upliftment initiatives and environmental education workshops. Located just 10 minutes from Lanseria Airport, making it easily accessible for corporate groups. The hotel offers unique team-building experiences around sustainable farming and renewable energy systems.";
    }
    if (name.includes('avianto')) {
      return "A world-class luxury resort that redefines corporate hospitality with its spa-focused wellness approach and resort-style amenities. The venue features multiple dining options, state-of-the-art conference facilities, and extensive recreational activities. Their signature wellness programs include corporate massage therapy and fitness sessions designed specifically for business retreats. The resort's elegant accommodation and professional event coordination ensure memorable experiences. Perfect for companies seeking to combine business objectives with employee wellness and relaxation.";
    }
    if (name.includes('glenburn')) {
      return "Situated within the UNESCO World Heritage Cradle of Humankind, this venue offers an unparalleled setting for corporate events and strategy sessions. With 22 versatile conference venues, it can accommodate everything from intimate board meetings to large product launches. The property's rich archaeological significance provides unique networking opportunities and educational experiences. Their professional event team specializes in creating customized corporate programs that leverage the venue's historical importance. The venue's proximity to paleontological sites offers distinctive team-building opportunities around human heritage and evolution.";
    }
    if (name.includes('cradle moon')) {
      return "An exclusive 1600-hectare private conservancy that offers authentic African wilderness experiences just 20 minutes from Sandton. The venue provides unmatched outdoor team-building opportunities including game drives, mountain biking, and boat cruises on pristine waterways. Their commitment to conservation and community development aligns perfectly with corporate CSR objectives. The transparent pricing model and top-tier outdoor activities make it ideal for companies seeking adventure-based team building. Professional guides and activity coordinators ensure safe, engaging experiences that build lasting team bonds.";
    }
    if (name.includes('misty hills')) {
      return "A boutique African luxury venue nestled within expansive botanical gardens, offering an intimate and sophisticated corporate retreat experience. The venue specializes in brand-immersive wellness retreats that combine African cultural experiences with modern business facilities. Their authentic African experiences include traditional ceremonies, local artisan workshops, and cultural storytelling sessions. The botanical garden setting provides a serene environment for strategic planning and creative workshops. Limited capacity ensures personalized service and exclusive access to all facilities for corporate groups.";
    }
    
    return `${venue.summary} This exceptional venue combines professional business facilities with unique local experiences, making it perfect for memorable corporate retreats. The dedicated event team ensures seamless coordination of all activities and logistics. Modern amenities and flexible spaces accommodate various corporate needs from strategy sessions to celebration events. The venue's commitment to excellence and attention to detail creates lasting impressions for business groups.`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(venue.bantuRating)}
                <span className="text-sm text-gray-600 ml-1">({venue.bantuRating}/5)</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Hero Media */}
              <div className="relative h-80 rounded-xl overflow-hidden">
                {venue.videoId ? (
                  <>
                    <VenueVideoCard 
                      videoId={venue.videoId} 
                      title={`${venue.name} - Corporate retreat venue preview`}
                      className="w-full h-full"
                    />
                    <div className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2">
                      <Play className="h-5 w-5" />
                    </div>
                  </>
                ) : (
                  <img
                    src={venue.coverImage}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Feature badges overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {venue.features.ecoFriendly && (
                    <Badge className="bg-green-600 text-white">
                      <Leaf className="h-3 w-3 mr-1" />
                      Eco-Friendly
                    </Badge>
                  )}
                  {venue.features.luxury && (
                    <Badge className="bg-yellow-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Luxury
                    </Badge>
                  )}
                  {venue.csrAlignment && (
                    <Badge className="bg-blue-600 text-white">
                      <TreePine className="h-3 w-3 mr-1" />
                      CSR Aligned
                    </Badge>
                  )}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About This Venue</h3>
                    <p className="text-gray-700 leading-relaxed">{getVenueDescription()}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Available Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {venue.activities.map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Venue Features</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {venue.features.ecoFriendly && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Leaf className="h-5 w-5" />
                          <span>Eco-Friendly Operations</span>
                        </div>
                      )}
                      {venue.features.luxury && (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Crown className="h-5 w-5" />
                          <span>Luxury Experience</span>
                        </div>
                      )}
                      {venue.features.indoorFocus && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Coffee className="h-5 w-5" />
                          <span>Indoor Facilities</span>
                        </div>
                      )}
                      {venue.features.outdoorFocus && (
                        <div className="flex items-center gap-2 text-green-600">
                          <TreePine className="h-5 w-5" />
                          <span>Outdoor Activities</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Key Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Quick Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{venue.capacity.min} - {venue.capacity.max} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{venue.location.city}, {venue.location.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span>{venue.location.proximityToSandton}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{venue.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{venue.contact.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span className="leading-relaxed">{venue.contact.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bantu-orange/5 border border-bantu-orange/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-bantu-orange">Pricing</h4>
                    <div className="text-lg font-semibold text-gray-900">
                      {venue.pricingSnapshot}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      *Final pricing depends on group size, dates, and selected services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              {onGetQuotation && (
                <Button 
                  onClick={() => onGetQuotation(venue)}
                  className="flex-1 bg-bantu-orange hover:bg-bantu-orange/90 text-white"
                >
                  Get Quotation
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueDetailsModal;