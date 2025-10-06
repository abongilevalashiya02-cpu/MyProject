import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import Index from '@/pages/Index';

/**
 * Enterprise-grade landing page guard that prevents authenticated users 
 * from seeing the landing page and intelligently redirects them
 */
export const LandingPageGuard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (user) {
      setIsRedirecting(true);
      
      // Smart redirect based on user metadata
      const userMetadata = user.user_metadata || {};
      let destination = '/dashboard';

      // Intelligent routing based on user state
      if (userMetadata.default_dashboard) {
        destination = `/dashboard?section=${userMetadata.default_dashboard}`;
      } else if (userMetadata.user_type) {
        // Map user types to appropriate dashboard sections
        const sectionMap: Record<string, string> = {
          'corporate': 'retreat-planning',
          'traveler': 'explorer', 
          'service_provider': 'provider-dashboard',
          'admin': 'admin-panel'
        };
        const section = sectionMap[userMetadata.user_type];
        if (section) {
          destination = `/dashboard?section=${section}`;
        }
      }

      // Redirect with replace to prevent back navigation to landing page
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth or redirecting
  if (loading || (user && isRedirecting)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bantu-orange/5 to-bantu-yellow/10">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-bantu-orange" />
          <p className="text-gray-600 text-lg">
            {isRedirecting ? 'Redirecting to your dashboard...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Only show landing page if user is not authenticated
  if (!user) {
    return <Index />;
  }

  return null;
};

export default LandingPageGuard;