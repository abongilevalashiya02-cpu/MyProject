
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const CultureTokensHero: React.FC = () => {
  const [visibleStamp, setVisibleStamp] = useState(0);

  const stamps = [
    { src: '/lovable-uploads/f65274b1-f88d-4a73-ad04-b78c9dc15647.png', alt: 'Akan Duafe Stamp' },
    { src: '/lovable-uploads/ad4ad31f-98bb-4df8-bcc9-b987312cfab9.png', alt: 'Maasai Shield Stamp' },
    { src: '/lovable-uploads/413f808f-8f03-4a44-bb12-735b1c766c4e.png', alt: 'Tuareg Star Stamp' },
    { src: '/lovable-uploads/b17c9f4a-6992-47a3-b7bc-b96c33c73ab7.png', alt: 'Ndebele Home Stamp' }
  ];

  // Cycle through stamps every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleStamp((prev) => (prev + 1) % stamps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stamps.length]);

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Image with Overlay - Updated with African landscape */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/680ccefa-ea2f-42c0-b7fe-e8c19ad8858d.png" 
          alt="Breathtaking African landscape with dramatic cliffs and waterfalls" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-0"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
        {/* Animated Stamps - Enhanced animation */}
        <div className="relative mb-8 h-32 w-32 flex items-center justify-center animate-slide-down opacity-0" style={{ animationDelay: '0.2s' }}>
          {stamps.map((stamp, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                visibleStamp === index 
                  ? 'opacity-100 scale-110 transform rotate-0 z-10' 
                  : 'opacity-0 scale-50 transform -rotate-12 z-0'
              }`}
              style={{
                animation: visibleStamp === index ? 'pop-in 0.5s ease-out' : 'pop-out 0.3s ease-in'
              }}
            >
              <img 
                src={stamp.src} 
                alt={stamp.alt}
                className="w-28 h-28 drop-shadow-2xl filter brightness-110"
              />
            </div>
          ))}
        </div>

        {/* Enhanced Tagline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl animate-slide-down opacity-0" style={{ animationDelay: '0.4s' }}>
          <span className="title-gradient">Earn Stamps</span> for engaging African Culture and Local establishments
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl animate-slide-down opacity-0" style={{ animationDelay: '0.6s' }}>
          Discover the richness of African heritage while supporting local artisans, chefs, and cultural ambassadors. Every engagement earns you stamps that unlock authentic experiences across the continent.
        </p>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-slide-down"></div>
        </div>
      </div>
    </section>
  );
};

export default CultureTokensHero;
