import React, { useState, useEffect } from 'react';
import { UnifiedQuotationForm } from './UnifiedQuotationForm';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Users, Clock, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const GUEST_QUOTATION_KEY = 'guest_quotation_used';
const GUEST_QUOTATION_DATA_KEY = 'guest_quotation_data';

interface GuestQuotationWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'navbar' | 'dashboard' | 'standalone';
}

export const GuestQuotationWrapper: React.FC<GuestQuotationWrapperProps> = ({
  isOpen,
  onClose,
  mode = 'standalone'
}) => {
  const { user } = useAuth();
  const [hasUsedGuestQuotation, setHasUsedGuestQuotation] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    // Check if user has already used their free guest quotation
    const guestUsed = localStorage.getItem(GUEST_QUOTATION_KEY);
    setHasUsedGuestQuotation(!!guestUsed);
  }, []);

  // If user is authenticated, they shouldn't see guest form - redirect happens at route level
  if (user) {
    return null;
  }

  // If guest has already used their free quotation, show auth prompt
  if (hasUsedGuestQuotation || showAuthPrompt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You've used your complimentary guest quotation. Sign in to continue getting quotes and track all your requests in one place.
            </p>
            
            <div className="space-y-3 py-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Unlimited quotation requests</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Track all your retreat planning</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Priority customer support</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => window.location.href = `/login?redirect=${encodeURIComponent('/quotations/dashboard')}`}
                className="w-full"
              >
                Sign In to Continue
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Maybe Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show guest quotation form with one-time usage notice
  return (
    <div className="relative">
      {isOpen && (
        <div className="mb-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                <strong>Free Guest Quote:</strong> This is your complimentary quotation request. 
                Sign in afterward for unlimited access.
              </span>
              <Badge variant="secondary" className="ml-2">
                1 Free Use
              </Badge>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <GuestUnifiedQuotationForm
        isOpen={isOpen}
        onClose={onClose}
        mode={mode}
        onGuestQuotationUsed={() => {
          localStorage.setItem(GUEST_QUOTATION_KEY, 'true');
          setHasUsedGuestQuotation(true);
          setShowAuthPrompt(true);
        }}
      />
    </div>
  );
};

// Guest version of the quotation form that tracks usage
interface GuestUnifiedQuotationFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'navbar' | 'dashboard' | 'standalone';
  onGuestQuotationUsed: () => void;
}

const GuestUnifiedQuotationForm: React.FC<GuestUnifiedQuotationFormProps> = ({
  isOpen,
  onClose,
  mode,
  onGuestQuotationUsed
}) => {
  const handleGuestSubmit = async (formData: any) => {
    // Save guest quotation data for later use after authentication
    localStorage.setItem(GUEST_QUOTATION_DATA_KEY, JSON.stringify({
      ...formData,
      isGuest: true,
      submittedAt: new Date().toISOString()
    }));
    
    // Mark guest quotation as used
    onGuestQuotationUsed();
  };

  return (
    <UnifiedQuotationForm
      isOpen={isOpen}
      onClose={onClose}
      mode={mode}
      onGuestSubmit={handleGuestSubmit}
    />
  );
};

export default GuestQuotationWrapper;