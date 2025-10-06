import { AuthError } from '@supabase/supabase-js';
import { authLogger } from '@/utils/logger';

export interface ErrorContext {
  operation: 'login' | 'signup' | 'resetPassword' | 'updateProfile';
  email?: string;
  provider?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface ProcessedError {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
  actionText?: string;
  actionCallback?: () => void;
  isRetryable: boolean;
  category: 'validation' | 'network' | 'auth' | 'server' | 'rate_limit' | 'unknown';
}

export class AuthErrorHandler {
  static processError(
    error: Error | AuthError | unknown,
    context: ErrorContext,
    onSwitchToLogin?: () => void,
    onSwitchToSignup?: () => void
  ): ProcessedError {
    const errorMessage = this.extractErrorMessage(error);
    const errorCategory = this.categorizeError(errorMessage, error);
    
    authLogger.error('Processing auth error', {
      message: errorMessage,
      category: errorCategory,
      context,
      error
    });

    return this.createProcessedError(errorMessage, errorCategory, context, onSwitchToLogin, onSwitchToSignup);
  }

  private static extractErrorMessage(error: Error | AuthError | unknown): string {
    if (!error) return 'Unknown error occurred';
    
    if (typeof error === 'string') return error;
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'object' && error !== null) {
      const anyError = error as any;
      return anyError.message || anyError.error_description || anyError.description || 'Unknown error';
    }
    
    return 'Unknown error occurred';
  }

  private static categorizeError(errorMessage: string, error: unknown): ProcessedError['category'] {
    const lowerMessage = errorMessage.toLowerCase();
    
    // Validation errors
    if (
      lowerMessage.includes('required') ||
      lowerMessage.includes('invalid email') ||
      lowerMessage.includes('password') && (lowerMessage.includes('weak') || lowerMessage.includes('short')) ||
      lowerMessage.includes('valid email')
    ) {
      return 'validation';
    }
    
    // Network errors
    if (
      lowerMessage.includes('network') ||
      lowerMessage.includes('connection') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('offline') ||
      (error as any)?.status >= 500
    ) {
      return 'network';
    }
    
    // Rate limiting
    if (
      lowerMessage.includes('rate limit') ||
      lowerMessage.includes('too many') ||
      lowerMessage.includes('wait') && lowerMessage.includes('minute')
    ) {
      return 'rate_limit';
    }
    
    // Authentication specific errors
    if (
      lowerMessage.includes('invalid credentials') ||
      lowerMessage.includes('invalid login') ||
      lowerMessage.includes('unauthorized') ||
      lowerMessage.includes('not found') ||
      lowerMessage.includes('already exists') ||
      lowerMessage.includes('already registered') ||
      lowerMessage.includes('email not confirmed') ||
      lowerMessage.includes('confirmation')
    ) {
      return 'auth';
    }
    
    // Server errors
    if (
      lowerMessage.includes('server') ||
      lowerMessage.includes('internal') ||
      (error as any)?.status === 500
    ) {
      return 'server';
    }
    
    return 'unknown';
  }

  private static createProcessedError(
    errorMessage: string,
    category: ProcessedError['category'],
    context: ErrorContext,
    onSwitchToLogin?: () => void,
    onSwitchToSignup?: () => void
  ): ProcessedError {
    const lowerMessage = errorMessage.toLowerCase();
    
    switch (category) {
      case 'validation':
        return {
          title: 'Validation Error',
          description: errorMessage,
          variant: 'destructive',
          isRetryable: false,
          category
        };
        
      case 'network':
        return {
          title: 'Connection Issue',
          description: 'Please check your internet connection and try again. If the problem persists, our servers might be temporarily unavailable.',
          variant: 'destructive',
          actionText: 'Retry',
          isRetryable: true,
          category
        };
        
      case 'rate_limit':
        return {
          title: 'Too Many Attempts',
          description: 'You\'ve made too many attempts. Please wait a few minutes before trying again.',
          variant: 'destructive',
          isRetryable: false,
          category
        };
        
      case 'auth':
        if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('invalid login')) {
          return {
            title: context.operation === 'login' ? 'Login Failed' : 'Authentication Failed',
            description: 'Invalid email or password. Please check your credentials and try again.',
            variant: 'destructive',
            actionText: context.operation === 'login' && onSwitchToSignup ? 'Sign up instead' : undefined,
            actionCallback: onSwitchToSignup,
            isRetryable: true,
            category
          };
        }
        
        if (lowerMessage.includes('already exists') || lowerMessage.includes('already registered')) {
          return {
            title: 'Account Already Exists',
            description: 'An account with this email already exists. Please sign in instead.',
            variant: 'destructive',
            actionText: onSwitchToLogin ? 'Sign in instead' : undefined,
            actionCallback: onSwitchToLogin,
            isRetryable: false,
            category
          };
        }
        
        if (lowerMessage.includes('email not confirmed') || lowerMessage.includes('confirmation')) {
          return {
            title: 'Email Not Confirmed',
            description: 'Please check your email and click the confirmation link before signing in.',
            variant: 'destructive',
            isRetryable: false,
            category
          };
        }
        
        return {
          title: 'Authentication Error',
          description: errorMessage,
          variant: 'destructive',
          isRetryable: false,
          category
        };
        
      case 'server':
        return {
          title: 'Server Error',
          description: 'Our servers are experiencing issues. Please try again in a few minutes.',
          variant: 'destructive',
          actionText: 'Retry',
          isRetryable: true,
          category
        };
        
      default:
        return {
          title: context.operation === 'login' ? 'Login Failed' : 
                 context.operation === 'signup' ? 'Registration Failed' :
                 'Operation Failed',
          description: errorMessage || 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
          actionText: 'Retry',
          isRetryable: true,
          category: 'unknown'
        };
    }
  }

  static shouldShowRetryButton(error: ProcessedError): boolean {
    return error.isRetryable && !['validation', 'rate_limit'].includes(error.category);
  }

  static getRetryDelay(error: ProcessedError): number {
    switch (error.category) {
      case 'network':
        return 2000; // 2 seconds for network issues
      case 'server':
        return 5000; // 5 seconds for server issues
      case 'rate_limit':
        return 60000; // 1 minute for rate limiting
      default:
        return 1000; // 1 second default
    }
  }

  static logError(error: unknown, context: ErrorContext): void {
    authLogger.error(`Auth ${context.operation} failed`, {
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: context.timestamp
    });
  }
}