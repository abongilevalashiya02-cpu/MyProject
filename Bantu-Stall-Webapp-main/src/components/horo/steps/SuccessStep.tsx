import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SuccessStepProps {
  onClose: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleExploreMusika = () => {
    onClose();
    navigate('/musika');
  };

  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Your Application!
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Your request to access Horo has been received. Our leadership experience team is reviewing your details and will be in touch via the email you provided within two business days. We're excited about the possibility of crafting a transformative journey for your team.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button 
          onClick={onClose}
          className="bg-bantu-orange hover:bg-bantu-orange/90 text-white px-8 py-3"
        >
          Close
        </Button>
        <Button 
          variant="outline"
          onClick={handleExploreMusika}
          className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white px-8 py-3 flex items-center gap-2"
        >
          Explore Our Experiences on Musika
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};