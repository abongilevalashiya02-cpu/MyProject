import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { SupabaseClient, User, Session, AuthError } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { authLogger } from '@/utils/logger';

interface AuthResponse {
  error: AuthError | Error | null;
  data: unknown | null;
}

interface EmailResponse {
  success: boolean;
  data: unknown;
  error: unknown;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  supabase: SupabaseClient;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<AuthResponse>;
  signIn: (provider: 'email' | 'google' | 'linkedin_oidc', credentials: string | { email: string, password: string }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updateProfile: (updates: Record<string, unknown>) => Promise<AuthResponse>;
  sendEmail: (type: 'confirmation' | 'reset', email: string, data: { confirmationUrl?: string, resetUrl?: string }) => Promise<EmailResponse>;
  testEmailSending: (testEmail: string) => Promise<EmailResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState<SupabaseClient>(supabaseClient);

  useEffect(() => {
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;

    const initializeAuth = async () => {
      authLogger.debug('Initializing authentication');
      
      try {
        // Set up auth state listener FIRST
        const { data: listener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            authLogger.debug('Auth state changed', { 
              event, 
              hasSession: !!session,
              hasUser: !!session?.user,
              userEmail: session?.user?.email
            });
            
            // Only synchronous state updates here
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            
            if (event === 'SIGNED_IN' && session?.user) {
              const fullName = session.user.user_metadata?.full_name;
              const firstName = fullName ? fullName.split(' ')[0] : null;
              
              // Verify profile exists (should be created automatically by DB trigger)
              setTimeout(() => {
                verifyUserProfile(session.user);
              }, 100);
              
              // Simple console notification for now (can be replaced with toast later)
              console.log(`Welcome back, ${firstName || session.user.email?.split('@')[0] || 'User'}!`);
            }
            
            // Note: Supabase doesn't have a SIGNED_UP event, so we handle welcome emails in signUp function
          }
        );
        
        authListener = listener;

        // THEN check for existing session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          authLogger.error('Error getting session', error);
        } else {
          authLogger.debug('Current session retrieved', {
            hasSession: !!currentSession,
            hasUser: !!currentSession?.user,
            userEmail: currentSession?.user?.email
          });
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
        
      } catch (error) {
        authLogger.error('Error initializing auth', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  // Helper function to verify user profile exists (profiles are now created automatically via DB trigger)
  const verifyUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        authLogger.error('Error checking profile', error);
      } else if (!profile) {
        authLogger.info('Profile not found, should be created by database trigger');
      }
    } catch (error) {
      authLogger.error('Error in verifyUserProfile', error);
    }
  };

  // Helper function to send welcome email
  const sendWelcomeEmail = async (user: User) => {
    try {
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          userType: user.user_metadata?.user_type || 'traveler'
        }
      });
      
      if (error) {
        authLogger.error('Error sending welcome email', error);
      }
    } catch (error) {
      authLogger.error('Error in sendWelcomeEmail', error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthResponse> => {
    authLogger.info('Starting signup process');
    
    // Basic client-side validation
    if (!email?.trim() || !password?.trim()) {
      const error = new Error('Email and password are required') as any;
      authLogger.error('Validation error', error);
      return { error, data: null };
    }
    
    if (!email.includes('@') || email.length < 5) {
      const error = new Error('Please enter a valid email address') as any;
      authLogger.error('Invalid email format', error);
      return { error, data: null };
    }
    
    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters long') as any;
      authLogger.error('Password too short', error);
      return { error, data: null };
    }
    
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get('redirect') || '/';
    const redirectUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;
    
    try {
      const response = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata || {}
        }
      });
      
      authLogger.debug('Signup response received', { 
        hasError: !!response.error,
        hasUser: !!response.data?.user,
        errorMessage: response.error?.message 
      });
      
