import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Activity, ChefHat, Brain, Flower2, TreePine, Palette, TrendingUp, Users, Building, Plus } from 'lucide-react';
import { VenueType } from '../../types/venues';
import { activityCategories } from '@/data/activityCategories';
import VenueVideoCard from './VenueVideoCard';
import { useNavigate } from 'react-router-dom';
import VenueDetailsModal from './VenueDetailsModal';
import NewVenueDetail from './NewVenueDetail';
import { useResponsiveVenueNavigation } from '@/hooks/useResponsiveVenueNavigation';

interface VenueCardProps {
  venue: VenueType & { quotationRequests?: number };
  onGetQuotation: (venue: VenueType) => void;
}

const VenueCard = ({ venue, onGetQuotation }: VenueCardProps) => {
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
        className={`h-4 w-4 ${
          i < rating ? 'fill-bantu-orange text-bantu-orange' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getActivityIcon = (iconName: string) => {
    const iconProps = { className: "h-3 w-3" };
    switch (iconName) {
      case 'Activity': return <Activity {...iconProps} />;
      case 'ChefHat': return <ChefHat {...iconProps} />;
      case 'Brain': return <Brain {...iconProps} />;
      case 'Flower2': return <Flower2 {...iconProps} />;
      case 'TreePine': return <TreePine {...iconProps} />;
      case 'Palette': return <Palette {...iconProps} />;
      default: return <Activity {...iconProps} />;
    }
  };

  const getVenueActivityCategories = () => {
    return activityCategories.filter(category => {
      return venue.activities.some(activity => 
        category.examples.some(example => 
          activity.toLowerCase().includes(example.toLowerCase()) ||
          example.toLowerCase().includes(activity.toLowerCase())
        )
      );
    }).slice(0, 2);
  };

  const getVenueType = () => {
    const name = venue.name.toLowerCase();
    const summary = venue.summary.toLowerCase();
    const activities = venue.activities.join(' ').toLowerCase();
    
    if (summary.includes('mountain') || name.includes('mountain') || summary.includes('magaliesberg')) {
      return { type: 'Mountain', emoji: '🏔️', color: 'bg-slate-100 text-slate-700' };
    }
    if (summary.includes('bush') || summary.includes('conservancy') || activities.includes('game drives') || summary.includes('wildlife')) {
      return { type: 'Bush', emoji: '🌿', color: 'bg-green-100 text-green-700' };
    }
    if (summary.includes('coast') || summary.includes('ocean') || summary.includes('beach')) {
      return { type: 'Coastal', emoji: '🌊', color: 'bg-blue-100 text-blue-700' };
    }
    if (summary.includes('cultural') || summary.includes('heritage') || summary.includes('museum') || summary.includes('humankind')) {
      return { type: 'Cultural', emoji: '🏛️', color: 'bg-purple-100 text-purple-700' };
    }
    if (summary.includes('island')) {
      return { type: 'Island', emoji: '🏝️', color: 'bg-cyan-100 text-cyan-700' };
    }
    return { type: 'Urban', emoji: '🏙️', color: 'bg-gray-100 text-gray-700' };
  };

  const getUniqueValue = () => {
    const name = venue.name.toLowerCase();
    const summary = venue.summary.toLowerCase();
    
    if (name.includes('valverde')) {
      return "Solar-powered eco lodge with aquaponics farm";
    }
    if (name.includes('glenburn')) {
      return "World Heritage Site with 22 conference venues";
    }
    if (name.includes('cradle moon')) {
      return "1600-hectare private conservancy experience";
    }
    if (name.includes('avianto')) {
      return "Luxury resort with wellness spa facilities";
    }
    if (name.includes('misty hills')) {
      return "Boutique African luxury in botanical gardens";
    }
    if (name.includes('bush willow')) {
      return "Authentic tented camp in indigenous bush";
    }
    if (name.includes('26d south')) {
      return "Designer venue where cosmopolitan meets nature";
    }
    if (name.includes('lieudegrace')) {
      return "Industrial chic warehouse for innovative teams";
    }
    if (name.includes('galagos')) {
      return "Four distinct conference venues with state-of-the-art equipment";
    }
    if (name.includes('shumba')) {
      return "Health spa and golf course access near Lanseria";
    }
    if (name.includes('the cradle')) {
      return "Four event spaces in Cradle of Humankind";
    }
    
    if (venue.csrAlignment && venue.features.ecoFriendly) {
      return "CSR-aligned eco-friendly venue";
    }
    if (venue.features.ecoFriendly) {
      return "Eco-friendly sustainable venue";
    }
    if (venue.features.luxury) {
      return "Luxury corporate retreat experience";
    }
    
    return "Premium corporate venue experience";
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

  const getConferenceRoomInfo = () => {
    const summary = venue.summary.toLowerCase();
    const name = venue.name.toLowerCase();
    
    const conferenceRoomMatch = summary.match(/(\d+)\s*(?:conference|meeting)\s*(?:rooms?|venues?)/i);
    if (conferenceRoomMatch) {
      return {
        rooms: parseInt(conferenceRoomMatch[1]),
        type: summary.includes('conference') ? 'conference' : 'meeting'
      };
    }
    
    if (name.includes('glenburn') && summary.includes('22 conference venues')) {
      return { rooms: 22, type: 'conference' };
    }
    
    if (name.includes('shumba') && summary.includes('6 meeting rooms')) {
      return { rooms: 6, type: 'meeting' };
    }
    
    if (name.includes('galagos') && summary.includes('four distinct conference venues')) {
      return { rooms: 4, type: 'conference' };
    }
    
    return null;
  };

  const matchedCategories = getVenueActivityCategories();
  const isPopular = venue.quotationRequests && venue.quotationRequests >= 5;
  const conferenceInfo = getConferenceRoomInfo();
  const venueType = getVenueType();
  const uniqueValue = getUniqueValue();
  const description = getVenueDescription();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.025, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden max-w-md mx-auto mb-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
        style={{ minHeight: 420 }}
        id={`venue-${venue.id}`}
        onClick={(e) => handleVenueClick(e, venue)}
      >
      <div className="relative h-40 overflow-hidden">
        {venue.videoId ? (
          <VenueVideoCard
            videoId={venue.videoId}
            title={`${venue.name} - Corporate retreat venue`}
            className="w-full h-full transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <img
            src={venue.coverImage}
            alt={`${venue.name} - Corporate retreat venue`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            itemProp="image"
            loading="lazy"
          />
        )}
        {venue.csrAlignment && (
          <Badge className="absolute top-3 left-3 bg-green-600 text-white text-xs">CSR</Badge>
        )}
        {venue.features.ecoFriendly && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white text-xs">Eco</Badge>
        )}
        {venue.quotationRequests && venue.quotationRequests >= 10 && (
          <Badge className="absolute bottom-3 right-3 bg-red-500 text-white flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3" />Hot
          </Badge>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate" title={venue.name}>{venue.name}</h3>
          <div className="flex items-center gap-1">{renderStars(venue.bantuRating)}</div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={`${venueType.color} font-medium text-xs`}>{venueType.emoji} {venueType.type}</Badge>
          <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{venue.location.city}</span>
        </div>
        <div className="mb-2">
          <span className="inline-block text-xs text-bantu-orange font-semibold bg-bantu-orange/10 rounded px-2 py-1">{uniqueValue}</span>
        </div>
        <div className="mb-2">
          <p className="text-xs text-gray-700 line-clamp-3">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {matchedCategories.map((category) => (
            <Badge key={category.id} variant="outline" className="text-xs flex items-center gap-1">
              {getActivityIcon(category.icon)}
              <span>{category.name}</span>
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{venue.capacity.min}-{venue.capacity.max} guests</span>
          </div>
          <span className="text-bantu-orange font-medium">{venue.pricingSnapshot}</span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onGetQuotation(venue);
          }}
          className="w-full bg-bantu-orange hover:bg-bantu-orange/90 text-white font-semibold rounded-lg py-2 mt-2 shadow-sm transition-all duration-200"
          itemProp="potentialAction"
          itemScope
          itemType="https://schema.org/ReserveAction"
        >
          Get a Quotation
        </Button>
      </div>
    </motion.div>

    {/* Use new venue detail modal for mobile */}
    {isMobile && selectedVenue ? (
      <NewVenueDetail
        venue={selectedVenue}
        isModal={true}
        onClose={handleCloseModal}
      />
    ) : (
      <VenueDetailsModal
        venue={selectedVenue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGetQuotation={onGetQuotation}
      />
    )}
  </>
  );
};

export default VenueCard;
