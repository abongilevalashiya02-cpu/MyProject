import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

interface DashboardNavigationProps {
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  showBackButton = true,
  showHomeButton = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex gap-2 mb-4">
      {showBackButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      
      {showHomeButton && location.pathname !== '/dashboard' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          <Home className="w-4 h-4 mr-2" />
          Main Dashboard
        </Button>
      )}
    </div>
  );
};
