import React from 'react';
import { UnifiedQuotationForm } from './UnifiedQuotationForm';
import { VenueType } from '@/types/venues';

interface QuotationFormWrapperProps {
  venue?: VenueType;
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'standard' | 'group' | 'custom';
  mode?: 'navbar' | 'dashboard' | 'standalone';
}

/**
 * Wrapper component that provides the unified quotation form experience
 * for both pre-login and post-login users. This ensures consistency
 * across all quotation entry points in the application.
 */
export const QuotationFormWrapper: React.FC<QuotationFormWrapperProps> = (props) => {
  return <UnifiedQuotationForm {...props} />;
};

// For backward compatibility, export as default
export default QuotationFormWrapper;