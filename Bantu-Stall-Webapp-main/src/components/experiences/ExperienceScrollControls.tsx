
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExperienceScrollControlsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const ExperienceScrollControls = ({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight
}: ExperienceScrollControlsProps) => {
  return (
    <div className="hidden md:flex space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onScrollLeft} 
        disabled={!canScrollLeft}
        className={cn(
          "rounded-full transition-all duration-200",
          !canScrollLeft && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onScrollRight} 
        disabled={!canScrollRight}
        className={cn(
          "rounded-full transition-all duration-200",
          !canScrollRight && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ExperienceScrollControls;
