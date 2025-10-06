
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const SuccessPage: React.FC = () => {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        Thank you for building your dream!
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Your Golden Ticket application has been submitted successfully. We'll review it and get back to you within 2-3 business days.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button 
          variant="outline" 
          className="border-bantu-orange text-bantu-orange hover:bg-bantu-orange/10"
          onClick={() => window.location.href = '/'}
        >
          Explore Bantu Stall
        </Button>
        <Button 
          className="bg-bantu-orange hover:bg-bantu-orange/90 text-white"
          onClick={() => window.open('https://www.linkedin.com/company/bantu-stall', '_blank')}
        >
          Follow us on LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
