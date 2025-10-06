import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Enhanced SmartRedirect component with security validation and unified dashboard routing
 * Handles post-authentication redirects with intelligent user-specific routing
 */
export const SmartRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSmartRedirect = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get the redirect parameter from URL
        const redirectTo = searchParams.get('redirect');
        
        if (redirectTo) {
          // Validate redirect URL for security (prevent open redirects)
          const allowedPaths = ['/dashboard', '/profile', '/admin', '/quotations', '/onboarding'];
          const decodedPath = decodeURIComponent(redirectTo);
          
          // Check if it's a relative path and starts with allowed paths
          if (decodedPath.startsWith('/') && allowedPaths.some(path => 
            decodedPath.startsWith(path) || decodedPath === path
          )) {
            // Special handling for quotations - redirect to dashboard
            if (decodedPath.includes('quotations')) {
              navigate('/quotations/dashboard', { replace: true });
              return;
            }
            navigate(decodedPath, { replace: true });
            return;
          }
        }

        // Enhanced user metadata handling for smart redirect
        const userMetadata = user.user_metadata || {};
        let destination = '/dashboard';

        // Prioritize user metadata dashboard preferences
        if (userMetadata.default_dashboard) {
          destination = `/dashboard?section=${userMetadata.default_dashboard}`;
        } else if (userMetadata.user_type) {
          // Map user types to appropriate dashboard sections (unified)
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

        navigate(destination, { replace: true });
      } catch (error) {
        console.error('Error in smart redirect:', error);
        // Fallback to default dashboard
        navigate('/dashboard', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    handleSmartRedirect();
  }, [user, navigate, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bantu-orange/5 to-bantu-primary/10">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-bantu-orange" />
          <p className="text-gray-600 text-lg">Taking you to the right place...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default SmartRedirect;