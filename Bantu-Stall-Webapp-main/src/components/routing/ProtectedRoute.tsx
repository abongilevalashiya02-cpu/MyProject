import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalStore } from '@/stores/globalStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredStatus?: string;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredStatus,
  redirectTo = '/login',
  fallback
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { setCurrentPage, setBreadcrumbs } = useGlobalStore();

  useEffect(() => {
    // Update current page in global state
    setCurrentPage(location.pathname);
    
    // Generate breadcrumbs based on current path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + pathSegments.slice(0, index + 1).join('/')
    }));
    
    setBreadcrumbs([{ label: 'Home', href: '/' }, ...breadcrumbs]);
  }, [location.pathname, setCurrentPage, setBreadcrumbs]);

  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-bantu-orange" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Store the intended destination for post-login redirect
    const intendedDestination = location.pathname + location.search;

    return (
      <Navigate 
        to={`${redirectTo}?redirect=${encodeURIComponent(intendedDestination)}`} 
        replace 
        state={{ from: location, reason: 'authentication_required' }}
      />
    );
  }

  // Check if user status matches required status (for onboarding flow)
  if (requiredStatus && user.user_metadata?.onboarding_status !== requiredStatus) {
    return <Navigate to={redirectTo} replace />;
  }

  // TODO: Add role-based access control when roles are implemented
  if (requiredRole) {
    // Placeholder for role checking logic - will be implemented when roles are added
  }

  return <>{children}</>;
};

// Smart redirect component that handles post-login navigation
export const SmartRedirect: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect');
  
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Default redirect based on user context could go here
  return <Navigate to="/dashboard" replace />;
};
