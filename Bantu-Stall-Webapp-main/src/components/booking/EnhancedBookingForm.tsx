import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calculator,
  Shield,
  Globe,
  Phone,
  Mail,
  Building,
  Target
} from 'lucide-react';

const bookingSchema = z.object({
  retreatName: z.string().min(3, 'Retreat name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  capacity: z.number().min(5, 'Minimum capacity is 5 people').max(500, 'Maximum capacity is 500 people'),
  budget: z.number().min(1000, 'Minimum budget is $1,000'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(10, 'Valid phone number is required'),
  companyName: z.string().min(2, 'Company name is required'),
  specialRequirements: z.string().optional(),
  cateringPreferences: z.string().optional(),
  accommodationType: z.enum(['basic', 'standard', 'premium', 'luxury']),
  activityPreferences: z.array(z.string()).min(1, 'Select at least one activity'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface EnhancedBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  initialData?: Partial<BookingFormData>;
  editMode?: boolean;
}

const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  editMode = false
}) => {
  const FORM_KEY = 'enhanced-booking-form';
  
  const defaultFormValues: BookingFormData = {
    retreatName: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    capacity: 20,
    budget: 10000,
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    specialRequirements: '',
    cateringPreferences: '',
    accommodationType: 'standard',
    activityPreferences: [],
  };

  const { loadInitialData, loadInitialStep, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(() => editMode ? 1 : loadInitialStep(1));
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: editMode 
      ? {
          retreatName: initialData?.retreatName || '',
          description: initialData?.description || '',
          location: initialData?.location || '',
          startDate: initialData?.startDate || '',
          endDate: initialData?.endDate || '',
          capacity: initialData?.capacity || 20,
          budget: initialData?.budget || 10000,
          contactEmail: initialData?.contactEmail || '',
          contactPhone: initialData?.contactPhone || '',
          companyName: initialData?.companyName || '',
          specialRequirements: initialData?.specialRequirements || '',
          cateringPreferences: initialData?.cateringPreferences || '',
          accommodationType: initialData?.accommodationType || 'standard',
          activityPreferences: initialData?.activityPreferences || [],
        }
      : loadInitialData(),
  });

  // Auto-save form data and step whenever they change (only if not in edit mode)
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues, currentStep, editMode ? [] : [currentStep]);

  const watchedValues = form.watch();
  
  // Calculate estimated cost based on form values
  useEffect(() => {
    const baseRate = {
      basic: 150,
      standard: 250,
      premium: 400,
      luxury: 650
    };
    
    const days = watchedValues.startDate && watchedValues.endDate 
      ? Math.ceil((new Date(watchedValues.endDate).getTime() - new Date(watchedValues.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 1;
    
    const cost = (baseRate[watchedValues.accommodationType] || 250) * 
                  (watchedValues.capacity || 20) * 
                  Math.max(days, 1) * 
                  (1 + (watchedValues.activityPreferences?.length || 0) * 0.1);
    
    setEstimatedCost(cost);
  }, [watchedValues]);

  const totalSteps = 4;
  const stepProgress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast({
        title: editMode ? "Retreat Updated" : "Retreat Created",
        description: editMode ? "Your retreat has been updated successfully." : "Your retreat booking request has been submitted.",
      });
      
      if (!editMode) {
        clearData(); // Clear persisted data on successful submission (but not in edit mode)
      }
      
      onClose();
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldsForStep = (step: number): (keyof BookingFormData)[] => {
    switch (step) {
      case 1:
        return ['retreatName', 'description', 'location'];
      case 2:
        return ['startDate', 'endDate', 'capacity', 'budget'];
      case 3:
        return ['contactEmail', 'contactPhone', 'companyName'];
      case 4:
        return ['accommodationType', 'activityPreferences'];
      default:
        return [];
    }
  };

  const stepTitles = [
    'Basic Information',
    'Dates & Capacity',
    'Contact Details',
    'Preferences & Activities'
  ];

  const activityOptions = [
    'Team Building Exercises',
    'Leadership Workshops',
    'Mindfulness & Meditation',
    'Outdoor Adventures',
    'Cultural Experiences',
    'Skills Training',
    'Strategic Planning',
    'Wellness Programs',
    'Creative Workshops',
    'Networking Events'
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-bantu-orange to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {editMode ? 'Edit Retreat' : 'Create New Retreat'}
              </h2>
              <p className="text-orange-100 mt-1">
                Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
          <div className="mt-4">
            <Progress value={stepProgress} className="h-2 bg-orange-700" />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="retreatName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Retreat Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Annual Leadership Summit 2024"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retreat Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the purpose, goals, and expected outcomes of your retreat..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Preferred Location
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Cape Town, South Africa"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Start Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              End Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Number of Participants
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="5"
                                max="500"
                                className="h-12"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Budget (USD)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1000"
                                className="h-12"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calculator className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Estimated Cost</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          ${estimatedCost.toLocaleString()}
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          Based on your selections. Final quote may vary.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Additional steps would continue here... */}
              </AnimatePresence>
            </form>
          </Form>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-bantu-orange hover:bg-orange-600"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {editMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editMode ? 'Update Retreat' : 'Create Retreat'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedBookingForm;
