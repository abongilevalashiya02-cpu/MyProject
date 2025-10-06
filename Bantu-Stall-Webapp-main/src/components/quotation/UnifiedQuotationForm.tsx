import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, MapPin, Clock, DollarSign, FileText, Star, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useFormPersistence, useManualFormPersistence } from '@/hooks/useFormPersistence';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { VenueType } from '@/types/venues';

interface UnifiedQuotationFormData {
  // Type Selection
  quotationType: 'standard' | 'group' | 'custom';
  
  // Basic Information
  retreat_goal: string;
  custom_goal: string;
  description: string;
  
  // Attendee Information
  attendee_count: string;
  group_composition: string;
  
  // Dates and Duration
  preferred_dates: Date[];
  alternative_dates: string;
  duration: string;
  flexibility: 'fixed' | 'flexible' | 'very-flexible';
  
  // Budget and Services
  budget_range: string;
  payment_preference: string;
  add_on_services: string[];
  catering_requirements: string;
  
  // Contact Information
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company_name: string;
  
  // Special Requirements
  special_requests: string;
  accessibility_needs: string;
  custom_requirements: string;
  priority_level: 'standard' | 'priority' | 'urgent';
}

interface UnifiedQuotationFormProps {
  venue?: VenueType;
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'standard' | 'group' | 'custom';
  mode?: 'navbar' | 'dashboard' | 'standalone';
  onGuestSubmit?: (formData: UnifiedQuotationFormData) => Promise<void>;
}

const FORM_PERSISTENCE_KEY = 'unified-quotation-form';

