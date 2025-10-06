
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-bantu-orange text-white"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader className="animate-spin mr-2" size={16} />
          Submitting...
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
};

export default SubmitButton;
