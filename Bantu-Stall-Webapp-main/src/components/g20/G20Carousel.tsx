
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MapPin, Users, Coins, Calendar, Globe, Mail } from 'lucide-react';

const G20Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

  const slides = [
    {
      id: 1,
      title: "Bantu Stall: The Unofficial Host of G20 Retreats",
      subtitle: "Diplomacy meets African innovation.",
      content: (
        <div className="relative h-96 bg-gradient-to-br from-amber-900 via-green-800 to-amber-800 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute top-8 left-8">
            <img 
              src="/lovable-uploads/7326f10b-d713-4e9f-afb7-4c658dbd997b.png" 
              alt="G20 South Africa 2025" 
              className="h-20 w-auto"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Bantu Stall: The Unofficial Host of G20 Retreats
            </h2>
            <p className="text-xl text-amber-200">
              Diplomacy meets African innovation.
            </p>
          </div>
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Africa's First Bleisure Marketplace",
      subtitle: "Where business meets leisure across the continent",
      content: (
        <div className="relative h-96 bg-gradient-to-br from-green-900 via-amber-800 to-green-800 rounded-xl overflow-hidden p-8">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex flex-col justify-center text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Africa's First Bleisure Marketplace
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Curated Retreats</h3>
                <p className="text-sm text-gray-200">Boutique venues across Africa</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Cultural Immersions</h3>
                <p className="text-sm text-gray-200">Authentic African experiences</p>
              </div>
              <div className="text-center">
                <Globe className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Professional Network</h3>
                <p className="text-sm text-gray-200">Connect across the continent</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "AI-Curated Itineraries in 60 Seconds",
      subtitle: "Musika's smart booking interface",
      content: (
        <div className="relative h-96 bg-gradient-to-br from-amber-900 via-green-700 to-amber-700 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Musika Booking</h3>
                <div className="bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  AI-Powered
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/20 rounded p-3">
                  <p className="text-sm">📍 Cape Town Business Retreat</p>
                  <p className="text-xs text-gray-300">3 days • 12 delegates</p>
                </div>
                <div className="bg-white/20 rounded p-3">
                  <p className="text-sm">🦁 Kruger Safari Experience</p>
                  <p className="text-xs text-gray-300">2 days • Wildlife & networking</p>
                </div>
                <div className="bg-white/20 rounded p-3">
                  <p className="text-sm">🍷 Stellenbosch Wine Tasting</p>
                  <p className="text-xs text-gray-300">1 day • Cultural immersion</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold mb-2">AI-Curated Itineraries</h2>
              <p className="text-amber-200">Personalized in 60 seconds</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Proven Track Record",
      subtitle: "Already hosting retreats across Southern Africa",
      content: (
        <div className="relative h-96 bg-gradient-to-br from-green-900 via-amber-800 to-green-700 rounded-xl overflow-hidden p-8">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex flex-col justify-center text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Proven Track Record</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">15+</div>
                <p className="text-lg">TEDx Events Hosted</p>
                <p className="text-sm text-gray-300">South Africa, Botswana, Zimbabwe</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">50+</div>
                <p className="text-lg">Corporate Retreats</p>
                <p className="text-sm text-gray-300">Boutique venues partnered</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">100+</div>
                <p className="text-lg">Business Leaders</p>
                <p className="text-sm text-gray-300">In our network</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">G20</div>
                <p className="text-lg">Summit Connections</p>
                <p className="text-sm text-gray-300">Warm leads established</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Culture Tokens: Earn. Redeem. Elevate.",
      subtitle: "Supporting African-owned businesses",
      content: (
        <div className="relative h-96 bg-gradient-to-br from-amber-900 via-green-800 to-amber-700 rounded-xl overflow-hidden p-8">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-white">
            <div className="text-center max-w-lg">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-500 rounded-full p-3">
                    <Coins className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-4xl">→</div>
                  <div className="bg-green-600 rounded-full p-3">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl">→</div>
                  <div className="bg-amber-600 rounded-full p-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Culture Tokens</h2>
              <p className="text-xl text-amber-200 mb-6">Earn. Redeem. Elevate communities.</p>
              <p className="text-lg">
                Every booking supports African-owned businesses. 
                Earn tokens, redeem rewards, elevate local communities.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Let's Connect",
      subtitle: "Turn G20 sidelines into African highlights",
      content: (
        <div className="relative h-96 bg-gradient-to-br from-green-900 via-black to-amber-900 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
            <div className="flex items-center justify-center mb-8 space-x-8">
              <img 
                src="/lovable-uploads/7326f10b-d713-4e9f-afb7-4c658dbd997b.png" 
                alt="G20 South Africa 2025" 
                className="h-16 w-auto"
              />
              <img 
                src="/lovable-uploads/0ae53338-b717-415a-a240-61d922a6860f.png" 
                alt="Bantu Stall Logo" 
                className="h-12 w-auto"
              />
            </div>
            <blockquote className="text-center mb-8">
              <p className="text-2xl font-bold mb-4">
                "Agendas are negotiated. Connections are curated."
              </p>
              <p className="text-xl text-amber-200">
                Let's turn your G20 sidelines into African highlights.
              </p>
            </blockquote>
            <div className="flex flex-col items-center space-y-4">
              <Button 
                className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-8 py-3 text-lg"
                onClick={() => window.location.href = 'mailto:kuda@bantustall.com'}
              >
                <Mail className="h-5 w-5 mr-2" />
                kuda@bantustall.com
              </Button>
              <p className="text-sm text-gray-300">Ready to elevate your G20 experience?</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-0">
                  {slide.content}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 border-white/30 hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 border-white/30 hover:bg-white/30" />
      </Carousel>
      
      {/* Slide indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-amber-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default G20Carousel;
