import React, { useState, useCallback } from 'react';
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
import { CalendarIcon, Users, MapPin, Clock, DollarSign, FileText, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalStore } from '@/stores/globalStore';
import { useQuotationStore } from '@/stores/globalStore';
import { supabase } from '@/integrations/supabase/client';
import { useEmailService } from '@/services/emailService';
import { VenueType } from '@/types/venues';

interface QuotationFormProps {
  venue?: VenueType;
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'standard' | 'group' | 'custom';
}

export const QuotationForm: React.FC<QuotationFormProps> = ({
  venue,
  isOpen,
  onClose,
  initialType = 'standard'
}) => {
  const { user } = useAuth();
  const { addNotification } = useGlobalStore();
  const { addQuotation } = useQuotationStore();
  const { sendQuotationEmail } = useEmailService();
  
  const [quotationType, setQuotationType] = useState<'standard' | 'group' | 'custom'>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  const [formData, setFormData] = useState({
    // Basic Information
    retreat_goal: '',
    custom_goal: '',
    description: '',
    
    // Attendee Information
    attendee_count: '',
    group_composition: '',
    special_requirements: '',
    
    // Dates and Duration
    preferred_dates: '',
    alternative_dates: '',
    duration: '',
    flexibility: 'fixed',
    
    // Budget and Services
    budget_range: '',
    payment_preference: '',
    add_on_services: [] as string[],
    catering_requirements: '',
    
    // Contact Information
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    company_name: '',
    
    // Special Requests
    special_requests: '',
    accessibility_needs: '',
    
    // Custom Quotation Specific
    custom_requirements: '',
    priority_level: 'standard'
  });

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

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleServiceToggle = useCallback((service: string, checked: boolean) => {
    updateFormData({
      add_on_services: checked
        ? [...formData.add_on_services, service]
        : formData.add_on_services.filter(s => s !== service)
    });
  }, [formData.add_on_services, updateFormData]);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      const isSelected = selectedDates.some(d => 
        d.toDateString() === date.toDateString()
      );
      
      if (isSelected) {
        setSelectedDates(prev => prev.filter(d => 
          d.toDateString() !== date.toDateString()
        ));
      } else {
        setSelectedDates(prev => [...prev, date]);
      }
    }
  }, [selectedDates]);

  const handleSubmit = async () => {
    if (!user) {
      addNotification({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please sign in to submit a quotation request'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const quotationData = {
        user_id: user.id,
        venue_id: venue?.id,
        venue_name: venue?.name || 'Custom Request',
        quotation_type: quotationType,
        booking_type: quotationType, // Add missing required field
        retreat_goal: formData.retreat_goal,
        custom_goal: formData.custom_goal,
        description: formData.description,
        attendee_count: formData.attendee_count,
        group_composition: formData.group_composition,
        preferred_dates: selectedDates.map(d => format(d, 'yyyy-MM-dd')).join(', '),
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

      const { error } = await supabase
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
        });

      if (error) throw error;

      // Create properly formatted quotation for the global store
      const storeQuotation = {
        id: `quotation_${Date.now()}`,
        userId: user.id,
        type: quotationType,
        status: 'submitted' as const,
        basicInfo: {
          title: `${quotationType} Retreat Request`,
          description: formData.description,
          destination: venue?.name || 'Custom Location',
          duration: parseInt(formData.duration),
          groupSize: parseInt(formData.attendee_count),
          preferredDates: selectedDates
        },
        requirements: {
          accommodation: formData.catering_requirements || '',
          transportation: 'TBD',
          activities: formData.add_on_services || [],
          dietaryRestrictions: formData.catering_requirements,
          specialRequests: formData.special_requests
        },
        budget: {
          min: 0,
          max: 0,
          currency: 'USD'
        },
        contactInfo: {
          name: formData.contact_name,
          email: formData.contact_email,
          phone: formData.contact_phone,
          organization: formData.company_name
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to local store
      addQuotation(storeQuotation);

      // Send confirmation email with proper format
      const emailData = {
        id: storeQuotation.id,
        venue_name: venue?.name || 'Custom Request',
        retreat_goal: formData.retreat_goal,
        attendee_count: formData.attendee_count,
        preferred_dates: selectedDates.map(d => format(d, 'MMM dd, yyyy')).join(', '),
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        special_requests: formData.special_requests,
        status: 'submitted'
      };
      
      await sendQuotationEmail(emailData);

      addNotification({
        type: 'success',
        title: 'Quotation Submitted',
        message: `Your ${quotationType} quotation request has been submitted successfully!`
      });

      onClose();
      resetForm();
      
    } catch (error) {
      console.error('Error submitting quotation:', error);
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to submit quotation request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      retreat_goal: '',
      custom_goal: '',
      description: '',
      attendee_count: '',
      group_composition: '',
      special_requirements: '',
      preferred_dates: '',
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
    });
    setSelectedDates([]);
    setCurrentStep(1);
  };

  const renderQuotationTypeSelector = () => (
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
                quotationType === type.id ? "ring-2 ring-bantu-orange border-bantu-orange" : ""
              )}
              onClick={() => setQuotationType(type.id as typeof quotationType)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-bantu-orange" />
                  <CardTitle className="text-sm">{type.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 mb-3">{type.description}</p>
                <div className="space-y-1">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-bantu-orange rounded-full mr-2" />
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
            {retreatGoals[quotationType].map(goal => (
              <SelectItem key={goal} value={goal}>{goal}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.retreat_goal === 'Other' || formData.retreat_goal === 'Completely Custom' && (
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

      {quotationType === 'group' && (
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
      <h4 className="font-medium">Preferred Dates</h4>
      <div className="flex flex-col space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDates.length && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDates.length > 0
                ? `${selectedDates.length} date(s) selected`
                : "Select preferred dates"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => setSelectedDates(dates || [])}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {selectedDates.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Dates:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedDates.map((date, index) => (
                <Badge key={index} variant="secondary">
                  {format(date, 'MMM dd, yyyy')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="alternative_dates">Alternative Dates (optional)</Label>
          <Input
            placeholder="Any alternative dates or date ranges"
            value={formData.alternative_dates}
            onChange={(e) => updateFormData({ alternative_dates: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="flexibility">Date Flexibility</Label>
          <Select 
            value={formData.flexibility} 
            onValueChange={(value) => updateFormData({ flexibility: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Dates</SelectItem>
              <SelectItem value="flexible">Flexible (±3 days)</SelectItem>
              <SelectItem value="very-flexible">Very Flexible (±1 week)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderServicesAndBudget = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Additional Services</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {addOnServices.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={formData.add_on_services.includes(service)}
                onCheckedChange={(checked) => 
                  handleServiceToggle(service, checked as boolean)
                }
              />
              <Label htmlFor={service} className="text-sm">
                {service}
              </Label>
            </div>
          ))}
        </div>
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
            <SelectItem value="under-5k">Under $5,000</SelectItem>
            <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
            <SelectItem value="100k+">$100,000+</SelectItem>
            <SelectItem value="discuss">Prefer to discuss</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="catering_requirements">Catering Requirements</Label>
        <Textarea
          placeholder="Dietary restrictions, meal preferences, special occasions..."
          value={formData.catering_requirements}
          onChange={(e) => updateFormData({ catering_requirements: e.target.value })}
        />
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name *</Label>
          <Input
            value={formData.contact_name}
            onChange={(e) => updateFormData({ contact_name: e.target.value })}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Email *</Label>
          <Input
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateFormData({ contact_email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Phone Number</Label>
          <Input
            value={formData.contact_phone}
            onChange={(e) => updateFormData({ contact_phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">Company/Organization</Label>
          <Input
            value={formData.company_name}
            onChange={(e) => updateFormData({ company_name: e.target.value })}
            placeholder="Your organization name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_requests">Special Requests</Label>
        <Textarea
          placeholder="Any special requirements, accessibility needs, or additional information..."
          value={formData.special_requests}
          onChange={(e) => updateFormData({ special_requests: e.target.value })}
        />
      </div>

      {quotationType === 'custom' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="custom_requirements">Custom Requirements</Label>
            <Textarea
              placeholder="Detailed custom requirements for your bespoke experience..."
              value={formData.custom_requirements}
              onChange={(e) => updateFormData({ custom_requirements: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority_level">Priority Level</Label>
            <Select 
              value={formData.priority_level} 
              onValueChange={(value) => updateFormData({ priority_level: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return formData.retreat_goal && formData.attendee_count;
      case 2: return selectedDates.length > 0;
      case 3: return true; // Optional step
      case 4: return formData.contact_name && formData.contact_email;
      default: return false;
    }
  };

  const steps = [
    { id: 1, title: 'Basic Info', component: renderBasicInfo },
    { id: 2, title: 'Dates', component: renderDateSelection },
    { id: 3, title: 'Services & Budget', component: renderServicesAndBudget },
    { id: 4, title: 'Contact', component: renderContactInfo }
  ];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create {quotationType.charAt(0).toUpperCase() + quotationType.slice(1)} Quotation
            {venue && ` - ${venue.name}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 0 ? (
            <>
              {renderQuotationTypeSelector()}
              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(1)}
                  className="bg-bantu-orange hover:bg-bantu-orange/90"
                >
                  Continue
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center",
                      index < steps.length - 1 ? "flex-1" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        currentStep >= step.id
                          ? "bg-bantu-orange text-white"
                          : "bg-gray-200 text-gray-600"
                      )}
                    >
                      {step.id}
                    </div>
                    <span className="ml-2 text-sm font-medium">{step.title}</span>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-4",
                          currentStep > step.id ? "bg-bantu-orange" : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div className="min-h-[400px]">
                {steps.find(step => step.id === currentStep)?.component()}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6 border-t">
                <div className="flex space-x-2">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setQuotationType(initialType)}
                  >
                    Change Type
                  </Button>
                </div>

                <div className="flex space-x-2">
                  {currentStep < steps.length ? (
                    <Button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      disabled={!canProceedToNextStep()}
                      className="bg-bantu-orange hover:bg-bantu-orange/90"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceedToNextStep() || isSubmitting}
                      className="bg-bantu-orange hover:bg-bantu-orange/90"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Quotation'}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
