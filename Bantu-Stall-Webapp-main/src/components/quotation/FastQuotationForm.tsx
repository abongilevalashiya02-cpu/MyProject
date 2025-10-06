import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useCreateQuotationRequest } from '@/hooks/useQuotationRequests';
import { toast } from 'sonner';
import { ServiceLineItem } from '@/utils/serviceCosting';

// Lazy load form steps for better performance
const StepBasicInfo = lazy(() => import('./steps/StepBasicInfo'));
const StepServiceSelection = lazy(() => import('./steps/StepServiceSelection'));
const StepDatesBudget = lazy(() => import('./steps/StepDatesBudget'));
const StepContactInfo = lazy(() => import('./steps/StepContactInfo'));
const StepReview = lazy(() => import('./steps/StepReview'));

interface FormData {
  // Basic Info
  eventType: string;
  attendeeCount: string;
  attendee_count?: number;
  duration: string;
  objectives: string[];
  
  // Services
  selectedServices: string[];
  selected_service_items?: ServiceLineItem[];
  service_notes?: string;
  venuePreference: string;
  cateringRequirements: string;
  
  // Dates & Budget
  preferredDates: string;
  flexibility: string;
  budgetRange: string;
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  
  // Additional
  specialRequests: string;
}

interface FastQuotationFormProps {
  onClose: () => void;
  onComplete?: () => void;
}

export const FastQuotationForm: React.FC<FastQuotationFormProps> = ({
  onClose,
  onComplete
}) => {
  const { user } = useAuth();
  const createRequest = useCreateQuotationRequest();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    eventType: '',
    attendeeCount: '',
    duration: '',
    objectives: [],
    selectedServices: [],
    selected_service_items: [],
    service_notes: '',
    venuePreference: '',
    cateringRequirements: '',
    preferredDates: '',
    flexibility: 'flexible',
    budgetRange: '',
    contactName: user?.user_metadata?.full_name || '',
    contactEmail: user?.email || '',
    contactPhone: '',
    companyName: '',
    specialRequests: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.eventType && formData.attendeeCount && formData.duration;
      case 2:
        return formData.selectedServices.length > 0;
      case 3:
        return formData.preferredDates && formData.budgetRange;
      case 4:
        return formData.contactName && formData.contactEmail;
      case 5:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to submit your request');
      return;
    }

    try {
      // Parse numeric values properly, handling empty strings
      const attendeeCount = formData.attendeeCount ? parseInt(formData.attendeeCount, 10) : null;
      const duration = formData.duration ? parseInt(formData.duration, 10) : null;

      // Validate parsed numbers
      if (attendeeCount !== null && (isNaN(attendeeCount) || attendeeCount <= 0)) {
        toast.error('Please enter a valid number of attendees');
        return;
      }

      if (duration !== null && (isNaN(duration) || duration <= 0)) {
        toast.error('Please enter a valid event duration');
        return;
      }

      const requestData = {
        user_id: user.id,
        company_name: formData.companyName || null,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        event_objectives: formData.objectives.length > 0 ? formData.objectives : [],
        desired_outcomes: formData.eventType ? [`${formData.eventType} retreat`] : [],
        additional_goals: formData.specialRequests || null,
        attendee_count: attendeeCount,
        event_duration: duration,
        preferred_dates: formData.preferredDates || null,
        budget_range: formData.budgetRange || null,
        special_requirements: formData.specialRequests || null,
        selected_venue_id: null,
        venue_preferences: formData.venuePreference || null,
        location_preference: 'South Africa',
        selected_services: formData.selectedServices.length > 0 ? formData.selectedServices : [],
        catering_requirements: formData.cateringRequirements || null,
        transportation_needs: null,
        accommodation_type: null,
        subtotal: 0,
        vat_amount: 0,
        total_amount: 0,
        currency: 'ZAR',
        current_step: 5,
        status: 'submitted' as const,
        quote_reference: `QUO-${Date.now()}`,
        submitted_at: new Date().toISOString()
      };

      console.log('Submitting request with data:', requestData);
      await createRequest.mutateAsync(requestData);
      toast.success('Quotation request submitted successfully! We\'ll get back to you within 24 hours.');
      onComplete?.();
      onClose();
    } catch (error: any) {
      console.error('Error submitting request:', error);
      const errorMessage = error?.message || 'Failed to submit request. Please try again.';
      toast.error(errorMessage);
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onPrevious: handlePrevious
    };

    switch (currentStep) {
      case 1:
        return <StepBasicInfo {...stepProps} />;
      case 2:
        return <StepServiceSelection {...stepProps} />;
      case 3:
        return <StepDatesBudget {...stepProps} />;
      case 4:
        return <StepContactInfo {...stepProps} />;
      case 5:
        return <StepReview {...stepProps} onSubmit={handleSubmit} isSubmitting={createRequest.isPending} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quick Quotation Request</CardTitle>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            {renderStep()}
          </Suspense>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === totalSteps ? (
              <Button 
                onClick={handleSubmit}
                disabled={!canProceed() || createRequest.isPending}
                className="min-w-32"
              >
                {createRequest.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};