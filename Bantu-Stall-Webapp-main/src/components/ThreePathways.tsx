import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users2, Store, Calendar, ArrowRight, Users, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getAllVenues } from '@/data/venues';
import { VenueType } from '@/types/venues';
import { useNavigate } from 'react-router-dom';
import { getAllRatings, formatRatingsString } from '@/utils/experienceRatingUtils';
import HoroApplicationModal from '@/components/horo/HoroApplicationModal';

const ThreePathways = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [topVenues, setTopVenues] = useState<VenueType[]>([]);
  const [isHoroModalOpen, setIsHoroModalOpen] = useState(false);
  const navigate = useNavigate();

  const horoImages = [
    '/lovable-uploads/cbe5e58e-9ae6-4121-8ad8-7abbd24c2694.png',
    '/lovable-uploads/11e0babb-93de-4049-9a4a-adee1f52e34e.png',
    '/lovable-uploads/24fe6df0-1a9f-453a-bd85-92a96cba4c6a.png',
    '/lovable-uploads/f7e54fe4-7446-48c8-976d-40258db76ea3.png',
  ];

  // Auto-rotate images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % horoImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [horoImages.length]);

  // Load top 4 venues by popularity
  useEffect(() => {
    const loadTopVenues = async () => {
      try {
        const allVenues = await getAllVenues();
        const sortedVenues = allVenues
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 4);
        setTopVenues(sortedVenues);
      } catch (error) {
        // Handle venue loading error silently
      }
    };
    loadTopVenues();
  }, []);

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

  // Helper function to create rating symbols with tooltips
  const renderRatingWithTooltips = (ratingsString: string) => {
    const ratingDescriptions: { [key: string]: string } = {
      '⭐': 'Luxury Rating - Premium experience with finer amenities',
      '💰': 'Budget-Friendly - Better value for money',
      '🍃': 'Eco-Friendly - Environmental sustainability practices',
      '🛡️': 'Cultural Depth - Authenticity and cultural immersion',
      '🛋️': 'Comfort - Physical comfort and convenience'
    };

    // Split the ratings string and process each part
    const parts = ratingsString.split(' ');
    
    return (
      <span className="inline-flex gap-1 flex-wrap">
        {parts.map((part, index) => {
          // Check if this part contains a rating symbol
          const symbol = Object.keys(ratingDescriptions).find(sym => part.includes(sym));
          
          if (symbol) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span className="cursor-help hover:bg-gray-100 px-1 rounded transition-colors">
                    {part}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">{ratingDescriptions[symbol]}</p>
                </TooltipContent>
              </Tooltip>
            );
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </span>
    );
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-bantu-orange to-gray-800 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover Bantu Stall's Key Areas
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Explore curated experiences, build custom adventures, and join exclusive excursions across Africa.
          </motion.p>
          <motion.p 
            className="text-lg text-bantu-orange font-medium italic max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            "Where authentic African experiences meet modern corporate needs."
          </motion.p>
        </motion.div>

        {/* Bantu Stall Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* HORO - Curated Experiences */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-500 border-2 hover:border-bantu-orange/20">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={horoImages[currentImageIndex]}
                  alt="Horo curated experiences"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bantu-orange to-orange-600 text-white flex items-center justify-center shadow-lg">
                    <Users2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">Horo</h3>
                  <p className="text-white/90 text-sm">Curated Leadership Experiences</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Whether you're searching for a learning opportunity, team building excursion, a token of appreciation, or just a way to treat yourself and/or your team, we hope you'll find exactly what you're looking for, or, even better, something you never knew was possible.
                </p>
                <div className="flex items-center gap-2 text-sm text-bantu-orange font-medium mb-4">
                  <Users className="w-4 h-4" />
                  <span>Leadership & Team Development</span>
                </div>
                <Button 
                  className="w-full bg-bantu-orange hover:bg-bantu-orange/90 text-white group-hover:bg-gradient-to-r group-hover:from-bantu-orange group-hover:to-orange-600"
                  onClick={() => setIsHoroModalOpen(true)}
                >
                  Apply to Gain Access <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Get feedback within 24 hours, whether or not you qualify to access this knowledge hub.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* MUSIKA - Build from Scratch */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-500 border-2 hover:border-bantu-orange/20">
              <div className="relative p-6 bg-gradient-to-br from-bantu-orange/10 to-orange-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bantu-orange to-orange-600 text-white flex items-center justify-center shadow-lg mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Musika</h3>
                <p className="text-gray-600 text-sm mb-4">Build Your Experience from Scratch</p>
                
                {/* Top 4 Venues Preview */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Top Trending Venues:</p>
                  {topVenues.map((venue, index) => (
                     <motion.div
                       key={venue.id}
                       className="flex items-center gap-3 p-2 rounded-lg bg-white/80 hover:bg-white transition-colors cursor-pointer"
                       whileHover={{ x: 5 }}
                       onClick={() => {
                         // Always navigate to Musika page for venue browsing
                         navigate(`/musika#venue-${venue.id}`);
                       }}
                     >
                      <img
                        src={venue.coverImage}
                        alt={venue.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{venue.name}</p>
                        <div className="text-xs text-gray-600">
                          <TooltipProvider>
                            {(() => {
                              const allRatings = getAllRatings(venue);
                              const { ratingsString } = formatRatingsString(allRatings);
                              return renderRatingWithTooltips(ratingsString);
                            })()}
                          </TooltipProvider>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <CardContent className="p-6 pt-0">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Start with the perfect venue and build your unique experience. Choose from our top-rated locations and customize every detail.
                </p>
                <div className="flex items-center gap-2 text-sm text-bantu-orange font-medium mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>Custom Venue Selection</span>
                </div>
                <Button 
                  className="w-full bg-bantu-orange hover:bg-bantu-orange/90 text-white group-hover:bg-gradient-to-r group-hover:from-bantu-orange group-hover:to-orange-600"
                  onClick={() => navigate('/musika')}
                >
                  Build Experience <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* WATU - Limited Edition Excursions (Coming Soon) */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-500 border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 relative">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 z-10 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-bantu-orange to-orange-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 20px rgba(255, 165, 0, 0.3)",
                        "0 0 30px rgba(255, 165, 0, 0.6)", 
                        "0 0 20px rgba(255, 165, 0, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Calendar className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Watu</h3>
                  <p className="text-white/90 text-sm mb-4">Limited Edition Excursions</p>
                  <Badge className="bg-bantu-orange text-white px-4 py-2">Coming Soon</Badge>
                </div>
              </div>
              
              <div className="relative h-64 overflow-hidden opacity-30">
                <div className="w-full h-full bg-gradient-to-br from-bantu-orange/20 to-orange-200 flex items-center justify-center">
                  <Users className="w-24 h-24 text-bantu-orange/40" />
                </div>
              </div>
              
              <CardContent className="p-6 opacity-30">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Join exclusive, limited-edition excursions with fellow adventurers. Experience Africa's hidden gems in carefully curated small groups.
                </p>
                <div className="flex items-center gap-2 text-sm text-bantu-orange font-medium mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Exclusive Group Adventures</span>
                </div>
                <Button 
                  disabled
                  className="w-full bg-gray-400 text-white cursor-not-allowed"
                >
                  Notify When Available
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-4"
            whileHover={{ y: -2 }}
          >
            <Button
              size="lg"
              className="px-8 py-4 bg-gradient-to-r from-bantu-orange to-orange-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setIsHoroModalOpen(true)}
            >
              Start with Horo
            </Button>
            <span className="text-gray-400">or</span>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 border-bantu-orange text-bantu-orange rounded-full font-semibold text-lg hover:bg-bantu-orange hover:text-white transition-all duration-300"
              onClick={() => navigate('/musika')}
            >
              Start Exploring
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Horo Application Modal */}
      <HoroApplicationModal 
        isOpen={isHoroModalOpen} 
        onClose={() => setIsHoroModalOpen(false)} 
      />
    </section>
  );
};

export default ThreePathways;