import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validatePasswordStrength, logAuditEvent } from '@/utils/security';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PasswordProtectionResult {
  isValid: boolean;
  errors: string[];
}

export function usePasswordProtection() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Validate password strength
  const validatePassword = useCallback((password: string): PasswordProtectionResult => {
    return validatePasswordStrength(password);
  }, []);

  // Check if password has been compromised (using HaveIBeenPwned API)
  const checkPasswordBreach = useCallback(async (password: string): Promise<boolean> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = await response.text();
      
      return hashes.includes(suffix);
    } catch (error) {
      console.error('Breach check failed:', error);
      return false; // Fail open - don't block if service is unavailable
    }
  }, []);

  // Update user password with security checks
  const updatePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Validate new password strength
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Password does not meet requirements: ${validation.errors.join(', ')}`
        };
      }

      // Check if password has been breached
      const isBreached = await checkPasswordBreach(newPassword);
      if (isBreached) {
        toast({
          title: "Password Security Warning",
          description: "This password has been found in data breaches. Please choose a different password.",
          variant: "destructive"
        });
        return {
          success: false,
          error: "Password has been compromised in data breaches"
        };
      }

      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Log successful password change
      await logAuditEvent({
        user_id: user?.id,
        action: 'password_changed',
        resource: 'user_account',
        details: { success: true },
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Log failed password change attempt
      await logAuditEvent({
        user_id: user?.id,
        action: 'password_change_failed',
        resource: 'user_account',
        details: { error: errorMessage },
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [user, validatePassword, checkPasswordBreach, toast]);

  // Reset password via email
  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Log password reset request
      await logAuditEvent({
        action: 'password_reset_requested',
        resource: 'user_account',
        details: { email },
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      });

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    validatePassword,
    checkPasswordBreach,
    updatePassword,
    resetPassword
  };
}

// Helper function to get client IP (best effort)
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
}