export const UnifiedQuotationForm: React.FC<UnifiedQuotationFormProps> = ({
  venue,
  isOpen,
  onClose,
  initialType = 'standard',
  mode = 'standalone',
  onGuestSubmit
}) => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultFormData: UnifiedQuotationFormData = {
    quotationType: initialType,
    retreat_goal: '',
    custom_goal: '',
    description: '',
    attendee_count: '',
    group_composition: '',
    preferred_dates: [],
    alternative_dates: '',
    duration: '',
    flexibility: 'fixed',
    budget_range: '',
    payment_preference: '',
    add_on_services: [],
    catering_requirements: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    company_name: '',
    special_requests: '',
    accessibility_needs: '',
    custom_requirements: '',
    priority_level: 'standard'
  };

  // Form state management with persistence
  const [formData, setFormData] = useState<UnifiedQuotationFormData>(defaultFormData);
  
  // Form persistence hook (for saving only)
  useFormPersistence(FORM_PERSISTENCE_KEY, formData, defaultFormData, currentStep);
  
  // Manual persistence controls
  const { loadData, clearData } = useManualFormPersistence<UnifiedQuotationFormData>(FORM_PERSISTENCE_KEY);
  
  // Load initial data on component mount
  useEffect(() => {
    const initialData = loadData(defaultFormData);
    setFormData(initialData);
    
    // Load saved step
    const savedStep = localStorage.getItem(`${FORM_PERSISTENCE_KEY}_step`);
    if (savedStep && parseInt(savedStep) !== currentStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Step persistence - removed duplicate useEffect

  const quotationTypes = [
    {
      id: 'standard',
      title: 'Standard Quote',
      description: 'For individual service requests or single destination retreats',
      icon: FileText,
      features: ['Basic venue booking', 'Standard amenities', 'Email support', 'Quick turnaround']
    },
    {
      id: 'group',
      title: 'Group Quote',
      description: 'For family, corporate, or group retreats with multiple members',
      icon: Users,
      features: ['Group discounts', 'Dedicated coordinator', 'Custom activities', 'Group amenities']
    },
    {
      id: 'custom',
      title: 'Custom Quote',
      description: 'Tailored options for spiritual retreats, multi-stop plans, special requests',
      icon: Star,
      features: ['Bespoke planning', 'Premium support', 'Flexible arrangements', 'Priority service']
    }
  ];

  const retreatGoals = {
    standard: [
      'Team Building', 'Strategy Planning', 'Executive Reset', 'Wellness Retreat',
      'Training Workshop', 'Celebration Event', 'Client Meeting', 'Other'
    ],
    group: [
      'Corporate Retreat', 'Family Reunion', 'Wedding Party', 'Conference',
      'Educational Trip', 'Cultural Exchange', 'Multi-generational Event', 'Other'
    ],
    custom: [
      'Spiritual Journey', 'Multi-destination Tour', 'Adventure Expedition',
      'Cultural Immersion', 'Research Expedition', 'Healing Retreat',
      'Personal Transformation', 'Completely Custom'
    ]
  };

  const addOnServices = [
    'Professional Photography', 'Videography', 'Shuttle Service',
    'Executive Coach', 'Activities Facilitator', 'Event Coordinator',
    'Cultural Experience Guide', 'Spa Services', 'Wellness Coach',
    'Team Building Specialist', 'Catering Upgrade', 'AV Equipment',
    'Translation Services', 'Security Services'
  ];

  const updateFormData = useCallback((updates: Partial<UnifiedQuotationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleServiceToggle = useCallback((service: string, checked: boolean) => {
    updateFormData({
      add_on_services: checked
        ? [...formData.add_on_services, service]
        : formData.add_on_services.filter(s => s !== service)
    });
  }, [formData.add_on_services, updateFormData]);

  const handleDateSelect = useCallback((dates: Date[] | undefined) => {
    updateFormData({ preferred_dates: dates || [] });
  }, [updateFormData]);

  const handleLinkedInSignIn = async () => {
    try {
      const { error } = await signIn('linkedin_oidc', '');
      
      if (error) {
        console.error("LinkedIn login error:", error);
        toast.error('LinkedIn login failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error("LinkedIn login error:", error);
      toast.error('LinkedIn login failed. Please try again.');
    }
  };

  const handleSubmit = async () => {
    // Handle guest submission
    if (!user && onGuestSubmit) {
      setIsSubmitting(true);
      try {
        await onGuestSubmit(formData);
        toast.success('Quotation request saved! Please sign in to submit and access your dashboard.');
        clearData();
        // Don't close the dialog - let GuestQuotationWrapper handle the sign-in prompt
      } catch (error) {
        console.error('Error saving guest quotation:', error);
        toast.error('Failed to save request. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!user) {
      toast.error('Please sign in to submit a quotation request');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create quotation data for submission
      const quotationData = {
        user_id: user.id,
        venue_id: venue?.id,
        venue_name: venue?.name || 'Custom Request',
        quotation_type: formData.quotationType,
        booking_type: formData.quotationType,
        retreat_goal: formData.retreat_goal,
        custom_goal: formData.custom_goal,
        description: formData.description,
        attendee_count: formData.attendee_count,
        group_composition: formData.group_composition,
        preferred_dates: formData.preferred_dates.map(d => format(d, 'yyyy-MM-dd')).join(', '),
        alternative_dates: formData.alternative_dates,
        duration: formData.duration,
        flexibility: formData.flexibility,
        budget_range: formData.budget_range,
        payment_preference: formData.payment_preference,
        add_on_services: formData.add_on_services,
        catering_requirements: formData.catering_requirements,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        company_name: formData.company_name,
        special_requests: formData.special_requests,
        accessibility_needs: formData.accessibility_needs,
        custom_requirements: formData.custom_requirements,
        priority_level: formData.priority_level,
        status: 'pending',
        service_type: 'venue' as const,
        submitted_at: new Date().toISOString()
      };

      // Insert into quotations table
      const { data, error } = await supabase
        .from('quotations')
        .insert({
          user_id: quotationData.user_id,
          status: 'draft',
          quotation_number: `QTN-${Date.now()}`,
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subtotal: 0,
          tax_amount: 0,
          total_amount: 0,
          client_notes: quotationData.special_requests
        })
        .select('id')
        .single();

      if (error) throw error;

      toast.success('Quotation request submitted successfully!');
      
      // Clear form data after successful submission
      clearData();
      
      onClose();

      // Redirect based on mode and user preference
        if (data && data.id) {
          if (mode === 'navbar') {
            navigate(`/quotations/dashboard?highlight=${data.id}`);
          } else {
            navigate(`/quotations/${data.id}`);
          }
        } else {
          navigate('/quotations/dashboard');
        }

    } catch (error) {
      console.error('Error submitting quotation request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    clearData();
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: // Type selection
        return !!formData.quotationType;
      case 2: // Basic info
        return !!(formData.retreat_goal && formData.attendee_count);
      case 3: // Dates and services
        return formData.preferred_dates.length > 0;
      case 4: // Contact info
        return !!(formData.contact_name && formData.contact_email);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderAuthRequired = () => (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Sign in to Continue</h3>
        <p className="text-muted-foreground mb-6">
          Access your personalized Retreat Planning Dashboard and track all your quotation requests
        </p>
        
        <Button 
          onClick={handleLinkedInSignIn}
          className="flex items-center justify-center w-full bg-[#0077B5] hover:bg-[#0077B5]/90 text-white"
          type="button"
        >
          <Linkedin className="mr-2 h-4 w-4" />
          Sign in with LinkedIn
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          After signing in, you'll be able to submit requests and manage your retreat planning in one place
        </p>
      </div>
    </div>
  );

  const renderTypeSelector = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Quotation Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quotationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                formData.quotationType === type.id ? "ring-2 ring-primary border-primary" : ""
              )}
              onClick={() => updateFormData({ quotationType: type.id as typeof formData.quotationType })}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">{type.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{type.description}</p>
                <div className="space-y-1">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="retreat_goal">Retreat Goal *</Label>
        <Select 
          value={formData.retreat_goal} 
          onValueChange={(value) => updateFormData({ retreat_goal: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your retreat goal" />
          </SelectTrigger>
          <SelectContent>
            {retreatGoals[formData.quotationType].map(goal => (
              <SelectItem key={goal} value={goal}>{goal}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(formData.retreat_goal === 'Other' || formData.retreat_goal === 'Completely Custom') && (
          <Input
            placeholder="Please specify your retreat goal"
            value={formData.custom_goal}
            onChange={(e) => updateFormData({ custom_goal: e.target.value })}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          placeholder="Describe your ideal retreat experience..."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="attendee_count">Number of Attendees *</Label>
          <Select 
            value={formData.attendee_count} 
            onValueChange={(value) => updateFormData({ attendee_count: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select group size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1-5 people</SelectItem>
              <SelectItem value="6-15">6-15 people</SelectItem>
              <SelectItem value="16-30">16-30 people</SelectItem>
              <SelectItem value="31-60">31-60 people</SelectItem>
              <SelectItem value="60+">60+ people</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select 
            value={formData.duration} 
            onValueChange={(value) => updateFormData({ duration: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="half-day">Half Day</SelectItem>
              <SelectItem value="full-day">Full Day</SelectItem>
              <SelectItem value="2-days">2 Days</SelectItem>
              <SelectItem value="3-days">3 Days</SelectItem>
              <SelectItem value="1-week">1 Week</SelectItem>
              <SelectItem value="custom">Custom Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.quotationType === 'group' && (
        <div className="space-y-2">
          <Label htmlFor="group_composition">Group Composition</Label>
          <Textarea
            placeholder="Describe your group (e.g., executives, families, students, etc.)"
            value={formData.group_composition}
            onChange={(e) => updateFormData({ group_composition: e.target.value })}
          />
        </div>
      )}
    </div>
  );

  const renderDateSelection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Preferred Dates *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.preferred_dates.length && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.preferred_dates.length > 0
                ? `${formData.preferred_dates.length} date(s) selected`
                : "Select preferred dates"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="multiple"
              selected={formData.preferred_dates}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {formData.preferred_dates.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Dates:</Label>
            <div className="flex flex-wrap gap-2">
              {formData.preferred_dates.map((date, index) => (
                <Badge key={index} variant="secondary">
                  {format(date, 'MMM dd, yyyy')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget_range">Budget Range</Label>
        <Select 
          value={formData.budget_range} 
          onValueChange={(value) => updateFormData({ budget_range: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-50k">Under R50,000</SelectItem>
            <SelectItem value="50k-100k">R50,000 - R100,000</SelectItem>
            <SelectItem value="100k-200k">R100,000 - R200,000</SelectItem>
            <SelectItem value="200k-500k">R200,000 - R500,000</SelectItem>
            <SelectItem value="500k-plus">R500,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Add-on Services</Label>
        <div className="grid grid-cols-2 gap-3">
          {addOnServices.map(service => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={formData.add_on_services.includes(service)}
                onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
              />
              <Label htmlFor={service} className="text-sm">{service}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name *</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => updateFormData({ contact_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateFormData({ contact_email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Phone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => updateFormData({ contact_phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">Company</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => updateFormData({ company_name: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_requests">Special Requests</Label>
        <Textarea
          id="special_requests"
          placeholder="Any special requirements or additional information..."
          value={formData.special_requests}
          onChange={(e) => updateFormData({ special_requests: e.target.value })}
          rows={3}
        />
      </div>

      {formData.quotationType === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="custom_requirements">Custom Requirements</Label>
          <Textarea
            id="custom_requirements"
            placeholder="Describe your custom requirements in detail..."
            value={formData.custom_requirements}
            onChange={(e) => updateFormData({ custom_requirements: e.target.value })}
            rows={4}
          />
        </div>
      )}
    </div>
  );

  const steps = [
    { title: 'Type', component: renderTypeSelector },
    { title: 'Details', component: renderBasicInfo },
    { title: 'Dates & Services', component: renderDateSelection },
    { title: 'Contact', component: renderContactInfo }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {venue ? `Get Quotation for ${venue.name}` : 'Request Quotation'}
          </DialogTitle>
          {!user && (
            <p className="text-sm text-muted-foreground mt-2">
              Sign in with LinkedIn to submit your quotation request and access your Retreat Planning Dashboard
            </p>
          )}
        </DialogHeader>

        {!user && mode !== 'navbar' ? renderAuthRequired() : (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      index + 1 <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium">{step.title}</span>
                  {index < steps.length - 1 && (
                    <div className="mx-4 h-px bg-border flex-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Form Content */}
            <div className="py-6">
              {steps[currentStep - 1].component()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1"
              >
                Cancel
              </Button>
              
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceedToNextStep()}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};