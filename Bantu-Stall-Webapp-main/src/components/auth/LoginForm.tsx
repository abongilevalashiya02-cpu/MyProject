import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToastAction } from '@/components/ui/toast';
import { InfoIcon, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormValues } from './FormValidation';
import { FormLoadingSpinner } from './LoadingStates';
import { authLogger } from '@/utils/logger';

import { AuthErrorHandler } from '@/utils/authErrorHandler';
import { useRetry } from '@/hooks/useRetry';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface LoginFormProps {
  setActiveTab: (tab: string) => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setActiveTab, onForgotPassword }) => {
  const FORM_KEY = 'login-form';
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { retry, isRetrying } = useRetry({ maxAttempts: 3 });
  const { isOnline, isSlowConnection } = useNetworkStatus();

  const defaultFormValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const { loadInitialData, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  // Login form with persisted email only
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: loadInitialData().email || '',
      password: '', // Never persist passwords
    },
  });

  // Auto-save form data (excluding password for security)
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues, undefined, [], ['password']);

  // Enhanced login handler with better error handling
  const onSubmit = async (data: LoginFormValues) => {
    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }

    const performLogin = async () => {
      const { error, data: authData } = await signIn('email', {
        email: data.email,
        password: data.password
      });
      
      if (error) {
        throw error;
      }
      
      return authData;
    };

    setIsLoading(true);
    authLogger.info('Login form submission started', { email: data.email });
    
    try {
      const result = await retry(performLogin);
      
      authLogger.info('Login successful');
      setLoginSuccess(true);
      
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${data.email}`,
        duration: 3000,
      });

      // Clear form data on successful login
      clearData();
      
      // Navigate to home page
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: unknown) {
      const context = {
        operation: 'login' as const,
        email: data.email,
        timestamp: new Date()
      };
      
      AuthErrorHandler.logError(error, context);
      
      const processedError = AuthErrorHandler.processError(
        error,
        context,
        undefined, // onSwitchToLogin (not applicable)
        () => setActiveTab('signup') // onSwitchToSignup
      );
      
      toast({
        title: processedError.title,
        description: processedError.description,
        variant: processedError.variant,
        action: processedError.actionText && processedError.actionCallback ? (
          <ToastAction altText={processedError.actionText} onClick={processedError.actionCallback}>
            {processedError.actionText}
          </ToastAction>
        ) : undefined
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {loginSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4"
        >
          <Alert className="bg-green-50 border-green-200">
            <InfoIcon className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Login successful! Redirecting you to the dashboard...
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
              <FormControl>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input 
                    placeholder="Enter your email" 
                    type="email" 
                    className="rounded-xl border-gray-200 focus:border-bantu-orange focus:ring-bantu-orange/20 transition-all duration-200 h-12"
                    {...field} 
                  />
                </motion.div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
              <FormControl>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <Input 
                    placeholder="Enter your password" 
                    type={showPassword ? "text" : "password"}
                    className="rounded-xl border-gray-200 focus:border-bantu-orange focus:ring-bantu-orange/20 transition-all duration-200 h-12 pr-12"
                    {...field} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bantu-orange transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </motion.div>
              </FormControl>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-bantu-orange hover:text-orange-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-bantu-orange to-orange-600 hover:from-orange-600 hover:to-bantu-orange text-white rounded-xl py-3 h-12 font-semibold shadow-lg transition-all duration-200"
            disabled={isLoading || !isOnline}
          >
            {isLoading || isRetrying ? (
              <>
                <FormLoadingSpinner size="sm" className="mr-2" />
                {isRetrying ? 'Retrying...' : 'Signing in...'}
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          {isSlowConnection && (
            <p className="text-xs text-yellow-600 mt-2 text-center">
              Slow connection detected. This may take longer than usual.
            </p>
          )}
          {!isOnline && (
            <p className="text-xs text-red-600 mt-2 text-center">
              No internet connection. Please check your connection and try again.
            </p>
          )}
        </motion.div>
      </form>
    </Form>
  );
};

export default LoginForm;