      if (response.error) {
        const errorMessage = response.error.message;
        let processedError = response.error;
        
        // Add more context to common errors
        if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
          processedError = Object.assign(response.error, { 
            message: 'An account with this email already exists. Please try signing in instead.',
            type: 'user_already_exists'
          });
        } else if (errorMessage.includes('weak password') || errorMessage.includes('password')) {
          processedError = Object.assign(response.error, { 
            message: 'Password does not meet security requirements. Please use at least 8 characters with uppercase, lowercase, and numbers.',
            type: 'weak_password'
          });
        } else if (errorMessage.includes('invalid email') || errorMessage.includes('email')) {
          processedError = Object.assign(response.error, { 
            message: 'Please enter a valid email address.',
            type: 'invalid_email'
          });
        } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
          processedError = Object.assign(response.error, { 
            message: 'Too many signup attempts. Please wait a few minutes before trying again.',
            type: 'rate_limit'
          });
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          processedError = Object.assign(response.error, { 
            message: 'Network connection issue. Please check your internet connection and try again.',
            type: 'network_error'
          });
        }
        
        authLogger.error('Processed signup error', processedError);
        // Fallback: attempt Edge Function signup if network/auth error occurs
        const lower = (errorMessage || '').toLowerCase();
        if (lower.includes('network') || lower.includes('fetch') || lower.includes('timeout')) {
          try {
            const ef = await fetch(`${window.location.origin.replace(/\/$/, '')}/functions/v1/auth-signup`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email.trim().toLowerCase(),
                password,
                metadata: metadata || {},
                redirectUrl,
              }),
            });
            if (ef.ok) {
              const efData = await ef.json();
              return {
                error: null,
                data: {
                  user: null,
                  session: null,
                  needsEmailConfirmation: true,
                  message: 'Account created! Please check your email to confirm your account before signing in.',
                  edgeFunction: true,
                  action_link: efData?.action_link,
                }
              };
            }
          } catch (fallbackErr) {
            authLogger.error('Edge Function signup fallback failed', fallbackErr);
          }
        }
        return { error: processedError, data: response.data };
      }
      
      // If user was created successfully
      if (response.data.user) {
        authLogger.info('User created successfully', {
          needsConfirmation: !response.data.session,
          isAutoConfirmed: !!response.data.session
        });
        
        // Profile will be created automatically by database trigger
        authLogger.debug('Profile creation handled by database trigger');
        
        // Add email confirmation status to response for better UX
        const enhancedResponse = {
          ...response,
          data: {
            ...response.data,
            needsEmailConfirmation: !response.data.session,
            message: response.data.session 
              ? 'Account created and you are now signed in!'
              : 'Account created! Please check your email to confirm your account before signing in.'
          }
        };
        
        // Send welcome email for new users who need confirmation
        if (response.data.user && !response.data.session) {
          try {
            await sendWelcomeEmail(response.data.user);
          } catch (emailError) {
            authLogger.error('Error sending welcome email', emailError);
          }
        }
        
        return enhancedResponse;
      }
      
      return response;
    } catch (error) {
      authLogger.error('Error in signUp', error);
      return { error: error as Error, data: null };
    }
  };

  const signIn = async (provider: 'email' | 'google' | 'linkedin_oidc', credentials: string | { email: string, password: string }): Promise<AuthResponse> => {
    authLogger.info('Starting signin process', { provider });
    
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      if (provider === 'email') {
        const { email, password } = credentials as { email: string, password: string };
        
        // Basic client-side validation
        if (!email?.trim() || !password?.trim()) {
          const error = new Error('Email and password are required') as any;
          authLogger.error('Validation error', error);
          return { error, data: null };
        }
        
        if (!email.includes('@')) {
          const error = new Error('Please enter a valid email address') as any;
          authLogger.error('Invalid email format', error);
          return { error, data: null };
        }
        
        authLogger.debug('Attempting email signin');
        
        const response = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        
        authLogger.debug('Email signin response received', { 
          hasError: !!response.error,
          hasUser: !!response.data?.user,
          errorMessage: response.error?.message 
        });
        
        // Enhanced error processing
        if (response.error) {
          const errorMessage = response.error.message;
          let processedError = response.error;
          
          // Add more context to common errors
          if (errorMessage.includes('Invalid login credentials')) {
            processedError = Object.assign(response.error, { 
              message: 'Invalid email or password. Please check your credentials and try again.',
              type: 'invalid_credentials'
            });
          } else if (errorMessage.includes('Email not confirmed')) {
            processedError = Object.assign(response.error, { 
              message: 'Please check your email and click the confirmation link before signing in.',
              type: 'email_not_confirmed'
            });
          } else if (errorMessage.includes('User not found')) {
            processedError = Object.assign(response.error, { 
              message: 'No account found with this email address. Please check your email or sign up for a new account.',
              type: 'user_not_found'
            });
          } else if (errorMessage.includes('too many requests') || errorMessage.includes('rate limit')) {
            processedError = Object.assign(response.error, { 
              message: 'Too many login attempts. Please wait a few minutes before trying again.',
              type: 'rate_limit'
            });
          } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            processedError = Object.assign(response.error, { 
              message: 'Network connection issue. Please check your internet connection and try again.',
              type: 'network_error'
            });
          }
          
          return { error: processedError, data: response.data };
        }
        
        return response;
      } else if (provider === 'google') {
        authLogger.debug('Attempting Google OAuth signin');
        
        // Get current redirect or default to root
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || '/';
        const oauthRedirectUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;
        
        const response = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: oauthRedirectUrl,
            scopes: 'email profile'
          }
        });
        
        authLogger.debug('Google OAuth response received');
        return response;
      } else if (provider === 'linkedin_oidc') {
        authLogger.debug('Attempting LinkedIn OAuth signin');
        
        // Get current redirect or default to root
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || '/';
        const oauthRedirectUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;
        
        const response = await supabase.auth.signInWithOAuth({
          provider: 'linkedin_oidc',
          options: {
            redirectTo: oauthRedirectUrl,
            scopes: 'openid email profile'
          }
        });
        
        authLogger.debug('LinkedIn OAuth response received');
        return response;
      }
      
      return { 
        error: new Error(`Unsupported provider: ${provider}`), 
        data: null 
      };
    } catch (error) {
      authLogger.error(`Error in signIn with ${provider}`, error);
      return { error: error as Error, data: null };
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    
    // Simple console notification for now
    console.log('You have been successfully signed out');
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`,
      });
      
      if (response.error) {
        authLogger.error('Reset password error', response.error);
      } else {
        authLogger.info('Password reset email sent successfully');
      }
      
      return response;
    } catch (error) {
      authLogger.error('Error in resetPassword', error);
      return { error: error as Error, data: null };
    }
  };

  const updateProfile = async (updates: Record<string, unknown>): Promise<AuthResponse> => {
    if (!supabase || !user) {
      return { error: new Error('User not authenticated'), data: null };
    }

    try {
      const response = await supabase.auth.updateUser({
        data: updates
      });

      if (response.data.user) {
        setUser(response.data.user);
        
        // Simple console notification for now
        console.log('Your profile has been successfully updated');
      }

      return response;
    } catch (error) {
      authLogger.error('Error updating profile', error);
      return { error: error as Error, data: null };
    }
  };

  const sendEmail = async (type: 'confirmation' | 'reset', email: string, data: { 
    confirmationUrl?: string, 
    resetUrl?: string 
  }): Promise<EmailResponse> => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('send-email', {
        body: JSON.stringify({ type, email, data }),
      });

      if (error) throw error;
      authLogger.info('Email sent successfully');
      return { success: true, data: responseData, error: null };
    } catch (error) {
      authLogger.error('Error sending email', error);
      return { success: false, data: null, error };
    }
  };

  const testEmailSending = async (testEmail: string): Promise<EmailResponse> => {
    authLogger.debug('Starting email sending test');
    
    try {
      const result = await sendEmail('confirmation', testEmail, {
        confirmationUrl: `${window.location.origin}/confirm-email`
      });

      authLogger.debug('Email sending test result received');
      
      // Simple console notification for now
      const message = result.success 
        ? 'Test email was sent successfully' 
        : `Email sending failed: ${(result.error as Error)?.message || 'Unknown error'}`;
      console.log(message);

      return result;
    } catch (error) {
      authLogger.error('Unexpected error in email sending test', error);
      return { success: false, data: null, error };
    }
  };

  const value = {
    user,
    session,
    supabase,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    sendEmail,
    testEmailSending,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };