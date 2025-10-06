
import React from 'react';
import G20Carousel from '@/components/g20/G20Carousel';

const G20Showcase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-amber-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            G20 Delegate Showcase
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover how Bantu Stall can transform your G20 experience with curated African retreats and cultural immersions.
          </p>
        </div>
        
        <G20Carousel />
        
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Explore?
            </h3>
            <p className="text-gray-700 mb-6">
              Join Africa's leading business travelers in experiencing authentic cultural retreats 
              that combine diplomacy with innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = 'mailto:kuda@bantustall.com'}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Schedule a Call
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Explore Bantu Stall
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default G20Showcase;
