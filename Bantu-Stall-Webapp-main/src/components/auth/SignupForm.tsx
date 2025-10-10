import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToastAction } from '@/components/ui/toast';
import { InfoIcon, Eye, EyeOff, CheckCircle, Shield, ShoppingBag, Building2, MapPin, Briefcase } from 'lucide-react';
import { signupSchemaExtended as signupSchema, type SignupFormValuesExtended as SignupFormValues } from './FormValidation';
import { FormLoadingSpinner } from './LoadingStates';
import { authLogger } from '@/utils/logger';

import { AuthErrorHandler } from '@/utils/authErrorHandler';
import { useRetry } from '@/hooks/useRetry';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface SignupFormProps {
  setActiveTab: (tab: string) => void;
}

const userTypeOptions = [
  {
    value: 'corporate',
    label: 'Corporate Retreats',
    description: 'Plan team experiences and corporate events',
    icon: Building2
  },
  {
    value: 'traveler',
    label: 'Individual Traveler',
    description: 'Explore African destinations and experiences',
    icon: MapPin
  },
  {
    value: 'service_provider',
    label: 'Service Provider',
    description: 'Offer tourism services and experiences',
    icon: Briefcase
  },
  {
    value: 'vendor',
    label: 'Vendor',
    description: 'Sell your products and services on Bantu Stall',
    icon: ShoppingBag
  }
];

const SignupForm: React.FC<SignupFormProps> = ({ setActiveTab }) => {
  const FORM_KEY = 'signup-form';
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { retry, isRetrying } = useRetry({ maxAttempts: 3 });
  const { isOnline, isSlowConnection } = useNetworkStatus();

  // Get user type from URL params
  const urlUserType = searchParams.get('type') as 'corporate' | 'traveler' | 'service_provider' | 'vendor' | null;

  const defaultFormValues: SignupFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    userType: urlUserType || 'traveler',
    fullName: '',
  };

  const { loadInitialData, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  // Signup form with persisted data (excluding passwords)
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: loadInitialData().email || '',
      fullName: loadInitialData().fullName || '',
      userType: loadInitialData().userType || urlUserType || 'traveler',
      password: '', // Never persist passwords
      confirmPassword: '', // Never persist passwords
    },
  });

  // Auto-save form data (excluding passwords for security)
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues, undefined, [], ['password', 'confirmPassword']);

  // Handle signup
  const onSubmit = async (data: SignupFormValues) => {
    if (!isOnline) {
      toast({
        title: "Connection issue detected",
        description: "We couldn't confirm your connection, attempting signup anyway...",
      });
    }

    const performSignup = async () => {
      const metadata = {
        full_name: data.fullName,
        user_type: data.userType,
        onboarding_completed: false,
        default_dashboard: data.userType === 'corporate' ? 'retreat' : data.userType
      };

      const { error, data: signupData } = await signUp(data.email, data.password, metadata);
      
      if (error) {
        throw error;
      }
      
      return signupData;
    };

    setIsLoading(true);
    authLogger.info('Signup form submission started', { email: data.email, userType: data.userType });
    
    try {
      const result = await retry(performSignup);

      authLogger.info('Signup successful', result);
      setShowEmailInfo(true);
      setRegistrationSuccess(true);

      // result here is the "data" object returned from signUp (not the full response)
      // It contains: user, session, and our custom needsEmailConfirmation flag
      const signupResult = result as any;
      const needsConfirmation = signupResult?.needsEmailConfirmation ?? !signupResult?.session;
      
      if (needsConfirmation) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to confirm your account before signing in.",
          duration: 2500,
        });

        // Navigate to dedicated login route for clarity
        setTimeout(() => {
          navigate('/login?tab=login&needs_confirmation=true');
        }, 1500);
      } else {
        toast({
          title: "Welcome to Bantu!",
          description: "Your account has been created and you're now signed in.",
          duration: 4000,
        });
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
      
      clearData();
      form.reset();
      
    } catch (error: unknown) {
      const context = {
        operation: 'signup' as const,
        email: data.email,
        timestamp: new Date()
      };
      
      AuthErrorHandler.logError(error, context);
      
      const processedError = AuthErrorHandler.processError(
        error,
        context,
        () => setActiveTab('login'), // onSwitchToLogin
        undefined // onSwitchToSignup (not applicable)
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
      {showEmailInfo && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <InfoIcon className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {registrationSuccess 
              ? "Account created successfully! Please check your email to confirm your account before signing in." 
              : "Your account may have been created. If you don't receive a confirmation email, please try signing in or contact support."}
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* User Type Selection */}
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">I am a...</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-bantu-orange focus:ring-bantu-orange/20 transition-all duration-200 h-12">
                    <SelectValue placeholder="Select your user type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userTypeOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
              <FormControl>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input 
                    placeholder="Enter your full name" 
                    className="rounded-xl border-gray-200 focus:border-bantu-orange focus:ring-bantu-orange/20 transition-all duration-200 h-12"
                    {...field} 
                  />
                </motion.div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
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
                    placeholder="Create a strong password" 
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
              <FormDescription className="text-xs text-gray-500 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Must contain uppercase, lowercase, and number (8+ characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
              <FormControl>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Input 
                    placeholder="Confirm your password" 
                    type={showConfirmPassword ? "text" : "password"}
                    className="rounded-xl border-gray-200 focus:border-bantu-orange focus:ring-bantu-orange/20 transition-all duration-200 h-12 pr-12"
                    {...field} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bantu-orange transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </motion.div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-bantu-orange to-orange-600 hover:from-orange-600 hover:to-bantu-orange text-white rounded-xl py-3 h-12 font-semibold shadow-lg transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading || isRetrying ? (
              <>
                <FormLoadingSpinner size="sm" className="mr-2" />
                {isRetrying ? 'Retrying...' : 'Creating account...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Create account
              </>
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

export default SignupForm;