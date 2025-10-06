
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Star } from 'lucide-react';

const SouthAfricaHero = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <img 
        src="/lovable-uploads/be806ffc-213d-4526-9fc2-ba5265398bb5.png" 
        alt="Aerial view of Cape Town with Table Mountain" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-bantu-orange text-white">UNESCO World Heritage</Badge>
            <Badge className="bg-green-600 text-white">Cultural Immersion</Badge>
            <Badge className="bg-blue-600 text-white">Expert-Led</Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            A Journey Through Time: <br />
            <span className="text-bantu-orange">Unveiling South Africa's Heritage</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-6 max-w-3xl">
            An exclusive expedition through three UNESCO World Heritage sites with David Klinkenberg & Team, 
            exploring ancient San rock art, breathtaking landscapes, and profound historical narratives.
          </p>
          
          <div className="flex flex-wrap gap-6 items-center text-white">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span>November 13-18, 2025</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              <span>Cape Town • Cederberg • Drakensberg</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span>Private Group Experience</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              <span>3 UNESCO Sites</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SouthAfricaHero;
