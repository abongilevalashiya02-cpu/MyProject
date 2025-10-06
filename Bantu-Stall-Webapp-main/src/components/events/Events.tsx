
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';
import UpcomingEventsTab from './UpcomingEventsTab';
import PastEventsTab from './PastEventsTab';
import { upcomingEvents, pastEvents } from '@/data/eventData';

const Events: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern"></div>
      </div>

      <div className="container px-6 mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-bantu-orange/10 text-bantu-orange border-none px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            Community Events
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Upcoming Events
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Connect with the Bantu community through our virtual and in-person events. Expand your network, share knowledge, and celebrate our culture.
          </p>

          {/* Event Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {[
              { number: "50+", label: "Events This Year", icon: <Calendar className="w-5 h-5" /> },
              { number: "5K+", label: "Attendees", icon: <Users className="w-5 h-5" /> },
              { number: "25", label: "Cities", icon: <MapPin className="w-5 h-5" /> },
              { number: "12", label: "Countries", icon: <ArrowRight className="w-5 h-5" /> }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-bantu-orange/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-bantu-orange">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="group bg-gradient-to-r from-bantu-orange to-bantu-yellow hover:from-bantu-orange/90 hover:to-bantu-yellow/90 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <CalendarPlus className="h-5 w-5 mr-2" />
              Add to My Calendar
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Tabs for filtering */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-gray-100 p-1 rounded-2xl border-0 shadow-lg">
                <TabsTrigger 
                  value="upcoming" 
                  className="px-8 py-3 rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="px-8 py-3 rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Past Events
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming">
              <UpcomingEventsTab upcomingEvents={upcomingEvents} />
            </TabsContent>
            
            <TabsContent value="past">
              <PastEventsTab pastEvents={pastEvents} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
