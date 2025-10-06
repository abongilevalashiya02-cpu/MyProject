import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyListingFormData } from './propertyListingSchema';
import { LoadingButton } from '@/components/ui/loading-button';
import MediaUploadSection from './MediaUploadSection';
import BasicInfoSection from './BasicInfoSection';
import CapacitySection from './CapacitySection';
import PricingSection from './PricingSection';
import ContactSection from './ContactSection';
import AmenitiesSection from './AmenitiesSection';
import FeaturesSection from './FeaturesSection';
import EnhancedInfoSection from './EnhancedInfoSection';

interface MobileOptimizedFormProps {
  form: UseFormReturn<PropertyListingFormData>;
  onSubmit: (data: PropertyListingFormData) => void;
  onClose: () => void;
  selectedAmenities: string[];
  onAmenityChange: (amenity: string, checked: boolean) => void;
  mediaFiles: File[];
  setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isSubmitting: boolean;
}

const MobileOptimizedForm: React.FC<MobileOptimizedFormProps> = ({
  form,
  onSubmit,
  onClose,
  selectedAmenities,
  onAmenityChange,
  mediaFiles,
  setMediaFiles,
  isSubmitting
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  
  const steps = [
    {
      id: 1,
      title: 'Media & Photos',
      component: <MediaUploadSection files={mediaFiles} setFiles={setMediaFiles} />,
      required: false
    },
    {
      id: 2,
      title: 'Basic Information',
      component: <BasicInfoSection form={form} />,
      required: true
    },
    {
      id: 3,
      title: 'Capacity & Rooms',
      component: <CapacitySection form={form} />,
      required: true
    },
    {
      id: 4,
      title: 'Pricing',
      component: <PricingSection form={form} />,
      required: true
    },
    {
      id: 5,
      title: 'Contact Details',
      component: <ContactSection form={form} />,
      required: true
    },
    {
      id: 6,
      title: 'Amenities',
      component: (
        <AmenitiesSection 
          form={form} 
          selectedAmenities={selectedAmenities}
          onAmenityChange={onAmenityChange}
        />
      ),
      required: true
    },
    {
      id: 7,
      title: 'Features',
      component: <FeaturesSection form={form} />,
      required: false
    },
    {
      id: 8,
      title: 'Additional Info',
      component: <EnhancedInfoSection form={form} />,
      required: false
    }
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (Object.keys(form.formState.dirtyFields).length > 0) {
        saveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [form.formState.dirtyFields]);

  const saveDraft = async () => {
    setIsDraftSaving(true);
    // Simulate draft save
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsDraftSaving(false);
  };

  const nextStep = async () => {
    // Validate current step fields before proceeding
    const currentStepFields = getCurrentStepFields();
    const isValid = await form.trigger(currentStepFields);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStepFields = (): (keyof PropertyListingFormData)[] => {
    switch (currentStep) {
      case 2:
        return ['propertyName', 'propertyType', 'location', 'area', 'proximityToLandmark', 'description'];
      case 3:
        return ['minCapacity', 'maxCapacity', 'totalRooms', 'meetingRooms'];
      case 4:
        return ['priceRangeUSD', 'priceRangeZAR'];
      case 5:
        return ['contactName', 'contactEmail', 'contactPhone'];
      case 6:
        return ['activities', 'amenities'];
      default:
        return [];
    }
  };

  const currentStepData = steps[currentStep - 1];
  const canProceed = currentStep === totalSteps || !currentStepData.required;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Cancel
          </Button>
          
          <div className="text-center">
            <p className="text-sm font-medium">Step {currentStep} of {totalSteps}</p>
            <p className="text-xs text-muted-foreground">{currentStepData.title}</p>
          </div>

          <LoadingButton
            variant="ghost"
            size="sm"
            onClick={saveDraft}
            loading={isDraftSaving}
            className="flex items-center gap-2 text-xs"
          >
            <Save className="h-3 w-3" />
            {isDraftSaving ? 'Saving...' : 'Save'}
          </LoadingButton>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-24">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
              {currentStepData.required && (
                <p className="text-xs text-muted-foreground">* Required fields</p>
              )}
            </CardHeader>
            <CardContent>
              {currentStepData.component}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 1}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <LoadingButton
              onClick={form.handleSubmit(onSubmit)}
              loading={isSubmitting}
              loadingText="Submitting..."
              className="flex-1"
            >
              Submit for Review
            </LoadingButton>
          ) : (
            <Button
              onClick={nextStep}
              className="flex-1"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-1 mt-3">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index + 1 <= currentStep 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
              aria-label={`Go to step ${step.id}: ${step.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedForm;