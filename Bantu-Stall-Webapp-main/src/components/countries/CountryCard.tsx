
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { CountryData } from '@/data/africanCountriesData';
import { patterns } from '@/data/backgroundPatterns';
import { retreatsData } from '@/data/retreatsData';
import CountryDetailsOverlay from './CountryDetailsOverlay';

export interface CountryCardProps {
  country: CountryData;
  patternIndex: number;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, patternIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const retreatInfo = retreatsData[country.name];

  const handleMouseEnter = () => {
    if (!isMobile && country.isActive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && country.isActive) {
      setIsHovered(false);
    }
  };

  // For mobile, show destinations on tap (toggle) - only for active countries
  const handleClick = () => {
    if (isMobile && country.isActive) {
      setIsHovered(!isHovered);
    }
  };
  
  const imageUrl = retreatInfo?.imageUrl;

  return (
    <Card
      className={`relative h-full min-h-[250px] overflow-hidden transition-all duration-300 ${
        country.isActive ? 'hover:shadow-lg cursor-pointer' : 'cursor-default'
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-0 h-full">
        {imageUrl && imageUrl !== '/placeholder.svg' ? (
          <motion.div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
            animate={country.isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={country.isActive ? {
              duration: 15,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
            } : {}}
          />
        ) : (
          <div className={`absolute inset-0 ${patterns[patternIndex % patterns.length]}`}></div>
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-br from-bantu-orange/80 to-bantu-yellow/80 ${
          country.isActive ? 'opacity-70' : 'opacity-50'
        }`}></div>
        
        {/* Inactive overlay */}
        {!country.isActive && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px] z-[5]"></div>
        )}
        
        {/* Country shape */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d={country.shape} fill="#fff" />
          </svg>
        </div>
        
        {/* Country name and flag */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
          <span className="text-2xl mb-2">{country.code}</span>
          <h3 className="text-xl font-bold text-white">{country.name}</h3>
          
          {/* Coming Soon Badge for inactive countries */}
          {!country.isActive && (
            <Badge variant="secondary" className="mt-3 bg-orange-600 text-white border-0 font-medium">
              Coming 2026
            </Badge>
          )}
        </div>

        {/* Interactive CTA Text - only for active countries */}
        {country.isActive && (
          <div className="absolute bottom-3 right-3 z-10">
            <motion.div
              className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white font-medium border border-white/20"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(251, 146, 60, 0)',
                  '0 0 0 4px rgba(251, 146, 60, 0.3)',
                  '0 0 0 8px rgba(251, 146, 60, 0.1)',
                  '0 0 0 0 rgba(251, 146, 60, 0)'
                ],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {isMobile ? 'Tap to explore' : 'Hover to explore'}
            </motion.div>
          </div>
        )}
        
        {/* Details overlay - animated on desktop hover or mobile tap - only for active countries */}
        <AnimatePresence>
          {isHovered && country.isActive && retreatInfo && (
            <CountryDetailsOverlay country={country} retreatInfo={retreatInfo} />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CountryCard;
