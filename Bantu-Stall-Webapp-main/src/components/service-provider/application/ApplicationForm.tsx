
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationStep1 } from './ApplicationStep1';
import { ApplicationStep2 } from './ApplicationStep2';
import { ApplicationStep3 } from './ApplicationStep3';
import { ServiceProviderApplication } from '@/types/serviceProvider';

// Define the schema for step 1
const step1Schema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  providerType: z.string().min(1, { message: "Please select a provider type" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

// Define the schema for step 2
const step2Schema = z.object({
  profilePhoto: z.string().optional(),
  govIdDocument: z.string().optional(),
  businessRegistration: z.string().optional(),
  portfolioImages: z.array(z.string()).optional(),
  professionalBio: z.string().optional()
});

// Define the schema for step 3
const step3Schema = z.object({
  areasOfExpertise: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  yearsExperience: z.string().optional(),
  servicesOffered: z.string().optional(),
  basePrice: z.number().optional(),
  pricePerPerson: z.number().optional(),
  currency: z.string().optional(),
  availability: z.string().optional(),
  certifications: z.string().optional()
});

// Combine all schemas
const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type ApplicationFormValues = z.infer<typeof formSchema>;

export const ApplicationForm: React.FC = () => {
  const FORM_KEY = 'service-provider-application';
  
  const defaultFormValues: ApplicationFormValues = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    providerType: '',
    termsAccepted: false,
    profilePhoto: '',
    govIdDocument: '',
    businessRegistration: '',
    portfolioImages: [],
    professionalBio: '',
    areasOfExpertise: [],
    languages: [],
    yearsExperience: '',
    servicesOffered: '',
    basePrice: 0,
    pricePerPerson: 0,
    currency: 'usd',
    availability: '',
    certifications: ''
  };

  // Load initial state from localStorage
  const { loadInitialData, loadInitialStep, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  const [activeStep, setActiveStep] = useState<string>(() => {
    const stepMap = { 1: 'step1', 2: 'step2', 3: 'step3' };
    const step = loadInitialStep(1);
    return stepMap[step as keyof typeof stepMap] || 'step1';
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadInitialData(),
  });

  // Auto-save form data and step whenever they change
  const formData = form.watch();
  const stepNumber = activeStep === 'step1' ? 1 : activeStep === 'step2' ? 2 : 3;
  useFormPersistence(FORM_KEY, formData, defaultFormValues, stepNumber, [activeStep]);

  // Load existing draft application if available
  useEffect(() => {
    const fetchExistingApplication = async () => {
      if (!user) return;
      
      try {
        // Type-safe approach to fetch from service_provider_applications table
        const { data, error } = await supabase
          .from('service_provider_applications')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'draft')
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          // Cast the data to our type to ensure type safety
          const application = data as unknown as ServiceProviderApplication;
          
          form.reset({
            email: application.email,
            firstName: application.first_name,
            lastName: application.last_name,
            phone: application.phone,
            location: application.location,
            providerType: application.provider_type,
            termsAccepted: application.terms_accepted,
            profilePhoto: application.profile_photo || '',
            govIdDocument: application.gov_id_document || '',
            businessRegistration: application.business_registration || '',
            portfolioImages: application.portfolio_images || [],
            professionalBio: application.professional_bio || '',
            areasOfExpertise: application.areas_of_expertise || [],
            languages: application.languages || [],
            yearsExperience: application.years_experience || '',
            servicesOffered: application.services_offered || '',
            basePrice: application.base_price || 0,
            pricePerPerson: application.price_per_person || 0,
            currency: application.currency || 'usd',
            availability: application.availability || '',
            certifications: application.certifications || ''
          });
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };

    fetchExistingApplication();
  }, [user]);

  const handleNext = async () => {
    let validationSucceeded = false;
    
    if (activeStep === 'step1') {
      validationSucceeded = await form.trigger(['email', 'firstName', 'lastName', 'phone', 'location', 'providerType', 'termsAccepted']);
      if (validationSucceeded) setActiveStep('step2');
    } else if (activeStep === 'step2') {
      validationSucceeded = true; // Step 2 fields are optional
      setActiveStep('step3');
    } else {
      validationSucceeded = true; // Step 3 fields are optional
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (activeStep === 'step3') setActiveStep('step2');
    else if (activeStep === 'step2') setActiveStep('step1');
  };
  
  // Save application as draft
  const saveDraft = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your application",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const values = form.getValues();
    
    try {
      // Type-safe approach to upsert data
      const { error } = await supabase
        .from('service_provider_applications')
        .upsert({
          user_id: user.id,
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          location: values.location,
          provider_type: values.providerType,
          terms_accepted: values.termsAccepted,
          profile_photo: values.profilePhoto,
          gov_id_document: values.govIdDocument,
          business_registration: values.businessRegistration,
          portfolio_images: values.portfolioImages,
          professional_bio: values.professionalBio,
          areas_of_expertise: values.areasOfExpertise,
          languages: values.languages,
          years_experience: values.yearsExperience,
          services_offered: values.servicesOffered,
          base_price: values.basePrice,
          price_per_person: values.pricePerPerson,
          currency: values.currency,
          availability: values.availability,
          certifications: values.certifications,
          status: 'draft',
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Draft saved",
        description: "Your application has been saved as a draft",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save your application draft",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your application",
        variant: "destructive",
      });
      return;
    }
    
    if (!(await form.trigger())) {
      toast({
        title: "Validation failed",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const values = form.getValues();
    
    try {
      // Type-safe approach to upsert data
      const { error } = await supabase
        .from('service_provider_applications')
        .upsert({
          user_id: user.id,
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          location: values.location,
          provider_type: values.providerType,
          terms_accepted: values.termsAccepted,
          profile_photo: values.profilePhoto,
          gov_id_document: values.govIdDocument,
          business_registration: values.businessRegistration,
          portfolio_images: values.portfolioImages,
          professional_bio: values.professionalBio,
          areas_of_expertise: values.areasOfExpertise,
          languages: values.languages,
          years_experience: values.yearsExperience,
          services_offered: values.servicesOffered,
          base_price: values.basePrice,
          price_per_person: values.pricePerPerson,
          currency: values.currency,
          availability: values.availability,
          certifications: values.certifications,
          status: 'pending',
          updated_at: new Date().toISOString(),
          submitted_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setApplicationSubmitted(true);
      clearData(); // Clear persisted data on successful submission
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit your application",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (applicationSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Application Submitted!</CardTitle>
            <CardDescription className="text-center">
              Your application has been received. We'll review it and get back to you within 48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="mb-6">
              In the meantime, you can explore our resources for Service Providers or learn more about our platform.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" className="mr-4" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button onClick={() => navigate('/mafunzo')}>Explore Resources</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Apply to Become a Service Provider</CardTitle>
            <CardDescription>
              Join our community of passionate travel and culture professionals. Complete this application to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeStep} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="step1" onClick={() => setActiveStep('step1')}>
                  Account Creation
                </TabsTrigger>
                <TabsTrigger value="step2" onClick={() => setActiveStep('step2')}>
                  Profile & Verification
                </TabsTrigger>
                <TabsTrigger value="step3" onClick={() => setActiveStep('step3')}>
                  Service Details
                </TabsTrigger>
              </TabsList>
              <TabsContent value="step1">
                <ApplicationStep1 form={form} />
              </TabsContent>
              <TabsContent value="step2">
                <ApplicationStep2 form={form} />
              </TabsContent>
              <TabsContent value="step3">
                <ApplicationStep3 form={form} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={activeStep === 'step1' || isLoading}
                className="mr-2"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                onClick={saveDraft}
                disabled={isLoading}
              >
                Save Draft
              </Button>
            </div>
            <Button 
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : activeStep === 'step3' ? 'Submit Application' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
