import React from 'react';

const PerceptionTransform: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-bantu-yellow/10 to-transparent rounded-2xl p-8 md:p-12 mb-16 md:mb-24">
      <h2 className="text-3xl md:text-4xl font-bold text-bantu-yellow mb-8 md:mb-12 text-center">
        Transforming Perceptions
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-6">
          <div className="text-xl md:text-2xl font-semibold text-red-400 mb-6">Common Misconceptions</div>
          <div className="space-y-4">
            <div className="bg-red-950/30 rounded-lg p-4 border border-red-400/20">
              <div className="font-semibold text-white mb-2">"Infrastructure concerns"</div>
              <div className="text-bantu-orange text-sm">Outdated assumptions about African business facilities</div>
            </div>
            <div className="bg-red-950/30 rounded-lg p-4 border border-red-400/20">
              <div className="font-semibold text-white mb-2">"Safety and security"</div>
              <div className="text-bantu-orange text-sm">Misperceptions about business travel safety</div>
            </div>
            <div className="bg-red-950/30 rounded-lg p-4 border border-red-400/20">
              <div className="font-semibold text-white mb-2">"Limited business value"</div>
              <div className="text-bantu-orange text-sm">Underestimating Africa's strategic business importance</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="text-xl md:text-2xl font-semibold text-bantu-yellow mb-6">Reality & Opportunity</div>
          <div className="space-y-4">
            <div className="bg-bantu-yellow/10 rounded-lg p-4 border border-bantu-yellow/20">
              <div className="font-semibold text-bantu-yellow mb-2">World-class MICE facilities</div>
              <div className="text-black text-sm">Award-winning venues meeting international standards</div>
            </div>
            <div className="bg-bantu-yellow/10 rounded-lg p-4 border border-bantu-yellow/20">
              <div className="font-semibold text-bantu-yellow mb-2">Robust security protocols</div>
              <div className="text-black text-sm">Comprehensive safety measures for corporate travelers</div>
            </div>
            <div className="bg-bantu-yellow/10 rounded-lg p-4 border border-bantu-yellow/20">
              <div className="font-semibold text-bantu-yellow mb-2">Strategic market positioning</div>
              <div className="text-black text-sm">Gateway to the world's fastest-growing consumer markets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerceptionTransform;