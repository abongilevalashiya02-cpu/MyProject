
import React from 'react';
import { motion } from 'framer-motion';
import { CountryData } from '@/data/africanCountriesData';
import { RetreatDetails } from '@/data/retreatsData';

interface CountryDetailsOverlayProps {
  country: CountryData;
  retreatInfo: RetreatDetails;
}

const CountryDetailsOverlay: React.FC<CountryDetailsOverlayProps> = ({ country, retreatInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-black/80 z-20 p-4 overflow-y-auto text-white flex flex-col justify-center"
    >
      <div className="text-left">
        <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
          <span className="text-3xl">{country.code}</span>
          {country.name}
        </h3>
        <p className="font-semibold text-bantu-yellow text-sm italic mb-4">
          "{retreatInfo.retreatTitle}"
        </p>
        <ul className="space-y-1.5 text-xs">
          <li className="flex items-start"><span className="w-5 text-center mr-1">🗓️</span> <div><strong>Season:</strong> {retreatInfo.travelSeason}</div></li>
          <li className="flex items-start"><span className="w-5 text-center mr-1">🛂</span> <div><strong>Visa:</strong> {retreatInfo.visaRequirements}</div></li>
          <li className="flex items-start"><span className="w-5 text-center mr-1">🏞️</span> <div><strong>Attractions:</strong> {retreatInfo.attractions.join(', ')}</div></li>
          <li className="flex items-start"><span className="w-5 text-center mr-1">💰</span> <div><strong>Currency:</strong> {retreatInfo.currency}</div></li>
          <li className="flex items-start"><span className="w-5 text-center mr-1">🗣️</span> <div><strong>Language:</strong> {retreatInfo.language}</div></li>
        </ul>
      </div>
    </motion.div>
  );
};

export default CountryDetailsOverlay;
