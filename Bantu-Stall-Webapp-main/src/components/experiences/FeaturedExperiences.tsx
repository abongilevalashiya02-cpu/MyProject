
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CuratedExperienceCard from './CuratedExperienceCard';
import VenuePreviewCard from './VenuePreviewCard';
import { curatedExperiences } from '@/data/curatedExperiences';
import { muldersdriftVenues } from '@/data/venues/muldersdriftVenues';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FeaturedExperiences = () => {
  const [activeTab, setActiveTab] = useState('cultural');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get featured venues for Musika tab (Avianto, Cradle Moon, Royal Elephant)
  const featuredVenues = muldersdriftVenues.filter(venue => 
    venue.name === 'Avianto' || 
    venue.name === 'Cradle Moon' || 
    venue.name === 'The Royal Elephant Hotel'
  );

  const handleBuildItinerary = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to build your itinerary",
        variant: "default",
      });
      navigate('/login');
    } else {
      navigate('/dashboard/traveler');
    }
  };

  const handleStartPlanning = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start planning a retreat",
        variant: "default",
      });
      navigate('/login');
    } else {
      navigate('/musika');
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-bantu-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-orange-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-bantu-orange to-gray-800 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Three Pathways to Transform Your Team
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover journeys where business insights, cultural immersion, and deep connection come alive.
          </motion.p>
          <motion.p 
            className="text-lg text-bantu-orange italic font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            "Business, culture, and belonging—designed into your next African journey."
          </motion.p>
        </motion.div>

        {/* Enhanced Tab Instructions */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 mb-2 font-medium">Choose your pathway</p>
          <p className="text-sm text-gray-500">Explore all three options below to find the perfect fit for your team</p>
        </motion.div>

        {/* Enhanced Experience Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 h-20 md:h-24 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-2 shadow-lg">
              <TabsTrigger 
                value="cultural" 
                className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-bantu-orange data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 transition-all duration-300 hover:bg-bantu-orange/10 hover:scale-[1.02] active:scale-[0.98] rounded-xl"
              >
                <span className="text-lg font-bold">Horo</span>
                <span className="text-xs font-normal md:hidden">Curated</span>
                <span className="text-xs font-normal hidden md:block lg:hidden">Curated learning experiences</span>
                <span className="text-xs font-normal hidden lg:block">Customizable, curated learning experiences for your team</span>
              </TabsTrigger>
              <TabsTrigger 
                value="belonging" 
                className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-bantu-orange data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 transition-all duration-300 hover:bg-bantu-orange/10 hover:scale-[1.02] active:scale-[0.98] rounded-xl"
              >
                <span className="text-lg font-bold">Musika</span>
                <span className="text-xs font-normal md:hidden">Build</span>
                <span className="text-xs font-normal hidden md:block lg:hidden">Build your own experience</span>
                <span className="text-xs font-normal hidden lg:block">Build your own experience from scratch</span>
              </TabsTrigger>
              <TabsTrigger 
                value="business" 
                className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-bantu-orange data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col gap-1 transition-all duration-300 hover:bg-bantu-orange/10 hover:scale-[1.02] active:scale-[0.98] rounded-xl"
              >
                <span className="text-lg font-bold">Watu</span>
                <span className="text-xs font-normal md:hidden">Join</span>
                <span className="text-xs font-normal hidden md:block lg:hidden">Join existing tours</span>
                <span className="text-xs font-normal hidden lg:block">Join existing tours in our community</span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="cultural" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curatedExperiences.cultural.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <CuratedExperienceCard 
                    experience={experience} 
                    onBuildItinerary={handleBuildItinerary}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="belonging" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVenues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <VenuePreviewCard venue={venue} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="business" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curatedExperiences.business.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <CuratedExperienceCard 
                    experience={experience} 
                    onBuildItinerary={handleBuildItinerary}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Button 
            className="rounded-full px-12 py-4 bg-gradient-to-r from-bantu-orange to-orange-600 hover:from-orange-600 hover:to-bantu-orange text-white text-lg font-semibold shadow-xl transform transition-all duration-300 hover:scale-105"
            onClick={handleStartPlanning}
          >
            Start Planning a Retreat
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedExperiences;
