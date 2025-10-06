
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import PackageRating from './PackageRating';

interface SpeakerPackageHeroProps {
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  spotsLeft: number;
  isLimitedEdition: boolean;
}

const SpeakerPackageHero: React.FC<SpeakerPackageHeroProps> = ({
  title,
  location,
  duration,
  rating,
  reviewCount,
  spotsLeft,
  isLimitedEdition
}) => {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <img 
        src="/lovable-uploads/c7cbebca-0fa4-4298-b766-41851219592b.png" 
        alt="Johannesburg Skyline" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="container mx-auto">
          <Badge className="mb-4 bg-bantu-orange text-white">Opportunity Package</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{title}</h1>
          <p className="text-xl text-white/90 mb-6">{location} | {duration}</p>
          <div className="flex flex-wrap gap-4 items-center text-white">
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              <span>6 Days</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <PackageRating rating={rating} reviewCount={reviewCount} className="text-white" useCustomSymbols={true} />
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span>{spotsLeft} spots left</span>
            </div>
            {isLimitedEdition && (
              <div className="flex items-center">
                <Badge className="bg-amber-400 text-black font-medium">Limited Edition</Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakerPackageHero;
