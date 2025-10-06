import React from 'react';
import { QuotationFormWrapper } from '@/components/quotation/QuotationFormWrapper';
import { VenueType } from '../../types/venues';

interface QuotationFormProps {
  venue: VenueType | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuotationForm = ({ venue, isOpen, onClose }: QuotationFormProps) => {
  return (
    <QuotationFormWrapper
      venue={venue}
      isOpen={isOpen}
      onClose={onClose}
      mode="navbar"
      initialType="standard"
    />
  );
};

export default QuotationForm;
