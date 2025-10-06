import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
import { InfoIcon, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const EnhancedLoginForm: React.FC = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn('email', { email: values.email, password: values.password });
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      setLoginSuccess(true);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8 mt-12 border border-gray-100"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-bantu-yellow">Sign in to Bantu Stall</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@email.com" {...field} autoFocus />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-bantu-yellow"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-bantu-yellow hover:bg-bantu-orange text-white font-semibold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          {loginSuccess && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <InfoIcon className="w-5 h-5 text-green-500 mr-2 inline" />
              <AlertDescription>Login successful! Redirecting...</AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
      <div className="mt-6 text-center">
        <span className="text-gray-500">Don&apos;t have an account?</span>{' '}
        <button
          className="text-bantu-yellow hover:underline font-semibold"
          onClick={() => navigate('/signup')}
        >
          Sign up
        </button>
      </div>
    </motion.div>
  );
};

export default EnhancedLoginForm;
