
import React from 'react';
import { MapPin, Star } from 'lucide-react';

interface TEDxPackageIntroProps {
  ratingsString: string;
}

const TEDxPackageIntro: React.FC<TEDxPackageIntroProps> = ({ ratingsString }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">TEDxGraystonDrive 2025 Speaker Experience</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium">Package Rating:</p>
        <p className="text-gray-700">{ratingsString}</p>
      </div>
      
      <p className="text-lg mb-6">
        Step onto the TEDx stage and amplify your voice at TEDxGraystonDrive 2025. This exclusive 6-day 
        speaker experience is designed for thought leaders, change-makers, and storytellers ready to 
        share ideas that shape the future. From immersive cultural experiences to expert-led speaker 
        workshops, this journey is more than just a talk—it's a transformational experience in the heart 
        of Africa's financial capital.
      </p>
      
      <div className="mb-8 flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex items-center text-bantu-orange">
          <MapPin className="h-6 w-6 mr-2" />
          <span className="font-medium">Sandton, Johannesburg</span>
        </div>
        <div className="flex items-center text-bantu-orange">
          <Star className="h-6 w-6 mr-2" />
          <span className="font-medium">"Investing in Africa's Future"</span>
        </div>
      </div>
    </div>
  );
};

export default TEDxPackageIntro;
