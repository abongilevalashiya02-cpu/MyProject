import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Component that redirects authenticated users from public quotation page
 * to the authenticated quotation dashboard
 */
export const AuthenticatedQuotationRedirect = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return null;
  }

  // If user is authenticated, redirect to quotations dashboard
  if (user) {
    return <Navigate to="/quotations/dashboard" replace />;
  }

  return null;
};

export default AuthenticatedQuotationRedirect;