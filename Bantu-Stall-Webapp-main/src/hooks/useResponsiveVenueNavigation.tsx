import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from './use-mobile';
import { VenueType } from '@/types/venues';

interface UseResponsiveVenueNavigationProps {
  onVenueModal?: (venue: VenueType) => void;
}

export const useResponsiveVenueNavigation = ({ 
  onVenueModal 
}: UseResponsiveVenueNavigationProps = {}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleVenueClick = useCallback((
    event: React.MouseEvent,
    venue: VenueType
  ) => {
    event.preventDefault();
    
    if (isMobile) {
      // Mobile: Show modal
      onVenueModal?.(venue);
    } else {
      // Desktop/Tablet: Open in new tab
      const venueUrl = `/venue/${venue.id}`;
      window.open(venueUrl, '_blank', 'noopener,noreferrer');
    }
  }, [isMobile, onVenueModal]);

  const createVenueLink = useCallback((venueId: string) => {
    return `/venue/${venueId}`;
  }, []);

  return {
    handleVenueClick,
    createVenueLink,
    isMobile
  };
};

export default useResponsiveVenueNavigation;