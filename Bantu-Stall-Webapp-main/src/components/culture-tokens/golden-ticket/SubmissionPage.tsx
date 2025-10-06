
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmissionPageProps {
  isSubmitting: boolean;
  onSubmit: () => void;
}

const SubmissionPage: React.FC<SubmissionPageProps> = ({ isSubmitting, onSubmit }) => {
  return (
    <div className="text-center space-y-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900">Ready to Submit Your Dream Excursion</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Review your information and claim your Golden Ticket for a chance to speak on global stages in South Africa.
      </p>
      <div className="pt-4">
        <Button 
          onClick={onSubmit}
          className="bg-bantu-orange hover:bg-bantu-orange/90 text-white px-8 py-3 rounded-2xl text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit My Dream Excursion & Claim Golden Ticket"}
        </Button>
      </div>
    </div>
  );
};

export default SubmissionPage;
