
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountryCard from './CountryCard';
import { getCountriesData, CountryData } from '@/data/africanCountriesData';

const AfricanCountriesGrid: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countriesData = await getCountriesData();
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to load countries data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {countries.map((country, index) => (
        <motion.div
          key={country.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="h-full"
        >
          <CountryCard 
            country={country} 
            patternIndex={index}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AfricanCountriesGrid;
