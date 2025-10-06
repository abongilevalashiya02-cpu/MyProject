import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin, Shield, Clock } from 'lucide-react';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { toast } from 'sonner';

interface ProtectedQuotationRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  preserveFormState?: boolean;
  redirectAfterAuth?: string;
}

/**
 * Protected route component specifically for quotation-related routes
 * Handles authentication, form state preservation, and graceful redirects
 */
export const ProtectedQuotationRoute: React.FC<ProtectedQuotationRouteProps> = ({
  children,
  requireAuth = true,
  preserveFormState = true,
  redirectAfterAuth
}) => {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Store the intended destination for post-auth redirect
  useEffect(() => {
    if (!user && !loading && requireAuth) {
      sessionStorage.setItem('quotation_redirect_after_auth', redirectAfterAuth || location.pathname);
    }
  }, [user, loading, requireAuth, redirectAfterAuth, location.pathname]);

  // Handle successful authentication
  useEffect(() => {
    if (user && requireAuth) {
      const redirectPath = sessionStorage.getItem('quotation_redirect_after_auth');
      if (redirectPath && redirectPath !== location.pathname) {
        sessionStorage.removeItem('quotation_redirect_after_auth');
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, navigate, location.pathname, requireAuth]);

  const handleLinkedInSignIn = async () => {
    setIsSigningIn(true);
    try {
      const { error } = await signIn('linkedin_oidc', '');
      
      if (error) {
        console.error("LinkedIn login error:", error);
        toast.error('LinkedIn login failed. Please try again.');
      } else {
        toast.success('Successfully signed in! Redirecting...');
      }
    } catch (error: unknown) {
      console.error("LinkedIn login error:", error);
      toast.error('LinkedIn login failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Show authentication required screen
  if (!user && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to access quotation management and continue with your request
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {preserveFormState && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Your form data will be preserved after signing in</span>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleLinkedInSignIn}
              disabled={isSigningIn}
              className="w-full bg-[#0077B5] hover:bg-[#0077B5]/90 text-white"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              {isSigningIn ? 'Signing in...' : 'Sign in with LinkedIn'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Secure authentication powered by LinkedIn
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if authenticated or auth not required
  return <>{children}</>;
};