import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Phone, Mail, Clock, FileText, Send, ChevronDown, ChevronUp, CalendarIcon, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { useEmailService } from '@/services/emailService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import VenueSelection from './VenueSelection';
import Navbar from '@/components/Navbar';
import { DEFAULT_ROOM_RATES } from '@/utils/venuePricingUtils';
import type { VenueType } from '@/types/venues';
import { ServiceLineItem, formatServiceCost } from '@/utils/serviceCosting';
import StepServiceSelection from './steps/StepServiceSelection';

interface QuotationRequestData {
  // Company Info
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  
  // Step 1: Objectives & Outcomes
  event_objectives: string[];
  desired_outcomes: string[];
  additional_goals: string;
  
  // Step 2: Event Details
  attendee_count: number | null;
  event_duration: number | null;
  preferred_dates: string;
  budget_range: string;
  venue_type: string;
  requires_accommodation: boolean;
  standard_rooms: number | null;
  executive_rooms: number | null;
  presidential_rooms: number | null;
  accommodation_type: string; // Keep for backward compatibility
  special_requirements: string;
  
  // Step 3: Venue Selection
  selected_venue_id: string | null;
  selected_venue?: VenueType; // Store full venue object for pricing
  venue_preferences: string;
  location_preference: string;
  
  // Step 4: Services
  selected_services: string[]; // Deprecated, kept for backward compatibility
  selected_service_items: ServiceLineItem[]; // NEW: Detailed service items
  service_notes: string;
  catering_requirements: string;
  transportation_needs: string;
  
  // Pricing
  currency: string;
  current_step: number;
}

const STEPS = [
  { number: 1, title: 'Objectives & Outcomes', subtitle: 'Define your goals' },
  { number: 2, title: 'Event Details', subtitle: 'Specify your requirements' },
  { number: 3, title: 'Venue Selection', subtitle: 'Choose your location' },
  { number: 4, title: 'Services', subtitle: 'Select additional services' },
  { number: 5, title: 'Review', subtitle: 'Finalize your request' }
];

const EVENT_OBJECTIVES = [
  'Brand Repositioning',
  'Culture Building', 
  'Team Building',
  'Showcasing Thought Leadership',
  'Idea Mining',
  'Professional Development',
  'Insights Gathering',
  'Launching a New Product/Service',
  'Managing Through Disruption',
  'ESG + CSR Initiative'
];

const DESIRED_OUTCOMES = {
  personal_impact: {
    title: 'Personal Impact',
    description: 'Individual growth and self-discovery experiences',
    options: [
      'Experiences that support self-discovery or reflection',
      'Exposure to African heritage that sparks new thinking',
      'A sense of "this changed how I see myself and my role"',
      'Personal breakthrough moments',
      'Reflection spaces for big-picture thinking',
      'Guided storytelling that renews ambition and purpose'
    ]
  },
  cultural_social: {
    title: 'Cultural & Social Indicators',
    description: 'Heritage and cultural connection experiences',
    options: [
      'Shared memories that humanize the business relationship',
      'Curated VIP moments that say "you matter"',
      'Cultural tokens as mementos of partnership',
      'Cultural activities that reinforce corporate identity',
      'Experiences tied to ESG, heritage, or inclusion goals'
    ]
  },
  social_emotional: {
    title: 'Social & Emotional Response',
    description: 'Memorable moments that inspire sharing',
    options: [
      'Social sharing of experiences without being prompted',
      'Public testimonials from employees or clients',
      'Reposts, reels, or articles that reflect positive emotion'
    ]
  },
  business_team: {
    title: 'Business & Team Benefits',
    description: 'Tangible improvements in team dynamics and performance',
    options: [
      'Stronger interpersonal trust',
      'Breaking silos between departments',
      'Increased cross-cultural appreciation',
      'Re-engagement of remote/disconnected staff',
      'Inspired to innovate, collaborate, or lead better',
      '"I want to be better because of this trip"',
      '"I want others on my team to have this experience too"'
    ]
  },
  strategic_alignment: {
    title: 'Strategic Alignment',
    description: 'Reinforcement of company vision and values',
    options: [
      'Storytelling moments that reinforce company vision'
    ]
  }
};

const SERVICES = [
  'Team Building Activities',
  'Professional Facilitation',
  'Audio/Visual Equipment',
  'Photography & Videography',
  'Welcome Gifts & Swag',
  'Transportation Coordination',
  'Wellness Activities',
  'Cultural Experiences',
  'Entertainment',
  'Custom Workshops'
];

const CURRENCY_RATES = {
  ZAR: { symbol: 'R', rate: 1 },
  USD: { symbol: '$', rate: 0.054 },
  EUR: { symbol: '€', rate: 0.049 },
  GBP: { symbol: '£', rate: 0.043 }
};

