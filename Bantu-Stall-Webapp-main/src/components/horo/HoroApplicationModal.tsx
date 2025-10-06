import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeInput } from '@/utils/security';
import { horoApplicationSchema, type HoroApplicationData } from './schemas/horoApplicationSchema';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { OrganizationalContextStep } from './steps/OrganizationalContextStep';
import { ExperienceRequirementsStep } from './steps/ExperienceRequirementsStep';
import { SuccessStep } from './steps/SuccessStep';

interface HoroApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HoroApplicationModal: React.FC<HoroApplicationModalProps> = ({ isOpen, onClose }) => {
  const FORM_KEY = 'horo-application';
  
  const defaultFormValues: HoroApplicationData = {
    fullName: '',
    workEmail: '',
    phoneNumber: '',
    companyName: '',
    jobTitle: '',
    teamSize: '',
    objectives: [],
    experienceDetails: '',
    locations: '',
    budgetRange: '',
    source: '',
  };

  // Load initial state from localStorage
  const { loadInitialData, loadInitialStep, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const form = useForm<HoroApplicationData>({
    resolver: zodResolver(horoApplicationSchema),
    defaultValues: defaultFormValues,
  });

  // Load persisted data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const persistedData = loadInitialData();
      const persistedStep = loadInitialStep(1);
      
      form.reset(persistedData);
      setCurrentStep(persistedStep);
    }
  }, [isOpen, loadInitialData, loadInitialStep, form]);

  // Auto-save form data and step whenever they change
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues, currentStep, [currentStep]);

  const stepFields = {
    1: ['fullName', 'workEmail', 'phoneNumber'],
    2: ['companyName', 'jobTitle', 'teamSize'],
    3: ['objectives', 'experienceDetails', 'locations', 'budgetRange', 'source'],
  };

  const validateStep = async (step: number) => {
    const fieldsToValidate = stepFields[step as keyof typeof stepFields];
    const result = await form.trigger(fieldsToValidate as any);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: HoroApplicationData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the data for insertion with sanitization
      const applicationData = {
        full_name: sanitizeInput(data.fullName),
        work_email: sanitizeInput(data.workEmail),
        phone_number: data.phoneNumber ? sanitizeInput(data.phoneNumber) : null,
        company_name: sanitizeInput(data.companyName),
        job_title: sanitizeInput(data.jobTitle),
        team_size: sanitizeInput(data.teamSize),
        objectives: data.objectives,
        experience_details: data.experienceDetails ? sanitizeInput(data.experienceDetails) : null,
        locations: data.locations ? sanitizeInput(data.locations) : null,
        budget_range: data.budgetRange ? sanitizeInput(data.budgetRange) : null,
        source: data.source ? sanitizeInput(data.source) : null,
        user_id: user?.id || null, // Associate with user if logged in
      };

      // Insert the application into Supabase
      const { data: insertedData, error } = await supabase
        .from('horo_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('Horo Application Submitted Successfully:', insertedData);
      
      setIsSubmitted(true);
      clearData(); // Clear persisted data on successful submission
      toast({
        title: "Application Submitted Successfully!",
        description: "Our team will be in touch within two business days.",
      });
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: "Submission Failed",
        description: "We were unable to submit your application. Please try again in a few moments.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Only clear persistence if modal is being closed without submission
      if (!isSubmitted) {
        clearData();
      }
      setCurrentStep(1);
      setIsSubmitted(false);
      form.reset();
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && !isSubmitting) {
      handleClose();
    }
  };

  const renderStepContent = () => {
    if (isSubmitted) {
      return <SuccessStep onClose={handleClose} />;
    }

    switch (currentStep) {
      case 1:
        return <ContactInfoStep />;
      case 2:
        return <OrganizationalContextStep />;
      case 3:
        return <ExperienceRequirementsStep />;
      default:
        return <ContactInfoStep />;
    }
  };

  const canProceed = () => {
    const watchedFields = form.watch();
    const fieldsForStep = stepFields[currentStep as keyof typeof stepFields];
    
    return fieldsForStep.every(field => {
      const value = watchedFields[field as keyof HoroApplicationData];
      if (field === 'objectives') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-white via-gray-50 to-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-bantu-orange/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <motion.h2 
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {isSubmitted ? 'Application Submitted' : 'Apply for Horo Experience'}
              </motion.h2>
              {!isSubmitted && (
                <motion.p 
                  className="text-gray-600 mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  Step {currentStep} of {totalSteps}: {
                    currentStep === 1 ? 'Contact Information' :
                    currentStep === 2 ? 'Organizational Context' :
                    'Experience Requirements'
                  }
                </motion.p>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
          
          {/* Progress Bar */}
          {!isSubmitted && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="text-bantu-orange font-semibold">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="relative">
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-gray-100 rounded-full overflow-hidden"
                />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-bantu-orange to-orange-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className={currentStep >= 1 ? "text-bantu-orange font-medium" : ""}>Contact</span>
                <span className={currentStep >= 2 ? "text-bantu-orange font-medium" : ""}>Organization</span>
                <span className={currentStep >= 3 ? "text-bantu-orange font-medium" : ""}>Requirements</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-8 max-h-[calc(90vh-200px)] overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSubmitted ? 'success' : currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        {!isSubmitted && (
          <motion.div 
            className="px-8 py-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 hover:bg-gray-100 border-2 hover:border-gray-300 transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  </motion.div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="hover:bg-gray-100 border-2 hover:border-gray-300 transition-all"
                >
                  Cancel
                </Button>
                
                {currentStep < totalSteps ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed() || isSubmitting}
                      className="bg-gradient-to-r from-bantu-orange to-orange-600 hover:from-bantu-orange hover:to-orange-700 text-white flex items-center gap-2 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={!canProceed() || isSubmitting}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HoroApplicationModal;