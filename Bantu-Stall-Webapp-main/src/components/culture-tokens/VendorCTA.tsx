
import React from 'react';
import { Check, Shield, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const trustBadges = [
  {
    icon: <Shield className="h-5 w-5" />,
    text: "Verified by Bantu Stall"
  },
  {
    icon: <Globe className="h-5 w-5" />,
    text: "Global Visibility"
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    text: "Secure Redemptions"
  }
];

const VendorCTA: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-bantu-orange to-bantu-yellow text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Are you an African-owned business? Join the Culture Token movement.
          </h2>
          
          <p className="text-lg mb-8 text-white/90">
            Connect with travelers, expand your reach, and be part of a global network of African businesses.
          </p>
          
          <Button className="bg-white text-bantu-orange hover:bg-white/90 hover:text-bantu-orange font-bold px-8 py-3 rounded-2xl shadow-lg">
            Apply to Accept Tokens
          </Button>
          
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                {badge.icon}
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;
