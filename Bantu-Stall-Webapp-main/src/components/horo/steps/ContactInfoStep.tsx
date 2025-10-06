import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { HoroApplicationData } from '../schemas/horoApplicationSchema';
import { motion } from 'framer-motion';
import { CheckCircle2, User, Mail, Phone } from 'lucide-react';

export const ContactInfoStep: React.FC = () => {
  const { control, watch } = useFormContext<HoroApplicationData>();
  const formData = watch();

  const getFieldCompletionStatus = (fieldValue: string | undefined) => {
    return fieldValue && fieldValue.trim() !== '';
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-bantu-orange to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h3>
        <p className="text-gray-600 max-w-md mx-auto">Let's start with your basic contact details so we can reach out to you.</p>
      </div>

      <div className="space-y-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FormField
            control={control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                  <User className="w-4 h-4 text-bantu-orange" />
                  Full Name *
                  {getFieldCompletionStatus(field.value) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="e.g., Jane Doe"
                      {...field}
                      className="h-14 pl-12 text-lg border-2 border-gray-200 rounded-xl focus:border-bantu-orange focus:ring-2 focus:ring-bantu-orange/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FormField
            control={control}
            name="workEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                  <Mail className="w-4 h-4 text-bantu-orange" />
                  Work Email *
                  {getFieldCompletionStatus(field.value) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="e.g., jane.doe@company.com"
                      {...field}
                      className="h-14 pl-12 text-lg border-2 border-gray-200 rounded-xl focus:border-bantu-orange focus:ring-2 focus:ring-bantu-orange/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-bantu-orange rounded-full"></span>
                  We'll use this to contact you about your application
                </p>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FormField
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                  <Phone className="w-4 h-4 text-bantu-orange" />
                  Phone Number
                  <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
                  {getFieldCompletionStatus(field.value) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="e.g., +1 (555) 123-4567"
                      {...field}
                      className="h-14 pl-12 text-lg border-2 border-gray-200 rounded-xl focus:border-bantu-orange focus:ring-2 focus:ring-bantu-orange/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Helpful for a quicker follow-up call if needed
                </p>
              </FormItem>
            )}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};