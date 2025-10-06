
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
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

// Reset password form schema
const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  setActiveTab: (tab: string) => void;
  onBack?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ setActiveTab, onBack }) => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Reset password form - no persistence for security
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle reset password
  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(data.email);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions",
      });
      
      // After reset request, switch to login tab
      setActiveTab('login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Password reset failed",
        description: errorMessage || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
          <p className="text-sm text-gray-600">Enter your email to receive reset instructions</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Enter your email" 
                      type="email" 
                      className="pl-10 rounded-xl border-gray-200 focus:border-bantu-orange focus:ring-bantu-orange/20 transition-all"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-bantu-orange to-orange-600 hover:from-orange-600 hover:to-bantu-orange text-white rounded-xl py-3 font-semibold shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : null}
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
