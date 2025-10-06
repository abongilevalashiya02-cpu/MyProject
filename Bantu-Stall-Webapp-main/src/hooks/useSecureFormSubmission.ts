import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeAndValidate } from '@/utils/securityEnhancements';
import { toast } from 'sonner';

interface SecureFormOptions {
  formType: string;
  maxSubmissions?: number;
  windowMinutes?: number;
  validateData?: boolean;
  enableSuspiciousDetection?: boolean;
}

interface FormSubmissionResult {
  success: boolean;
  error?: string;
  blocked?: boolean;
  retryAfter?: number;
}

export function useSecureFormSubmission(options: SecureFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);

  const getClientIdentifier = useCallback(() => {
    // Use IP address or create a browser fingerprint
    return `${navigator.userAgent.slice(0, 50)}-${window.location.hostname}`;
  }, []);

  const validateFormData = useCallback((data: Record<string, any>) => {
    if (!options.validateData) return { isValid: true, sanitizedData: data };

    const sanitizedData: Record<string, any> = {};
    const errors: string[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const result = sanitizeAndValidate(value, {
          maxLength: 1000,
          allowHTML: false,
          strictMode: true
        });

        if (result.threats.length > 0) {
          errors.push(`Invalid data detected in ${key}`);
        }

        sanitizedData[key] = result.sanitized;
      } else {
        sanitizedData[key] = value;
      }
    });

    return {
      isValid: errors.length === 0,
      sanitizedData,
      errors
    };
  }, [options.validateData]);

  const checkRateLimit = useCallback(async (identifier: string) => {
    try {
      const { data, error } = await supabase.rpc('check_form_rate_limit', {
        _identifier: identifier,
        _form_type: options.formType,
        _max_submissions: options.maxSubmissions || 3,
        _window_minutes: options.windowMinutes || 60
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return { allowed: true }; // Fail open for availability
      }

      return data as { allowed: boolean; reason?: string; retry_after?: number };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Fail open for availability
    }
  }, [options.formType, options.maxSubmissions, options.windowMinutes]);

  const detectSuspiciousActivity = useCallback(async (
    identifier: string, 
    formData: Record<string, any>
  ) => {
    if (!options.enableSuspiciousDetection) return { should_block: false };

    try {
      const { data, error } = await supabase.rpc('detect_suspicious_form_patterns', {
        _identifier: identifier,
        _form_data: formData,
        _form_type: options.formType
      });

      if (error) {
        console.error('Suspicious activity detection failed:', error);
        return { should_block: false };
      }

      return data as { should_block: boolean };
    } catch (error) {
      console.error('Suspicious activity detection error:', error);
      return { should_block: false };
    }
  }, [options.enableSuspiciousDetection, options.formType]);

  const submitForm = useCallback(async <T>(
    formData: Record<string, any>,
    submitFunction: (sanitizedData: Record<string, any>) => Promise<T>
  ): Promise<FormSubmissionResult & { data?: T }> => {
    if (isSubmitting) {
      return { success: false, error: 'Form is already being submitted' };
    }

    setIsSubmitting(true);

    try {
      const identifier = getClientIdentifier();

      // Step 1: Validate and sanitize form data
      const validation = validateFormData(formData);
      if (!validation.isValid && validation.errors) {
        toast.error(`Form validation failed: ${validation.errors.join(', ')}`);
        return { success: false, error: 'Form validation failed' };
      }

      // Step 2: Check rate limiting
      const rateLimitResult = await checkRateLimit(identifier);
      if (!rateLimitResult.allowed) {
        const message = rateLimitResult.reason === 'rate_limited' 
          ? `You are temporarily blocked. Please try again later.`
          : `Too many submissions. Please wait before trying again.`;
        
        toast.error(message);
        return { 
          success: false, 
          error: message,
          blocked: true,
          retryAfter: rateLimitResult.retry_after
        };
      }

      // Step 3: Detect suspicious patterns
      const suspiciousResult = await detectSuspiciousActivity(identifier, validation.sanitizedData);
      if (suspiciousResult.should_block) {
        toast.error('Suspicious activity detected. Your submission has been blocked.');
        return { 
          success: false, 
          error: 'Submission blocked due to suspicious activity',
          blocked: true
        };
      }

      // Step 4: Submit the form
      const data = await submitFunction(validation.sanitizedData);
      
      setSubmissionCount(prev => prev + 1);
      toast.success('Form submitted successfully!');
      
      return { success: true, data };

    } catch (error) {
      console.error('Secure form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      toast.error(`Submission failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting, 
    getClientIdentifier, 
    validateFormData, 
    checkRateLimit, 
    detectSuspiciousActivity
  ]);

  return {
    submitForm,
    isSubmitting,
    submissionCount
  };
}