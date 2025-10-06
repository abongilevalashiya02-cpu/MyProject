
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Target, Users } from 'lucide-react';

const HRGuideHero = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-bantu-orange to-bantu-yellow relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            Strategic HR Guide
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering HR Managers
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            A Strategic Guide to Seamless Corporate Retreats & Budgeting with Bantu Stall
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span>Strategic Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span>Budget Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Team Building</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HRGuideHero;
