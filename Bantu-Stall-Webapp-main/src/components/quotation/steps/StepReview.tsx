import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, User, Mail, Phone, Building, Calendar, 
  DollarSign, Users, Clock, MapPin, Utensils
} from 'lucide-react';

interface FormData {
  eventType: string;
  attendeeCount: string;
  duration: string;
  objectives: string[];
  selectedServices: string[];
  venuePreference: string;
  cateringRequirements: string;
  preferredDates: string;
  flexibility: string;
  budgetRange: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  specialRequests: string;
}

interface StepReviewProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SERVICE_LABELS: Record<string, string> = {
  venue: 'Venue Booking',
  catering: 'Catering Services',
  facilitator: 'Professional Facilitator',
  av_equipment: 'AV Equipment',
  photography: 'Photography',
  transportation: 'Transportation',
  wifi_internet: 'High-Speed Internet',
  wellness: 'Wellness Activities',
  recreation: 'Recreation Facilities'
};

export default function StepReview({ 
  formData, 
  updateFormData, 
  onSubmit, 
  isSubmitting 
}: StepReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Review Your Request
        </h3>
        <p className="text-muted-foreground">
          Please review your information before submitting. You can go back to make changes if needed.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium">Event Type:</span>
                <p className="text-sm text-muted-foreground">{formData.eventType}</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formData.attendeeCount} attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formData.duration} days</span>
              </div>
            </div>
            
            {formData.objectives.length > 0 && (
              <div>
                <span className="text-sm font-medium">Objectives:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.objectives.map((objective) => (
                    <Badge key={objective} variant="secondary" className="text-xs">
                      {objective}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services & Venue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Services & Venue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium">Selected Services:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.selectedServices.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {SERVICE_LABELS[service] || service}
                  </Badge>
                ))}
              </div>
            </div>
            
            {formData.venuePreference && (
              <div>
                <span className="text-sm font-medium">Venue Preference:</span>
                <p className="text-sm text-muted-foreground">{formData.venuePreference}</p>
              </div>
            )}
            
            {formData.cateringRequirements && (
              <div>
                <span className="text-sm font-medium">Catering Requirements:</span>
                <p className="text-sm text-muted-foreground">{formData.cateringRequirements}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Dates & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Preferred Dates:</span>
                <p className="text-sm text-muted-foreground">{formData.preferredDates}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Budget Range:</span>
                <p className="text-sm text-muted-foreground">{formData.budgetRange}</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Date Flexibility:</span>
              <p className="text-sm text-muted-foreground capitalize">{formData.flexibility.replace('-', ' ')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formData.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formData.contactEmail}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formData.contactPhone}</span>
                </div>
              )}
              {formData.companyName && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formData.companyName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests">Any Special Requests or Additional Information?</Label>
        <Textarea
          placeholder="Any specific requirements, accessibility needs, or other details we should know about..."
          value={formData.specialRequests}
          onChange={(e) => updateFormData({ specialRequests: e.target.value })}
          rows={3}
          className="mt-2"
        />
      </div>

      {/* Terms & Submit */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Ready to Submit</h4>
              <p className="text-sm text-green-700 mt-1">
                By submitting this request, you agree to our terms of service. 
                We'll process your request and send you a detailed quotation within 24 hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}