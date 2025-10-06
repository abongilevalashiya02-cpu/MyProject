
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PropertyListingForm from './PropertyListingForm';

interface PropertyListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyListingModal: React.FC<PropertyListingModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List Your Property</DialogTitle>
        </DialogHeader>
        <PropertyListingForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default PropertyListingModal;
