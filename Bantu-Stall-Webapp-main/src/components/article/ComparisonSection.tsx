import React from 'react';

const ComparisonSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 mb-16 md:mb-24">
      <h2 className="text-3xl md:text-4xl font-bold text-bantu-yellow mb-8 md:mb-12 text-center">
        The Old Way vs. The New Way
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-6">
          <div className="text-xl md:text-2xl font-semibold text-red-400 mb-4">The Old Way</div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-red-400 text-xl">✗</span>
              <span className="text-gray-300">Generic conference venues in oversaturated markets</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-400 text-xl">✗</span>
              <span className="text-gray-300">Extractive tourism with minimal local benefit</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-400 text-xl">✗</span>
              <span className="text-gray-300">Standard team-building activities with predictable outcomes</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-400 text-xl">✗</span>
              <span className="text-gray-300">High costs with limited cultural or social impact</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="text-xl md:text-2xl font-semibold text-bantu-yellow mb-4">The New Way</div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-bantu-yellow text-xl">✓</span>
              <span className="text-gray-300">Purposeful venues that tell Africa's innovation story</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-bantu-yellow text-xl">✓</span>
              <span className="text-gray-300">Regenerative travel model supporting local communities</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-bantu-yellow text-xl">✓</span>
              <span className="text-gray-300">Transformative experiences building cultural intelligence</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-bantu-yellow text-xl">✓</span>
              <span className="text-gray-300">Exceptional value with measurable ESG impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSection;