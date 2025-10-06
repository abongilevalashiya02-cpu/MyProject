import { z } from 'zod';

// Shared validation schemas for consistency
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' })
  .max(255, { message: 'Email must be less than 255 characters' });

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(128, { message: 'Password must be less than 128 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  });

export const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(100, { message: 'Name must be less than 100 characters' })
  .regex(/^[a-zA-Z\s\-'\.]+$/, {
    message: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
  });

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' })
});

// Signup form schema
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: nameSchema,
  userType: z.enum(['individual', 'business'], {
    required_error: 'Please select a user type'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: emailSchema
});

// Update FormValidation.tsx to support the correct user types
export const signupSchemaExtended = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: nameSchema,
  userType: z.enum(['corporate', 'traveler', 'service_provider', 'vendor'], {
    required_error: 'Please select a user type'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Export types
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type SignupFormValuesExtended = z.infer<typeof signupSchemaExtended>;

// Validation utilities
export const validatePasswordStrength = (password: string) => {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    ...checks,
    score,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong'
  };
};

export const getPasswordStrengthColor = (strength: string) => {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-gray-400';
  }
};

export const getPasswordStrengthProgress = (strength: string) => {
  switch (strength) {
    case 'weak':
      return 33;
    case 'medium':
      return 66;
    case 'strong':
      return 100;
    default:
      return 0;
  }
};