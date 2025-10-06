
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from "@/components/ui/dialog";
import GoldenTicketForm from '../culture-tokens/GoldenTicketForm';

interface GoldenTicketButtonProps {
  isScrolled: boolean;
  className?: string;
}

const GoldenTicketButton: React.FC<GoldenTicketButtonProps> = ({ 
  isScrolled,
  className 
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className={cn(
            "transition-all duration-300 rounded-2xl",
            isScrolled 
              ? "bg-bantu-yellow text-black hover:bg-bantu-yellow/90" 
              : "bg-bantu-yellow text-black hover:bg-bantu-yellow/90",
            className
          )}
        >
          <Star className="mr-2 h-4 w-4" />
          Free Golden Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <GoldenTicketForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoldenTicketButton;
