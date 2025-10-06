
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  step: number;
  onPrevious: () => void;
  onNext: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ step, onPrevious, onNext }) => {
  return (
    <div className="flex justify-between pt-6">
      <Button 
        type="button" 
        onClick={onPrevious}
        variant="outline"
      >
        Back
      </Button>
      
      <Button 
        type="button" 
        onClick={onNext}
        className="bg-bantu-orange hover:bg-bantu-orange/90 text-white"
      >
        Continue
      </Button>
    </div>
  );
};

export default FormNavigation;
