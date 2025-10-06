
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import WaitlistFormContent from './WaitlistFormContent';

interface WaitlistFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const WaitlistFormDialog: React.FC<WaitlistFormDialogProps> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full px-4 py-3 bg-bantu-yellow text-black font-medium rounded-md hover:bg-bantu-yellow/90 transition-colors">
          Discover Rare Growth Opportunities
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Join Our Waitlist</DialogTitle>
          <DialogDescription>
            Be the first to know when we launch. We'll keep you updated on our progress.
          </DialogDescription>
        </DialogHeader>
        
        <WaitlistFormContent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistFormDialog;
