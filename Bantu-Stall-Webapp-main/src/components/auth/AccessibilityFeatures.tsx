import React from 'react';
import { AlertTriangle, Eye, EyeOff, Info, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Screen reader announcements for auth states
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Password visibility toggle with accessibility
interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const AccessiblePasswordToggle: React.FC<PasswordToggleProps> = ({ 
  showPassword, 
  onToggle, 
  disabled = false 
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm disabled:opacity-50"
    aria-label={showPassword ? 'Hide password' : 'Show password'}
    aria-pressed={showPassword}
    tabIndex={0}
  >
    {showPassword ? (
      <EyeOff className="h-5 w-5" aria-hidden="true" />
    ) : (
      <Eye className="h-5 w-5" aria-hidden="true" />
    )}
  </button>
);

// Form validation status announcer
interface ValidationStatusProps {
  isValid: boolean;
  errors: string[];
  isLoading?: boolean;
}

export const ValidationStatusAnnouncer: React.FC<ValidationStatusProps> = ({ 
  isValid, 
  errors, 
  isLoading = false 
}) => {
  React.useEffect(() => {
    if (errors.length > 0) {
      announceToScreenReader(`Form has ${errors.length} validation error${errors.length > 1 ? 's' : ''}`);
    } else if (isValid && !isLoading) {
      announceToScreenReader('Form is valid and ready for submission');
    }
  }, [isValid, errors, isLoading]);

  return null;
};

// Loading state announcer
interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingText: string;
  completedText?: string;
}

export const LoadingStateAnnouncer: React.FC<LoadingAnnouncerProps> = ({ 
  isLoading, 
  loadingText, 
  completedText 
}) => {
  React.useEffect(() => {
    if (isLoading) {
      announceToScreenReader(loadingText);
    } else if (completedText) {
      announceToScreenReader(completedText);
    }
  }, [isLoading, loadingText, completedText]);

  return null;
};

// Error boundary for auth forms
interface AuthErrorDisplayProps {
  error: string | null;
  type: 'error' | 'warning' | 'info' | 'success';
  onDismiss?: () => void;
}

export const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({ 
  error, 
  type, 
  onDismiss 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    return type === 'error' ? 'destructive' : 'default';
  };

  React.useEffect(() => {
    if (error) {
      announceToScreenReader(`${type}: ${error}`);
    }
  }, [error, type]);

  if (!error) return null;

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertDescription className="flex justify-between items-start">
        <span>{error}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

// Focus management for form steps
export const focusFirstError = (formId: string): void => {
  setTimeout(() => {
    const form = document.getElementById(formId);
    if (form) {
      const firstError = form.querySelector('[aria-invalid="true"], [data-state="error"]') as HTMLElement;
      if (firstError) {
        firstError.focus();
        announceToScreenReader('Please correct the highlighted field');
      }
    }
  }, 100);
};

// Skip link for accessibility
export const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
  >
    Skip to main content
  </a>
);

// ARIA live region for dynamic updates
export const LiveRegion: React.FC<{ children: React.ReactNode; priority?: 'polite' | 'assertive' }> = ({ 
  children, 
  priority = 'polite' 
}) => (
  <div
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {children}
  </div>
);

export default {
  announceToScreenReader,
  AccessiblePasswordToggle,
  ValidationStatusAnnouncer,
  LoadingStateAnnouncer,
  AuthErrorDisplay,
  focusFirstError,
  SkipToContent,
  LiveRegion
};