
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

interface WelcomePageProps {
  onNext: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="mx-auto w-24 h-24 rounded-full bg-bantu-yellow/20 flex items-center justify-center mb-6">
        <Map className="w-12 h-12 text-bantu-orange" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Design Your Dream Leadership or Team-Building Adventure
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Earn a Golden Ticket — a chance to speak on global stages in South Africa.
      </p>
      <div className="pt-4">
        <Button 
          onClick={onNext}
          className="bg-bantu-orange hover:bg-bantu-orange/90 text-white px-8 py-3 rounded-2xl text-lg"
        >
          Start Building
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
