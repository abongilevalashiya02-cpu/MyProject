
import React from 'react';
import VictoriaFallsPackageCard from './VictoriaFallsPackageCard';
import FullExperiencePackageCard from './FullExperiencePackageCard';
import CapeTownExtension from './CapeTownExtension';

interface PricingOptionsProps {
  onBookNow: () => void;
}

const PricingOptions: React.FC<PricingOptionsProps> = ({ onBookNow }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Journey</h2>
          <p className="text-lg text-gray-600">Select the perfect package for your adventure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Victoria Falls Only - Individual */}
          <VictoriaFallsPackageCard isCouple={false} onBookNow={onBookNow} />

          {/* Victoria Falls Only - Couple */}
          <VictoriaFallsPackageCard isCouple={true} onBookNow={onBookNow} />

          {/* Full Experience - Individual */}
          <FullExperiencePackageCard isCouple={false} onBookNow={onBookNow} />

          {/* Full Experience - Couple */}
          <FullExperiencePackageCard isCouple={true} onBookNow={onBookNow} />
        </div>

        {/* Cape Town Add-on */}
        <CapeTownExtension onBookNow={onBookNow} />
      </div>
    </section>
  );
};

export default PricingOptions;
