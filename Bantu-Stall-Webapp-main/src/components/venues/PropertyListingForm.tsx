
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput } from '@/utils/security';
import { useAuth } from '@/hooks/useAuth';
import { Building, Eye, Save } from 'lucide-react';
import { propertyListingSchema, PropertyListingFormData } from './forms/propertyListingSchema';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useFormValidation } from '@/hooks/useFormValidation';
import { LoadingButton } from '@/components/ui/loading-button';
import BasicInfoSection from './forms/BasicInfoSection';
import CapacitySection from './forms/CapacitySection';
import PricingSection from './forms/PricingSection';
import ContactSection from './forms/ContactSection';
import AmenitiesSection from './forms/AmenitiesSection';
import FeaturesSection from './forms/FeaturesSection';
import EnhancedInfoSection from './forms/EnhancedInfoSection';
import MediaUploadSection from './forms/MediaUploadSection';
import FormProgress from './forms/FormProgress';
import PropertyListingPreview from './PropertyListingPreview';

interface PropertyListingFormProps {
  onClose: () => void;
}

const PropertyListingForm: React.FC<PropertyListingFormProps> = ({ onClose }) => {
  const FORM_KEY = 'property-listing-form';
  
  const defaultFormValues: PropertyListingFormData = {
    propertyName: '',
    propertyType: '',
    location: '',
    area: '',
    proximityToLandmark: '',
    description: '',
    minCapacity: 0,
    maxCapacity: 0,
    totalRooms: 0,
    meetingRooms: 0,
    priceRangeUSD: '',
    priceRangeZAR: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    activities: '',
    amenities: [],
    accessibility: [],
    uniqueSellingPoints: '',
    bookingFlexibility: '',
    preferredGuestTypes: [],
    languagesSpoken: [],
    marketingSource: '',
    ecoFriendly: false,
    luxury: false,
    indoorFocus: false,
    outdoorFocus: false,
    csrAlignment: false,
    specialRequests: '',
  };

  const { loadInitialData, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('form');
  const { supabase: supabaseClient } = useAuth();
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<PropertyListingFormData>({
    resolver: zodResolver(propertyListingSchema),
    defaultValues: loadInitialData(),
  });

  const { 
    completedSections, 
    currentStep, 
    isFormComplete, 
    requiredSections,
    getFieldError,
    validateField 
  } = useFormValidation(form);

  // Auto-save form data whenever it changes
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues);

  // Auto-save notification every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(form.formState.dirtyFields).length > 0) {
        toast.success('Draft saved automatically', { duration: 2000 });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [form.formState.dirtyFields]);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...selectedAmenities, amenity]
      : selectedAmenities.filter(a => a !== amenity);
    setSelectedAmenities(newAmenities);
    form.setValue('amenities', newAmenities);
  };

  const saveDraft = async () => {
    setIsDraftSaving(true);
    try {
      // Simulate draft save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Draft saved successfully!');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsDraftSaving(false);
    }
  };

  const onSubmit = async (data: PropertyListingFormData) => {
    setIsSubmitting(true);
    setUploading(true);
    let uploadedUrls: string[] = [];
    
    try {
      // 1. Upload files to Supabase Storage (if any)
      if (mediaFiles.length > 0 && supabaseClient) {
        const uploadPromises = mediaFiles.map(async (file) => {
          const ext = file.name.split('.').pop();
          const filePath = `property-media/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('property-media')
            .upload(filePath, file, { upsert: false });
          if (uploadError) throw uploadError;
          // Get public URL
          const { data: urlData } = supabaseClient.storage
            .from('property-media')
            .getPublicUrl(filePath);
          return urlData.publicUrl;
        });
        uploadedUrls = await Promise.all(uploadPromises);
      }
      setUploading(false);

      // 2. Save to DB with user_id
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      // Prepare data with proper array handling and input sanitization
      const propertyData = {
        user_id: user?.id || null,
        property_name: sanitizeInput(data.propertyName),
        property_type: sanitizeInput(data.propertyType),
        location: sanitizeInput(data.location),
        area: sanitizeInput(data.area),
        proximity_to_landmark: sanitizeInput(data.proximityToLandmark),
        description: sanitizeInput(data.description),
        min_capacity: parseInt(data.minCapacity?.toString() || '0'),
        max_capacity: parseInt(data.maxCapacity?.toString() || '0'),
        total_rooms: parseInt(data.totalRooms?.toString() || '0'),
        meeting_rooms: parseInt(data.meetingRooms?.toString() || '0'),
        price_range_usd: data.priceRangeUSD,
        price_range_zar: data.priceRangeZAR,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        website_url: data.websiteUrl || null,
        activities: data.activities,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        accessibility: Array.isArray(data.accessibility) ? data.accessibility : [],
        unique_selling_points: data.uniqueSellingPoints || null,
        booking_flexibility: data.bookingFlexibility || null,
        preferred_guest_types: Array.isArray(data.preferredGuestTypes) ? data.preferredGuestTypes : [],
        languages_spoken: Array.isArray(data.languagesSpoken) ? data.languagesSpoken : [],
        marketing_source: data.marketingSource || null,
        eco_friendly: Boolean(data.ecoFriendly),
        luxury: Boolean(data.luxury),
        indoor_focus: Boolean(data.indoorFocus),
        outdoor_focus: Boolean(data.outdoorFocus),
        csr_alignment: Boolean(data.csrAlignment),
        special_requests: data.specialRequests || null,
        media_urls: uploadedUrls,
        status: 'pending',
      };

      console.log('Submitting property data:', propertyData);

      const { error } = await supabase
        .from('property_listings')
        .insert([propertyData]);

      if (error) {
        console.error('Supabase insert error:', error);
        toast.error(`Failed to submit property listing. Error: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // Email notifications are handled automatically by database trigger

      toast.success('Property listing submitted successfully! We will review and contact you within 7 business days.');
      clearData(); // Clear persisted data on successful submission
      onClose();
    } catch (error) {
      setUploading(false);
      console.error('Error submitting property listing:', error);
      toast.error('Failed to submit property listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          List Your Property
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Submit your venue for review. Our team will verify your listing within 7 business days, 
          after which you can start receiving bookings through our platform.
        </p>
      </CardHeader>
      <CardContent>
        <FormProgress 
          currentStep={currentStep}
          totalSteps={4}
          completedSections={completedSections}
          requiredSections={requiredSections}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Form
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="mt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <MediaUploadSection files={mediaFiles} setFiles={setMediaFiles} />
              <BasicInfoSection form={form} />
              <CapacitySection form={form} />
              <PricingSection form={form} />
              <ContactSection form={form} />
              <AmenitiesSection 
                form={form} 
                selectedAmenities={selectedAmenities}
                onAmenityChange={handleAmenityChange}
              />
              <EnhancedInfoSection form={form} />
              <FeaturesSection form={form} />

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 pt-6 border-t">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <LoadingButton
                    type="button"
                    variant="secondary"
                    onClick={saveDraft}
                    loading={isDraftSaving}
                    loadingText="Saving..."
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </LoadingButton>
                </div>
                
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  loadingText="Submitting..."
                  disabled={!isFormComplete && !isSubmitting}
                  className="min-w-[140px]"
                >
                  Submit for Review
                </LoadingButton>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-6">
            <PropertyListingPreview formData={formData} />
            <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                onClick={form.handleSubmit(onSubmit)}
                loading={isSubmitting}
                loadingText="Submitting..."
                disabled={!isFormComplete && !isSubmitting}
                className="min-w-[140px]"
              >
                Submit for Review
              </LoadingButton>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyListingForm;
