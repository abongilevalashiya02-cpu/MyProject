import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { z } from 'zod';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { Calendar, Clock, MapPin, Users, CreditCard, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalStore } from '@/stores/globalStore';
import { useLocationServices } from '@/hooks/useLocationServices';
import { emailService } from '@/services/emailService';
import { cn } from '@/lib/utils';

// Enhanced booking schema with validation
const bookingSchema = z.object({
  experienceId: z.string().min(1, 'Please select an experience'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date().optional(),
  numberOfGuests: z.number().min(1, 'At least 1 guest required').max(50, 'Maximum 50 guests allowed'),
  accommodationType: z.enum(['standard', 'premium', 'luxury'], {
    required_error: 'Please select accommodation type',
  }),
  mealPlan: z.enum(['none', 'breakfast', 'half-board', 'full-board'], {
    required_error: 'Please select meal plan',
  }),
  transportation: z.enum(['none', 'airport-transfer', 'full-transport'], {
    required_error: 'Please select transportation',
  }),
  specialRequests: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name required'),
    phone: z.string().min(1, 'Emergency contact phone required'),
    relationship: z.string().min(1, 'Relationship required'),
  }),
  meetingPoint: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  preferredLanguage: z.string().default('english'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Experience {
  id: string;
  title: string;
  type: 'retreat' | 'excursion' | 'workshop' | 'package';
  duration: number; // days
  maxCapacity: number;
  basePrice: number;
  location: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  availableDates: Date[];
  inclusions: string[];
  requirements?: string[];
}

interface BookingFormProps {
  experience: Experience;
  onSubmit?: (data: BookingFormData) => void;
  onSuccess?: (bookingId: string) => void;
  className?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  experience,
  onSubmit,
  onSuccess,
  className
}) => {
  const FORM_KEY = `booking-form-${experience.id}`;
  
  const defaultFormValues: BookingFormData = {
    experienceId: experience.id,
    startDate: new Date(),
    numberOfGuests: 1,
    accommodationType: 'standard',
    mealPlan: 'breakfast',
    transportation: 'airport-transfer',
    preferredLanguage: 'english',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    specialRequests: '',
    meetingPoint: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
  };

  const { loadInitialData, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  const { user } = useAuth();
  const { addNotification, addBooking, setLoading } = useGlobalStore();
  const { getCurrentLocation, reverseGeocode } = useLocationServices();
  
  const [step, setStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(experience.basePrice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [distanceToVenue, setDistanceToVenue] = useState<number | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: loadInitialData(),
  });

  // Auto-save form data whenever it changes
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues);

  const watchedValues = form.watch();

  // Get user location on mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await getCurrentLocation();
        const address = await reverseGeocode(position.latitude, position.longitude);
        const locationString = address.city && address.country 
          ? `${address.city}, ${address.country}` 
          : 'Location detected';
        setUserLocation(locationString);
        
        // Calculate distance to venue if coordinates available
        if (experience.location.coordinates) {
          const distance = calculateDistance(
            position.latitude,
            position.longitude,
            experience.location.coordinates.lat,
            experience.location.coordinates.lng
          );
          setDistanceToVenue(distance);
        }
      } catch (error) {
        console.error('Failed to get user location:', error);
      }
    };

    getUserLocation();
  }, [getCurrentLocation, reverseGeocode, experience.location.coordinates]);

  // Calculate total price based on selections
  useEffect(() => {
    let price = experience.basePrice * watchedValues.numberOfGuests;
    
    // Accommodation pricing
    const accommodationMultiplier = {
      standard: 1,
      premium: 1.3,
      luxury: 1.6,
    };
    price *= accommodationMultiplier[watchedValues.accommodationType] || 1;
    
    // Meal plan pricing
    const mealPlanPricing = {
      none: 0,
      breakfast: 25,
      'half-board': 45,
      'full-board': 75,
    };
    price += (mealPlanPricing[watchedValues.mealPlan] || 0) * watchedValues.numberOfGuests * experience.duration;
    
    // Transportation pricing
    const transportationPricing = {
      none: 0,
      'airport-transfer': 50,
      'full-transport': 150,
    };
    price += transportationPricing[watchedValues.transportation] || 0;
    
    setTotalPrice(Math.round(price));
  }, [watchedValues, experience.basePrice, experience.duration]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSubmit = async (data: BookingFormData) => {
    if (!user) {
      addNotification({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to make a booking',
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Create booking object
      const booking = {
        id: `booking_${Date.now()}`,
        userId: user.id,
        experienceId: data.experienceId,
        experience: {
          title: experience.title,
          type: experience.type,
          location: experience.location,
        },
        dates: {
          start: data.startDate,
          end: data.endDate || addDays(data.startDate, experience.duration),
        },
        guests: data.numberOfGuests,
        accommodation: data.accommodationType,
        mealPlan: data.mealPlan,
        transportation: data.transportation,
        totalPrice,
        status: 'pending' as const,
        specialRequests: data.specialRequests,
        emergencyContact: {
          name: data.emergencyContact?.name || '',
          phone: data.emergencyContact?.phone || '',
          relationship: data.emergencyContact?.relationship || ''
        },
        userLocation,
        distanceToVenue,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to global store
      addBooking(booking);

      // Send confirmation email
      await emailService.sendBookingConfirmation({
        id: booking.id,
        user: {
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.email!,
        },
        experience: booking.experience,
        preferredDate: format(booking.dates.start, 'MMM dd, yyyy'),
        participantCount: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
        specialRequests: booking.specialRequests
      });

      addNotification({
        type: 'success',
        title: 'Booking Submitted!',
        message: 'Your booking has been submitted successfully. Check your email for confirmation.',
      });

      clearData(); // Clear persisted data on successful submission
      onSubmit?.(data);
      onSuccess?.(booking.id);

    } catch (error) {
      console.error('Booking submission error:', error);
      addNotification({
        type: 'error',
        title: 'Booking Failed',
        message: 'There was an error submitting your booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      isBefore(date, new Date()) ||
                      !experience.availableDates.some(d => 
                        format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={experience.maxCapacity}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="accommodationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accommodation</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium (+30%)</SelectItem>
                  <SelectItem value="luxury">Luxury (+60%)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Plan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No Meals</SelectItem>
                  <SelectItem value="breakfast">Breakfast Only (+$25/day)</SelectItem>
                  <SelectItem value="half-board">Half Board (+$45/day)</SelectItem>
                  <SelectItem value="full-board">Full Board (+$75/day)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transportation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transportation</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transportation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No Transportation</SelectItem>
                  <SelectItem value="airport-transfer">Airport Transfer (+$50)</SelectItem>
                  <SelectItem value="full-transport">Full Transport (+$150)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="emergencyContact.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergencyContact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="emergencyContact.relationship"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relationship</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., Spouse, Parent, Friend" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dietaryRestrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dietary Restrictions (Optional)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Please describe any dietary restrictions, allergies, or special meal requirements..."
                className="h-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accessibilityNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accessibility Needs (Optional)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Please describe any accessibility requirements or mobility assistance needed..."
                className="h-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requests (Optional)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Any special requests, celebrations, or additional information..."
                className="h-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Experience Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Experience:</span> {experience.title}</p>
                <p><span className="font-medium">Location:</span> {experience.location.city}, {experience.location.country}</p>
                <p><span className="font-medium">Duration:</span> {experience.duration} days</p>
                <p><span className="font-medium">Start Date:</span> {watchedValues.startDate ? format(watchedValues.startDate, 'PPP') : 'Not selected'}</p>
                <p><span className="font-medium">Guests:</span> {watchedValues.numberOfGuests}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Your Selections</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Accommodation:</span> {watchedValues.accommodationType}</p>
                <p><span className="font-medium">Meal Plan:</span> {watchedValues.mealPlan}</p>
                <p><span className="font-medium">Transportation:</span> {watchedValues.transportation}</p>
                {userLocation && (
                  <p><span className="font-medium">Your Location:</span> {userLocation}</p>
                )}
                {distanceToVenue && (
                  <p><span className="font-medium">Distance to Venue:</span> {Math.round(distanceToVenue)} km</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Price:</span>
              <span className="text-2xl font-bold text-bantu-orange">${totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              For {watchedValues.numberOfGuests} guest{watchedValues.numberOfGuests !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const steps = [
    { number: 1, title: "Experience & Dates", icon: Calendar },
    { number: 2, title: "Details & Preferences", icon: Users },
    { number: 3, title: "Review & Book", icon: CreditCard },
  ];

  const progressPercentage = (step / steps.length) * 100;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Book Your Experience</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {experience.location.city}
          </Badge>
        </div>
        
        {/* Progress indicator */}
        <div className="space-y-4">
          <Progress value={progressPercentage} className="w-full" />
          <div className="flex justify-between">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.number}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    step >= s.number ? "text-bantu-orange" : "text-gray-400"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      step >= s.number ? "bg-bantu-orange text-white" : "bg-gray-200"
                    )}
                  >
                    {step > s.number ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="hidden md:inline">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between pt-6 border-t">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              
              <div className="ml-auto">
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && (!watchedValues.startDate || !watchedValues.numberOfGuests)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-bantu-orange hover:bg-bantu-orange/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Booking...
                      </>
                    ) : (
                      `Book Now - $${totalPrice.toLocaleString()}`
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
