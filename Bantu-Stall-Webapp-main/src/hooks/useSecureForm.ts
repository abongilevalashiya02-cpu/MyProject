import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface SecureFormOptions {
  validateOnChange?: boolean;
  maxAttempts?: number;
  rateLimitMs?: number;
}

interface ValidationErrors {
  [key: string]: string[];
}

// Lightweight secure form handler
export function useSecureForm(options: SecureFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attempts, setAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);

  const validateForm = useCallback((data: any, rules?: any) => {
    const newErrors: ValidationErrors = {};
    
    // Basic validation - extend as needed
    if (rules) {
      Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = data[field];
        
        if (rule.required && (!value || value.trim() === '')) {
          newErrors[field] = ['This field is required'];
        }
        
        if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = ['Please enter a valid email address'];
        }
        
        if (rule.minLength && value && value.length < rule.minLength) {
          newErrors[field] = [`Minimum length is ${rule.minLength} characters`];
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const submitForm = useCallback(async (
    submitFn: () => Promise<any>,
    data?: any,
    validationRules?: any
  ) => {
    // Rate limiting
    const now = Date.now();
    if (now - lastAttempt < (options.rateLimitMs || 1000)) {
      toast.error('Please wait before submitting again');
      return { success: false, error: 'Rate limited' };
    }

    // Max attempts check
    if (attempts >= (options.maxAttempts || 5)) {
      toast.error('Too many attempts. Please try again later.');
      return { success: false, error: 'Max attempts exceeded' };
    }

    // Validation
    if (data && validationRules) {
      const isValid = validateForm(data, validationRules);
      if (!isValid) {
        toast.error('Please fix the errors and try again');
        return { success: false, error: 'Validation failed' };
      }
    }

    setIsSubmitting(true);
    setLastAttempt(now);
    setAttempts(prev => prev + 1);

    try {
      const result = await submitFn();
      setAttempts(0); // Reset on success
      return { success: true, data: result };
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Submission failed. Please try again.');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [attempts, lastAttempt, options.maxAttempts, options.rateLimitMs, validateForm]);

  return {
    submitForm,
    validateForm,
    isSubmitting,
    errors,
    setErrors,
    clearErrors: () => setErrors({})
  };
}