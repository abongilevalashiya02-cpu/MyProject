import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginFormValues } from './FormValidation';
import { AccessiblePasswordToggle, ValidationStatusAnnouncer, AuthErrorDisplay, focusFirstError } from './AccessibilityFeatures';
import { FormLoadingSpinner } from './LoadingStates';
import { useRenderPerformance, useDebouncedCallback, useStableCallback } from '@/hooks/usePerformanceOptimization';
import { authLogger } from '@/utils/logger';

interface OptimizedLoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const OptimizedLoginForm: React.FC<OptimizedLoginFormProps> = ({ 
  onSubmit, 
  isLoading, 
  error 
}) => {
  useRenderPerformance('OptimizedLoginForm');
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<string[]>([]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur' // Validate on blur for better UX
  });

  // Debounced validation to reduce re-renders
  const debouncedValidation = useDebouncedCallback((values: LoginFormValues) => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const errors = result.error.issues.map(issue => issue.message);
      setFieldErrors(errors);
    } else {
      setFieldErrors([]);
    }
  }, 300);

  // Stable callback to prevent re-renders
  const handleSubmit = useStableCallback(async (data: LoginFormValues) => {
    authLogger.info('Login form submission started');
    
    try {
      await onSubmit(data);
      authLogger.info('Login form submission completed successfully');
    } catch (err) {
      authLogger.error('Login form submission failed', err);
      focusFirstError('login-form');
    }
  });

  const togglePassword = useStableCallback(() => {
    setShowPassword(prev => !prev);
  });

  // Watch form values for debounced validation
  React.useEffect(() => {
    const subscription = form.watch(debouncedValidation);
    return () => subscription.unsubscribe();
  }, [form, debouncedValidation]);

  return (
    <Form {...form}>
      <ValidationStatusAnnouncer
        isValid={form.formState.isValid}
        errors={fieldErrors}
        isLoading={isLoading}
      />
      
      <AuthErrorDisplay 
        error={error}
        type="error"
      />

      <motion.form
        id="login-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  aria-describedby={field.name + '-error'}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage id={field.name + '-error'} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    autoComplete="current-password"
                    aria-describedby={field.name + '-error'}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={isLoading}
                  />
                  <AccessiblePasswordToggle
                    showPassword={showPassword}
                    onToggle={togglePassword}
                    disabled={isLoading}
                  />
                </div>
              </FormControl>
              <FormMessage id={field.name + '-error'} />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || !form.formState.isValid}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl py-3 font-semibold transition-all disabled:opacity-50"
          aria-describedby="login-button-status"
        >
          {isLoading ? (
            <>
              <FormLoadingSpinner size="sm" className="mr-2" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
        
        <div id="login-button-status" className="sr-only" aria-live="polite">
          {isLoading ? 'Signing in, please wait' : 'Ready to sign in'}
        </div>
      </motion.form>
    </Form>
  );
};

// Memoized export to prevent unnecessary re-renders
export default React.memo(OptimizedLoginForm);