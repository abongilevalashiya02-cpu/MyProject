
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import { useFormPersistence } from '@/hooks/useFormPersistence';

// Import the form schema
import { formSchema, FormValues } from './golden-ticket/formSchema';

// Import form pages
import FormProgress from './golden-ticket/FormProgress';
import WelcomePage from './golden-ticket/WelcomePage';
import BasicInfoPage from './golden-ticket/BasicInfoPage';
import ExcursionPage from './golden-ticket/ExcursionPage';
import GoalsPage from './golden-ticket/GoalsPage';
import SubmissionPage from './golden-ticket/SubmissionPage';
import SuccessPage from './golden-ticket/SuccessPage';
import FormNavigation from './golden-ticket/FormNavigation';

// Import form submission utilities
import { saveToSupabase } from './golden-ticket/supabaseSubmit';
import { sendFormDataByEmail } from './golden-ticket/emailSubmit';

const GoldenTicketForm = () => {
  const FORM_KEY = 'golden-ticket-form';
  const totalSteps = 5;
  
  const defaultFormValues: FormValues = {
    name: "",
    organization: "",
    country: "",
    email: "",
    destination: "",
    experienceType: "",
    groupSize: "",
    duration: "",
    budget: "",
    goal1: "",
    goal2: "",
    localFacilitators: "maybe",
  };

  // Load initial state from localStorage
  const { loadInitialData, loadInitialStep, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  const [step, setStep] = useState(() => loadInitialStep(1));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase } = useAuth();

  // Initialize form with persisted data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadInitialData(),
  });

  // Auto-save form data and step whenever they change
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues, step, [step]);

  const handleFormSubmission = async (data: FormValues) => {
    setIsSubmitting(true);
    console.log('Form submission started with data:', data);
    console.log('Supabase client available:', !!supabase);
    
    try {
      // First try email submission as it doesn't depend on Supabase
      const emailResult = await sendFormDataByEmail(data);
      let submissionSuccessful = false;
      
      if (emailResult.success) {
        console.log('Form submitted successfully via email!');
        submissionSuccessful = true;
      }
      
      // Try Supabase if it's available (as a backup/secondary storage)
      if (supabase) {
        try {
          const supabaseResult = await saveToSupabase(supabase, data);
          if (supabaseResult.success) {
            console.log('Golden Ticket application submitted successfully to Supabase!');
            submissionSuccessful = true;
          } else {
            console.log('Supabase submission failed:', supabaseResult.error);
          }
        } catch (supabaseError) {
          console.error('Error during Supabase submission:', supabaseError);
          // We don't fail the overall submission if just Supabase fails
        }
      } else {
        console.log('Supabase client not available, skipping Supabase submission');
      }
      
      if (submissionSuccessful) {
        setIsSubmitted(true);
        clearData(); // Clear persisted data on successful submission
        toast({
          title: "Golden Ticket Application Submitted!",
          description: "Your application has been received. We'll review it and get back to you soon.",
          variant: "default",
        });
      } else {
        throw new Error('Failed to submit form via all methods');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error submitting form",
        description: "There was a problem sending your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    console.log('Form data:', data);
    await handleFormSubmission(data);
  };
  
  const handleNextStep = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    // Determine which fields to validate based on current step
    switch (step) {
      case 2:
        fieldsToValidate = ["name", "email", "country"];
        break;
      case 3:
        fieldsToValidate = ["destination", "experienceType", "groupSize", "duration", "budget"];
        break;
      case 4:
        fieldsToValidate = ["goal1", "goal2", "localFacilitators"];
        break;
      default:
        break;
    }
    
    // Validate the fields for the current step
    const isStepValid = await form.trigger(fieldsToValidate);
    
    if (isStepValid) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else if (step === totalSteps - 1) {
        form.handleSubmit(onSubmit)();
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Progress bar */}
      <FormProgress step={step} totalSteps={totalSteps} />

      {/* Form content */}
      <div className="p-6 md:p-8">
        {!isSubmitted ? (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Page 1: Welcome */}
              {step === 1 && <WelcomePage onNext={handleNextStep} />}

              {/* Page 2: Basic Info */}
              {step === 2 && <BasicInfoPage />}

              {/* Page 3: Build the Excursion */}
              {step === 3 && <ExcursionPage />}

              {/* Page 4: Goals & Learning Outcomes */}
              {step === 4 && <GoalsPage />}

              {/* Page 5: Submission */}
              {step === 5 && <SubmissionPage isSubmitting={isSubmitting} onSubmit={form.handleSubmit(onSubmit)} />}

              {/* Navigation buttons */}
              {step > 1 && step < 5 && (
                <FormNavigation 
                  step={step} 
                  onPrevious={handlePreviousStep} 
                  onNext={handleNextStep} 
                />
              )}
            </form>
          </FormProvider>
        ) : (
          /* Success State */
          <SuccessPage />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default GoldenTicketForm;