const VENUE_TYPES = [
  { value: 'urban-conference', label: 'Urban Conference Center' },
  { value: 'bush-safari', label: 'Bush Lodge / Safari' },
  { value: 'beach-resort', label: 'Beach Resort' },
  { value: 'mountain-retreat', label: 'Mountain Retreat' },
  { value: 'wine-estate', label: 'Wine Estate' },
  { value: 'corporate-hotel', label: 'Corporate Hotel' },
  { value: 'boutique-venue', label: 'Boutique Venue' },
  { value: 'cultural-heritage', label: 'Cultural Heritage Site' }
];

const ROOM_RATES = {
  standard: 800,
  executive: 1500,
  presidential: 3500
};

// UUID validation helper
const isValidUUID = (str: string | null): boolean => {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const CorporateRetreatQuotation: React.FC = () => {
  const navigate = useNavigate();
  
  // Load form data from localStorage on component mount
  const loadFormData = (): QuotationRequestData => {
    try {
      const saved = localStorage.getItem('corporate-retreat-quotation');
      if (saved) {
        const loadedData = JSON.parse(saved);
        // Migrate old numeric venue IDs to null
        if (loadedData.selected_venue_id && !isValidUUID(loadedData.selected_venue_id)) {
          console.warn('Clearing invalid venue ID from localStorage:', loadedData.selected_venue_id);
          loadedData.selected_venue_id = null;
          loadedData.selected_venue = undefined;
          loadedData.venue_preferences = '';
          loadedData.location_preference = '';
          // Show notification after component mounts
          setTimeout(() => {
            toast('Your previously selected venue needs to be reselected due to a system update.', { icon: 'ℹ️' });
          }, 500);
        }
        return loadedData;
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
    }
    
    return {
      company_name: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      event_objectives: [],
      desired_outcomes: [],
      additional_goals: '',
      attendee_count: null,
      event_duration: null,
      preferred_dates: '',
      budget_range: '',
      venue_type: '',
      requires_accommodation: false,
      standard_rooms: null,
      executive_rooms: null,
      presidential_rooms: null,
      accommodation_type: '',
      special_requirements: '',
      selected_venue_id: null,
      venue_preferences: '',
      location_preference: '',
      selected_services: [],
      selected_service_items: [],
      service_notes: '',
      catering_requirements: '',
      transportation_needs: '',
      currency: 'ZAR',
      current_step: 1
    };
  };

  const [formData, setFormData] = useState<QuotationRequestData>(loadFormData());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedOutcomes, setExpandedOutcomes] = useState<{[key: string]: boolean}>({});
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('corporate-retreat-quotation', JSON.stringify(formData));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [formData]);
  const [realTimeCalculation, setRealTimeCalculation] = useState({
    venueOnlyCost: 0,
    accommodationCost: 0,
    venueTotal: 0,
    servicesTotal: 0,
    serviceBreakdown: [] as ServiceLineItem[],
    subtotal: 0,
    vat: 0,
    total: 0
  });

  // Real-time exchange rates
  const { rates, loading: ratesLoading } = useExchangeRates('ZAR');
  const { sendQuotationEmail } = useEmailService();

  // Real-time cost calculation with venue-specific pricing
  useEffect(() => {
    let venueOnlyCost = 0;
    let accommodationCost = 0;
    let servicesTotal = 0;

    // Venue cost calculation using venue-specific or type-based rates
    if (formData.attendee_count && formData.event_duration && formData.selected_venue) {
      // Parse venue pricing from pricingSnapshot
      const pricing = formData.selected_venue.pricingSnapshot;
      const zarMatch = pricing.match(/R\s*([\d,]+)(?:\s*-\s*R?\s*([\d,]+))?/);
      
      if (zarMatch) {
        const minPrice = parseInt(zarMatch[1].replace(/,/g, ''));
        const maxPrice = zarMatch[2] ? parseInt(zarMatch[2].replace(/,/g, '')) : minPrice;
        const avgPrice = Math.round((minPrice + maxPrice) / 2);
        
        // Determine if pricing is per room or per person
        const isPerRoom = pricing.toLowerCase().includes('per room');
        
        if (isPerRoom) {
          // Estimate rooms needed (2 people per room)
          const estimatedRooms = Math.ceil(formData.attendee_count / 2);
          venueOnlyCost = avgPrice * estimatedRooms * formData.event_duration;
        } else {
          // Per person pricing
          venueOnlyCost = avgPrice * formData.attendee_count * formData.event_duration;
        }
      } else {
        // Fallback to base rate
        venueOnlyCost = formData.attendee_count * formData.event_duration * 1500;
      }
    }

    // Accommodation cost calculation using venue-type specific rates
    if (formData.requires_accommodation && formData.event_duration && formData.venue_type) {
      const rates = DEFAULT_ROOM_RATES[formData.venue_type] || DEFAULT_ROOM_RATES['corporate-hotel'];
      const standardCost = (formData.standard_rooms || 0) * rates.standard * formData.event_duration;
      const executiveCost = (formData.executive_rooms || 0) * rates.executive * formData.event_duration;
      const presidentialCost = (formData.presidential_rooms || 0) * rates.presidential * formData.event_duration;
      accommodationCost = standardCost + executiveCost + presidentialCost;
    }

    // Dynamic services cost calculation from detailed service items
    const serviceItems = formData.selected_service_items || [];
    servicesTotal = serviceItems.reduce((total, item) => total + item.subtotal, 0);

    const venueTotal = venueOnlyCost + accommodationCost;
    const subtotal = venueTotal + servicesTotal;
    const vat = subtotal * 0.15; // 15% VAT
    const total = subtotal + vat;

    setRealTimeCalculation({
      venueOnlyCost,
      accommodationCost,
      venueTotal,
      servicesTotal,
      serviceBreakdown: serviceItems,
      subtotal,
      vat,
      total
    });
  }, [
    formData.attendee_count, 
    formData.event_duration, 
    formData.selected_service_items,
    formData.requires_accommodation,
    formData.standard_rooms,
    formData.executive_rooms,
    formData.presidential_rooms,
    formData.selected_venue,
    formData.venue_type
  ]);

  // Format currency with real-time exchange rates
  const formatCurrencyRealTime = (amount: number) => {
    if (ratesLoading || !rates[formData.currency]) {
      return formatCurrency(amount);
    }
    
    const convertedAmount = amount * rates[formData.currency];
    const symbols = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[formData.currency as keyof typeof symbols] || '';
    
    return `${symbol}${convertedAmount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Enhanced email handler

  const handleEmailQuote = async () => {
    try {
      // Send quote via email using the edge function
      const { data, error } = await supabase.functions.invoke('quotation-notification', {
        body: {
          type: 'quote_request',
          quote_data: {
            contactName: formData.contact_name,
            contactEmail: formData.contact_email,
            contactPhone: formData.contact_phone,
            companyName: formData.company_name,
            retreatGoal: formData.event_objectives.join(', '),
            groupSize: formData.attendee_count,
            preferredDates: formData.preferred_dates || 'TBD',
            duration: formData.event_duration ? `${formData.event_duration} days` : 'TBD',
            locationPreference: formData.location_preference || 'TBD',
            budgetRange: formData.budget_range || 'TBD',
            accommodationType: formData.accommodation_type || 'TBD',
            selectedVenue: formData.selected_venue_id,
            activities: formData.selected_services || [],
            cateringPreferences: formData.catering_requirements ? [formData.catering_requirements] : [],
            specialRequests: formData.additional_goals || '',
            totalAmount: realTimeCalculation.total,
            currency: formData.currency,
            costBreakdown: {
              venueOnlyCost: realTimeCalculation.venueOnlyCost,
              accommodationCost: realTimeCalculation.accommodationCost,
              venueTotal: realTimeCalculation.venueTotal,
              servicesTotal: realTimeCalculation.servicesTotal,
              subtotal: realTimeCalculation.subtotal,
              vat: realTimeCalculation.vat,
              total: realTimeCalculation.total
            }
          }
        }
      });

      if (error) throw error;
      
      toast.success('Quote has been sent to your email address!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again.');
    }
  };

  const handleNext = () => {
    if (formData.current_step < 5) {
      setFormData(prev => ({ ...prev, current_step: prev.current_step + 1 }));
    }
  };

  const handlePrevious = () => {
    if (formData.current_step > 1) {
      setFormData(prev => ({ ...prev, current_step: prev.current_step - 1 }));
    }
  };

  const handleCheckboxChange = (field: 'event_objectives' | 'desired_outcomes' | 'selected_services', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const toggleOutcomeCategory = (categoryKey: string) => {
    setExpandedOutcomes(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const formatCurrency = (amount: number, currency: string = formData.currency) => {
    const rate = CURRENCY_RATES[currency as keyof typeof CURRENCY_RATES];
    const convertedAmount = amount * rate.rate;
    return `${rate.symbol}${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getBudgetOptions = () => {
    const currency = formData.currency as keyof typeof CURRENCY_RATES;
    const rate = CURRENCY_RATES[currency].rate;
    const symbol = CURRENCY_RATES[currency].symbol;
    
    return [
      { value: `Less than ${symbol}${(50000 * rate).toLocaleString()}`, label: `Less than ${symbol}${(50000 * rate).toLocaleString()}` },
      { value: `${symbol}${(50000 * rate).toLocaleString()}-${symbol}${(100000 * rate).toLocaleString()}`, label: `${symbol}${(50000 * rate).toLocaleString()} - ${symbol}${(100000 * rate).toLocaleString()}` },
      { value: `${symbol}${(100000 * rate).toLocaleString()}-${symbol}${(250000 * rate).toLocaleString()}`, label: `${symbol}${(100000 * rate).toLocaleString()} - ${symbol}${(250000 * rate).toLocaleString()}` },
      { value: `${symbol}${(250000 * rate).toLocaleString()}-${symbol}${(500000 * rate).toLocaleString()}`, label: `${symbol}${(250000 * rate).toLocaleString()} - ${symbol}${(500000 * rate).toLocaleString()}` },
      { value: `${symbol}${(500000 * rate).toLocaleString()}+`, label: `${symbol}${(500000 * rate).toLocaleString()}+` },
      { value: 'custom', label: 'Custom (discuss with team)' }
    ];
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.event_objectives.length > 0 && formData.desired_outcomes.length > 0;
      case 2:
        return formData.attendee_count && formData.event_duration && formData.budget_range && formData.venue_type;
      case 3:
        if (!formData.selected_venue_id) return false;
        if (!formData.requires_accommodation) return true;
        const hasRooms = (formData.standard_rooms || 0) + (formData.executive_rooms || 0) + (formData.presidential_rooms || 0) > 0;
        return hasRooms;
      case 5:
        return formData.contact_name && formData.contact_email;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to submit a quotation request.');
        setIsSubmitting(false);
        return;
      }

      const { data: quotationData, error } = await supabase
        .from('quotation_requests')
        .insert([{
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          event_objectives: formData.event_objectives,
          desired_outcomes: formData.desired_outcomes,
          additional_goals: formData.additional_goals,
          attendee_count: formData.attendee_count,
          event_duration: formData.event_duration,
          preferred_dates: formData.preferred_dates,
          budget_range: formData.budget_range,
          venue_type: formData.venue_type,
          requires_accommodation: formData.requires_accommodation,
          standard_rooms: formData.standard_rooms,
          executive_rooms: formData.executive_rooms,
          presidential_rooms: formData.presidential_rooms,
          accommodation_type: formData.accommodation_type,
          special_requirements: formData.special_requirements,
          selected_venue_id: isValidUUID(formData.selected_venue_id) ? formData.selected_venue_id : null,
          venue_preferences: formData.venue_preferences,
          location_preference: formData.location_preference,
          selected_services: formData.selected_services,
          catering_requirements: formData.catering_requirements,
          transportation_needs: formData.transportation_needs,
          currency: formData.currency,
          current_step: formData.current_step,
          user_id: user.id,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          quote_valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subtotal: realTimeCalculation.subtotal,
          vat_amount: realTimeCalculation.vat,
          total_amount: realTimeCalculation.total
        }])
        .select()
        .single();

      if (error) throw error;

      // Insert service items if any
      if (formData.selected_service_items && formData.selected_service_items.length > 0) {
        const serviceItems = formData.selected_service_items.map(item => ({
          quotation_id: quotationData.id,
          service_catalog_id: item.serviceId,
          service_name: item.serviceName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          duration_hours: item.pricingModel === 'hourly' ? item.duration : null,
          duration_days: item.pricingModel === 'daily' ? item.duration : null,
          attendee_count: item.attendeeCount,
          subtotal: item.subtotal,
          notes: item.notes
        }));

        const { error: serviceError } = await supabase
          .from('quotation_service_items')
          .insert(serviceItems);

        if (serviceError) {
          console.error('Error inserting service items:', serviceError);
        }
      }

      // Send automated emails with PDF via edge function
      const { data: emailData, error: emailError } = await supabase.functions.invoke('quotation-notification', {
        body: {
          type: 'quote_request',
          quote_data: {
            contactName: formData.contact_name,
            contactEmail: formData.contact_email,
            contactPhone: formData.contact_phone,
            companyName: formData.company_name,
            retreatGoal: formData.event_objectives.join(', '),
            groupSize: formData.attendee_count,
            preferredDates: formData.preferred_dates || 'TBD',
            duration: formData.event_duration ? `${formData.event_duration} days` : 'TBD',
            locationPreference: formData.location_preference || 'TBD',
            budgetRange: formData.budget_range || 'TBD',
            accommodationType: formData.accommodation_type || 'TBD',
            selectedVenue: formData.selected_venue_id,
            activities: formData.selected_services || [],
            cateringPreferences: formData.catering_requirements ? [formData.catering_requirements] : [],
            specialRequests: formData.additional_goals || '',
            totalAmount: realTimeCalculation.total,
            currency: formData.currency,
            costBreakdown: {
              venueOnlyCost: realTimeCalculation.venueOnlyCost,
              accommodationCost: realTimeCalculation.accommodationCost,
              venueTotal: realTimeCalculation.venueTotal,
              servicesTotal: realTimeCalculation.servicesTotal,
              subtotal: realTimeCalculation.subtotal,
              vat: realTimeCalculation.vat,
              total: realTimeCalculation.total
            }
          }
        }
      });

      if (emailError) throw emailError;

      // Also sync to HubSpot CRM
      await supabase.functions.invoke('hubspot-sync', {
        body: {
          type: 'contact',
          email: formData.contact_email,
          data: {
            email: formData.contact_email,
            name: formData.contact_name,
            phone: formData.contact_phone,
            company: formData.company_name,
            source: 'quotation_request'
          }
        }
      });

      // Create a deal in HubSpot
      await supabase.functions.invoke('hubspot-sync', {
        body: {
          type: 'deal',
          email: formData.contact_email,
          data: {
            service_type: 'Corporate Retreat',
            company: formData.company_name,
            budget_range: formData.budget_range,
            total_amount: realTimeCalculation.total
          }
        }
      });

      toast.success('Your quotation request has been submitted successfully! Check your email for the detailed quote.');
      
      // Clear saved form data and reset form
      localStorage.removeItem('corporate-retreat-quotation');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard?section=quotations');
      }, 2000);
      setFormData({
        company_name: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        event_objectives: [],
        desired_outcomes: [],
        additional_goals: '',
        attendee_count: null,
        event_duration: null,
        preferred_dates: '',
        budget_range: '',
        venue_type: '',
        requires_accommodation: false,
        standard_rooms: null,
        executive_rooms: null,
        presidential_rooms: null,
        accommodation_type: '',
        special_requirements: '',
        selected_venue_id: null,
        venue_preferences: '',
        location_preference: '',
        selected_services: [],
        selected_service_items: [],
        service_notes: '',
        catering_requirements: '',
        transportation_needs: '',
        currency: 'ZAR',
        current_step: 1
      });
    } catch (error) {
      console.error('Error submitting quotation request:', error);
      toast.error('Failed to submit quotation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOutcomeTitle = (outcomeKey: string) => {
    return DESIRED_OUTCOMES[outcomeKey as keyof typeof DESIRED_OUTCOMES]?.title || outcomeKey.replace('_', ' ');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Corporate Retreat Quotation</h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-sm text-muted-foreground">Currency:</span>
            <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ZAR">R ZAR</SelectItem>
                <SelectItem value="USD">$ USD</SelectItem>
                <SelectItem value="EUR">€ EUR</SelectItem>
                <SelectItem value="GBP">£ GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center min-w-fit">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${formData.current_step >= step.number 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'}
                  `}>
                    {step.number}
                  </div>
                  <div className="ml-2 text-sm">
                    <div className={formData.current_step >= step.number ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                      {step.title}
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${formData.current_step > step.number ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Step {formData.current_step} of {STEPS.length}
                </CardTitle>
                <h2 className="text-2xl font-bold">{STEPS[formData.current_step - 1].title}</h2>
                <p className="text-muted-foreground">{STEPS[formData.current_step - 1].subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={formData.current_step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formData.current_step === 1 && (
                      <div className="space-y-8">
                        {/* Event Objectives */}
                        <div>
                          <Label className="text-base font-semibold flex items-center gap-2">
                            Event Objectives <span className="text-destructive">*</span>
                          </Label>
                          <p className="text-sm text-muted-foreground mb-4">Select all objectives that apply to your event (required)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {EVENT_OBJECTIVES.map((objective) => (
                              <div key={objective} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  id={objective}
                                  checked={formData.event_objectives.includes(objective)}
                                  onCheckedChange={(checked) => 
                                    handleCheckboxChange('event_objectives', objective, checked as boolean)
                                  }
                                />
                                <Label htmlFor={objective} className="text-sm cursor-pointer flex-1">{objective}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Desired Event Outcomes */}
                        <div>
                          <Label className="text-base font-semibold flex items-center gap-2">
                            Desired Event Outcomes <span className="text-destructive">*</span>
                          </Label>
                          <p className="text-sm text-muted-foreground mb-4">Select the outcomes you want to achieve (required)</p>
                          <div className="space-y-4">
                            {Object.entries(DESIRED_OUTCOMES).map(([categoryKey, category]) => (
                              <Card key={categoryKey} className="border-2 border-border">
                                <Collapsible 
                                  open={expandedOutcomes[categoryKey]} 
                                  onOpenChange={() => toggleOutcomeCategory(categoryKey)}
                                >
                                  <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <CardTitle className="text-lg">{category.title}</CardTitle>
                                          <p className="text-sm text-muted-foreground">{category.description}</p>
                                        </div>
                                        {expandedOutcomes[categoryKey] ? 
                                          <ChevronUp className="h-5 w-5" /> : 
                                          <ChevronDown className="h-5 w-5" />
                                        }
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <CardContent className="pt-0">
                                      <div className="space-y-3">
                                        {category.options.map((option) => (
                                          <div key={option} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/25 transition-colors">
                                            <Checkbox
                                              id={`${categoryKey}-${option}`}
                                              checked={formData.desired_outcomes.includes(option)}
                                              onCheckedChange={(checked) => 
                                                handleCheckboxChange('desired_outcomes', option, checked as boolean)
                                              }
                                              className="mt-0.5"
                                            />
                                            <Label htmlFor={`${categoryKey}-${option}`} className="text-sm cursor-pointer leading-relaxed">
                                              {option}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </CollapsibleContent>
                                </Collapsible>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Tell Us What We Missed */}
                        <div>
                          <Label htmlFor="additional_goals" className="text-base font-semibold">Tell Us What We Missed</Label>
                          <p className="text-sm text-muted-foreground mb-3">Optional - Is there anything else you'd like to add about your goals or expected outcomes?</p>
                          <Textarea
                            id="additional_goals"
                            value={formData.additional_goals}
                            onChange={(e) => setFormData(prev => ({ ...prev, additional_goals: e.target.value }))}
                            placeholder="Is there anything else you'd like to add about your goals or expected outcomes?"
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {formData.current_step === 2 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="attendee_count" className="flex items-center gap-2">
                              Number of Attendees <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="attendee_count"
                              type="number"
                              value={formData.attendee_count || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, attendee_count: parseInt(e.target.value) || null }))}
                              placeholder="e.g. 25"
                              className="mt-1"
                            />
                          </div>
                           <div>
                             <Label className="flex items-center gap-2">
                               Event Dates <span className="text-destructive">*</span>
                             </Label>
                             <div className="grid grid-cols-2 gap-2">
                               <div>
                                 <Label className="text-sm text-muted-foreground">Start Date</Label>
                                 <Popover>
                                   <PopoverTrigger asChild>
                                     <Button
                                       variant="outline"
                                       className={cn(
                                         "w-full justify-start text-left font-normal",
                                         !startDate && "text-muted-foreground"
                                       )}
                                     >
                                       <CalendarIcon className="mr-2 h-4 w-4" />
                                       {startDate ? format(startDate, "PPP") : "Start date"}
                                     </Button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-auto p-0" align="start">
                                     <Calendar
                                       mode="single"
                                       selected={startDate}
                                       onSelect={(date) => {
                                         setStartDate(date);
                                         if (date && endDate) {
                                           const days = Math.ceil((endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                           setFormData(prev => ({ 
                                             ...prev, 
                                             event_duration: days,
                                             preferred_dates: `${format(date, "PPP")} - ${format(endDate, "PPP")}`
                                           }));
                                         } else if (date) {
                                           setFormData(prev => ({ 
                                             ...prev, 
                                             event_duration: 1,
                                             preferred_dates: format(date, "PPP")
                                           }));
                                         }
                                       }}
                                        disabled={(date) => {
                                          const today = new Date();
                                          today.setHours(0, 0, 0, 0);
                                          return date < today;
                                        }}
                                       initialFocus
                                       className="p-3 pointer-events-auto"
                                     />
                                   </PopoverContent>
                                 </Popover>
                               </div>
                               <div>
                                 <Label className="text-sm text-muted-foreground">End Date (Optional)</Label>
                                 <Popover>
                                   <PopoverTrigger asChild>
                                     <Button
                                       variant="outline"
                                       className={cn(
                                         "w-full justify-start text-left font-normal",
                                         !endDate && "text-muted-foreground"
                                       )}
                                     >
                                       <CalendarIcon className="mr-2 h-4 w-4" />
                                       {endDate ? format(endDate, "PPP") : "End date"}
                                     </Button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-auto p-0" align="start">
                                     <Calendar
                                       mode="single"
                                       selected={endDate}
                                       onSelect={(date) => {
                                         setEndDate(date);
                                         if (date && startDate) {
                                           const days = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                           setFormData(prev => ({ 
                                             ...prev, 
                                             event_duration: days,
                                             preferred_dates: `${format(startDate, "PPP")} - ${format(date, "PPP")}`
                                           }));
                                         } else if (date && !startDate) {
                                           setFormData(prev => ({ 
                                             ...prev, 
                                             preferred_dates: format(date, "PPP")
                                           }));
                                         }
                                       }}
                                        disabled={(date) => {
                                          const today = new Date();
                                          today.setHours(0, 0, 0, 0);
                                          return date < today || (startDate && date < startDate);
                                        }}
                                       initialFocus
                                       className="p-3 pointer-events-auto"
                                     />
                                   </PopoverContent>
                                 </Popover>
                               </div>
                             </div>
                           </div>
                        </div>


                        <div>
                          <Label htmlFor="budget_range" className="flex items-center gap-2">
                            Budget Range <span className="text-destructive">*</span>
                          </Label>
                          <Select value={formData.budget_range} onValueChange={(value) => setFormData(prev => ({ ...prev, budget_range: value }))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select your budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              {getBudgetOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Venue Type Selection */}
                        <div>
                          <Label className="flex items-center gap-2 mb-3">
                            Venue Preference <span className="text-destructive">*</span>
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {VENUE_TYPES.map((venue) => (
                              <button
                                key={venue.value}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    venue_type: prev.venue_type === venue.value ? '' : venue.value,
                                    selected_venue_id: null // Reset venue when type changes
                                  }));
                                }}
                                className={cn(
                                  "px-4 py-3 rounded-full text-sm font-medium transition-all duration-200",
                                  "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                  formData.venue_type === venue.value
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-card text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
                                )}
                              >
                                {venue.label}
                              </button>
                            ))}
                          </div>
                        </div>

                         <div>
                           <Label htmlFor="special_requirements">Special Requirements</Label>
                           <Textarea
                             id="special_requirements"
                             value={formData.special_requirements}
                             onChange={(e) => setFormData(prev => ({ ...prev, special_requirements: e.target.value }))}
                             placeholder="Dietary restrictions, accessibility needs, etc."
                             rows={3}
                             className="mt-1"
                           />
                         </div>
                      </div>
                    )}

                    {formData.current_step === 3 && (
                      <VenueSelection
                        formData={formData}
                        setFormData={setFormData}
                        formatCurrency={formatCurrency}
                      />
                    )}

                    {formData.current_step === 4 && (
                      <StepServiceSelection
                        formData={formData}
                        updateFormData={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
                      />
                    )}

                    {formData.current_step === 5 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="contact_name" className="flex items-center gap-2">
                                Contact Name <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="contact_name"
                                value={formData.contact_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                                placeholder="Your full name"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="company_name">Company Name</Label>
                              <Input
                                id="company_name"
                                value={formData.company_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                                placeholder="Your company"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contact_email" className="flex items-center gap-2">
                                Email Address <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                placeholder="your.email@company.com"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="contact_phone">Phone Number</Label>
                              <Input
                                id="contact_phone"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                                placeholder="+27 12 345 6789"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Request Summary</h3>
                          <div className="space-y-4">
                            <div>
                              <strong>Event Objectives:</strong>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {formData.event_objectives.map(obj => (
                                  <Badge key={obj} variant="secondary">{obj}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <strong>Desired Outcomes:</strong>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {formData.desired_outcomes.map(outcome => (
                                  <Badge key={outcome} variant="outline">{outcome}</Badge>
                                ))}
                              </div>
                            </div>
                            {formData.attendee_count && (
                              <div><strong>Attendees:</strong> {formData.attendee_count}</div>
                            )}
                            {formData.event_duration && (
                              <div><strong>Duration:</strong> {formData.event_duration} days</div>
                            )}
                            {formData.budget_range && (
                              <div><strong>Budget:</strong> {formData.budget_range}</div>
                            )}
                            {formData.location_preference && (
                              <div><strong>Location:</strong> {formData.location_preference}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={formData.current_step === 1}
                  >
                    Previous
                  </Button>
                  
                  {formData.current_step < 5 ? (
                    <Button 
                      onClick={handleNext}
                      disabled={!validateStep(formData.current_step)}
                    >
                      Continue to {STEPS[formData.current_step].title}
                    </Button>
                  ) : (
                     <Button 
                       onClick={handleSubmit} 
                       disabled={!validateStep(5) || isSubmitting}
                       className="bg-orange-500 hover:bg-orange-600 text-white"
                     >
                       {isSubmitting ? 'Submitting...' : 'Submit Request'}
                       <Send className="ml-2 h-4 w-4" />
                     </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quote Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company</div>
                  <div>{formData.company_name || 'Not specified'}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Attendees</div>
                    <div>{formData.attendee_count || '-'}</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Duration</div>
                    <div>{formData.event_duration ? `${formData.event_duration} days` : '-'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Selected Venue</div>
                  <div className="text-sm">{formData.location_preference || 'Not selected'}</div>
                </div>

                <Separator />

                 <div>
                   <h4 className="font-semibold mb-2">Real-time Cost Breakdown</h4>
                   <div className="space-y-3 text-sm">
                     {/* Venue Cost */}
                     <div>
                       <div className="flex justify-between font-medium">
                         <span>Venue Cost</span>
                         <span>{formatCurrencyRealTime(realTimeCalculation.venueOnlyCost)}</span>
                       </div>
                       {formData.selected_venue && formData.attendee_count && formData.event_duration && (
                         <div className="text-xs text-muted-foreground ml-4 mt-1">
                           └ {formData.selected_venue.name}
                           <br />
                           └ {formData.attendee_count} attendees × {formData.event_duration} days
                         </div>
                       )}
                     </div>
                     
                     {/* Accommodation Cost */}
                     {formData.requires_accommodation ? (
                       <div>
                         <div className="flex justify-between font-medium">
                           <span>Accommodation</span>
                           <span>{formatCurrencyRealTime(realTimeCalculation.accommodationCost)}</span>
                         </div>
                         {formData.event_duration && (formData.standard_rooms || formData.executive_rooms || formData.presidential_rooms) && (
                           <div className="text-xs text-muted-foreground ml-4 mt-1 space-y-0.5">
                             {formData.standard_rooms && formData.standard_rooms > 0 && (
                               <div>
                                 └ {formData.standard_rooms} Standard × R{DEFAULT_ROOM_RATES[formData.venue_type]?.standard.toLocaleString() || '800'} × {formData.event_duration} nights
                               </div>
                             )}
                             {formData.executive_rooms && formData.executive_rooms > 0 && (
                               <div>
                                 └ {formData.executive_rooms} Executive × R{DEFAULT_ROOM_RATES[formData.venue_type]?.executive.toLocaleString() || '1,500'} × {formData.event_duration} nights
                               </div>
                             )}
                             {formData.presidential_rooms && formData.presidential_rooms > 0 && (
                               <div>
                                 └ {formData.presidential_rooms} Presidential × R{DEFAULT_ROOM_RATES[formData.venue_type]?.presidential.toLocaleString() || '3,500'} × {formData.event_duration} nights
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                     ) : (
                       <div className="flex justify-between text-muted-foreground">
                         <span>Accommodation</span>
                         <span>Not Required</span>
                       </div>
                     )}
                     
                      {/* Services Cost */}
                      <div>
                        <div className="flex justify-between font-medium">
                          <span>Services</span>
                          <span>{formatCurrencyRealTime(realTimeCalculation.servicesTotal)}</span>
                        </div>
                        {realTimeCalculation.serviceBreakdown && realTimeCalculation.serviceBreakdown.length > 0 && (
                          <div className="text-xs text-muted-foreground ml-4 mt-2 space-y-1">
                            {realTimeCalculation.serviceBreakdown.map((service, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>└ {service.serviceName}</span>
                                <span>{formatServiceCost(service.subtotal)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                     
                     <Separator />
                     
                     <div className="flex justify-between">
                       <span>Subtotal</span>
                       <span>{formatCurrencyRealTime(realTimeCalculation.subtotal)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>VAT (15%)</span>
                       <span>{formatCurrencyRealTime(realTimeCalculation.vat)}</span>
                     </div>
                     <Separator />
                     <div className="flex justify-between font-semibold text-lg">
                       <span>Total Estimate</span>
                       <span className="text-primary">{formatCurrencyRealTime(realTimeCalculation.total)}</span>
                     </div>
                     {!ratesLoading && rates[formData.currency] && (
                       <div className="text-xs text-muted-foreground">
                         Live exchange rate applied • Updated real-time
                       </div>
                     )}
                   </div>
                 </div>

                <Separator />

                  <div className="space-y-2">
                                  <Button 
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
                                    onClick={handleEmailQuote}
                                    disabled={!formData.contact_name || !formData.contact_email}
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Email Quote
                                  </Button>
                  </div>

                <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  Quote valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Need Assistance?</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Our corporate retreat specialists are here to help you create the perfect experience.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href="tel:+27613972802" className="text-primary hover:underline">
                        +27 61 397 2802
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href="mailto:nontombi@bantustall.com" className="text-primary hover:underline">
                        nontombi@bantustall.com
                      </a>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Why Choose Bantu Stall?</h4>
                  <div className="space-y-1 text-xs">
                    <div>✓ 100% Secure & Trusted</div>
                    <div>✓ Award-Winning Service</div>
                    <div>✓ 500+ Corporate Clients</div>
                    <div>✓ 24/7 Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};