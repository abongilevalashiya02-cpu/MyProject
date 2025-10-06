
import React from 'react';
import AfricanCountriesGrid from './countries/AfricanCountriesGrid';

const AfricanCountries: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Explore Southern <span className="text-bantu-orange">Africa</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Discover the diverse beauty of 16 Southern African countries through our culture-powered tourism platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-bantu-orange rounded-full"></div>
              <span className="text-gray-700 font-medium">Tours Available Now</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">Coming in 2026</span>
            </div>
          </div>
        </div>
        
        <AfricanCountriesGrid />
      </div>
    </section>
  );
};

export default AfricanCountries;
