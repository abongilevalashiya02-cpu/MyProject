
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, User, Users, Heart, MapPin, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSecureFormSubmission } from '@/hooks/useSecureFormSubmission';
import SecurityCaptcha from '@/components/security/SecurityCaptcha';
import EnhancedFormValidator from '@/utils/enhancedSecurity';

interface BookingFormProps {
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const { submitForm, isSubmitting } = useSecureFormSubmission({
    formType: 'smoke_thunder_booking',
    maxSubmissions: 2,
    windowMinutes: 60,
    validateData: true,
    enableSuspiciousDetection: true
  });

  const validator = new EnhancedFormValidator({
    enableDataValidation: true,
    maxFieldLength: 500
  });
  const [formData, setFormData] = useState({
    // Package Selection
    packageType: '',
    capeTownAddon: false,
    
    // Primary Traveler Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    
    // Partner Information (if couple)
    partnerFirstName: '',
    partnerLastName: '',
    partnerEmail: '',
    partnerPhone: '',
    partnerDateOfBirth: '',
    partnerNationality: '',
    partnerPassportNumber: '',
    partnerPassportExpiry: '',
    
    // Travel Preferences
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Accommodation Preferences
    roomPreferences: '',
    specialRequests: '',
    
    // Travel Insurance
    hasInsurance: false,
    insuranceProvider: '',
    
    // Additional Information
    howHeardAbout: '',
    additionalComments: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.packageType || !formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Security validation
    if (!captchaVerified) {
      toast({
        title: "Security Check Required",
        description: "Please complete the security verification.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced form validation
    const fieldTypes = {
      firstName: 'name',
      lastName: 'name',
      email: 'email',
      phone: 'phone',
      nationality: 'name',
      passportNumber: 'passport',
      partnerEmail: 'email',
      partnerPhone: 'phone'
    };

    const validation = validator.validateForm(formData, fieldTypes);
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.fieldErrors).flat();
      toast({
        title: "Form Validation Failed",
        description: errorMessages.join(', '),
        variant: "destructive",
      });
      return;
    }

    if (validation.securityIssues.length > 0) {
      console.warn('Security issues detected:', validation.securityIssues);
      toast({
        title: "Security Issue Detected",
        description: "Please review your input and try again.",
        variant: "destructive",
      });
      return;
    }

    const result = await submitForm(validation.sanitizedData, async (sanitizedData) => {
      // Get current user to associate booking
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('smoke_thunder_bookings')
        .insert({
          user_id: user?.id || null,
          package_type: sanitizedData.packageType,
          cape_town_addon: sanitizedData.capeTownAddon,
          first_name: sanitizedData.firstName,
          last_name: sanitizedData.lastName,
          email: sanitizedData.email,
          phone: sanitizedData.phone || null,
          date_of_birth: sanitizedData.dateOfBirth || null,
          nationality: sanitizedData.nationality || null,
          passport_number: sanitizedData.passportNumber || null,
          passport_expiry: sanitizedData.passportExpiry || null,
          partner_first_name: sanitizedData.partnerFirstName || null,
          partner_last_name: sanitizedData.partnerLastName || null,
          partner_email: sanitizedData.partnerEmail || null,
          partner_phone: sanitizedData.partnerPhone || null,
          partner_date_of_birth: sanitizedData.partnerDateOfBirth || null,
          partner_nationality: sanitizedData.partnerNationality || null,
          partner_passport_number: sanitizedData.partnerPassportNumber || null,
          partner_passport_expiry: sanitizedData.partnerPassportExpiry || null,
          dietary_restrictions: sanitizedData.dietaryRestrictions || null,
          accessibility_needs: sanitizedData.accessibilityNeeds || null,
          emergency_contact_name: sanitizedData.emergencyContactName || null,
          emergency_contact_phone: sanitizedData.emergencyContactPhone || null,
          emergency_contact_relation: sanitizedData.emergencyContactRelation || null,
          room_preferences: sanitizedData.roomPreferences || null,
          special_requests: sanitizedData.specialRequests || null,
          has_insurance: sanitizedData.hasInsurance,
          insurance_provider: sanitizedData.insuranceProvider || null,
          how_heard_about: sanitizedData.howHeardAbout || null,
          additional_comments: sanitizedData.additionalComments || null
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    });

    if (result.success) {
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your details and process your booking.",
      });
      onClose();
    }
  };

  const isCouple = formData.packageType === 'couple' || formData.packageType === 'vic-falls-couple';
  const isVicFallsOnly = formData.packageType === 'vic-falls-individual' || formData.packageType === 'vic-falls-couple';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-bantu-orange">Book Your Smoke That Thunders Experience</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Package Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Select Your Package</h3>
              <RadioGroup
                value={formData.packageType}
                onValueChange={(value) => handleInputChange('packageType', value)}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="vic-falls-individual" id="vic-falls-individual" />
                  <Label htmlFor="vic-falls-individual" className="flex items-center gap-2 cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Victoria Falls Only - $3,500</div>
                      <div className="text-sm text-gray-500">Individual package, Victoria Falls experience only</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="vic-falls-couple" id="vic-falls-couple" />
                  <Label htmlFor="vic-falls-couple" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Victoria Falls Only - $5,300</div>
                      <div className="text-sm text-gray-500">Couple package, Victoria Falls experience only</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Full Experience - $5,000</div>
                      <div className="text-sm text-gray-500">Individual, Johannesburg + Victoria Falls</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="couple" id="couple" />
                  <Label htmlFor="couple" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Full Experience - $7,800</div>
                      <div className="text-sm text-gray-500">Couple, Johannesburg + Victoria Falls</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <Switch
                  id="capetown"
                  checked={formData.capeTownAddon}
                  onCheckedChange={(checked) => handleInputChange('capeTownAddon', checked)}
                />
                <Label htmlFor="capetown" className="flex items-center gap-2 cursor-pointer">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium">Add Cape Town Extension</div>
                    <div className="text-sm text-gray-500">
                      +${isCouple ? '3,000' : '2,200'} (3 additional days)
                    </div>
                  </div>
                </Label>
              </div>
            </div>

            {/* Primary Traveler Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">2. Primary Traveler Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="passportExpiry">Passport Expiry Date</Label>
                  <Input
                    id="passportExpiry"
                    type="date"
                    value={formData.passportExpiry}
                    onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Partner Information (if couple) */}
            {isCouple && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">3. Partner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partnerFirstName">Partner's First Name</Label>
                    <Input
                      id="partnerFirstName"
                      value={formData.partnerFirstName}
                      onChange={(e) => handleInputChange('partnerFirstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerLastName">Partner's Last Name</Label>
                    <Input
                      id="partnerLastName"
                      value={formData.partnerLastName}
                      onChange={(e) => handleInputChange('partnerLastName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerEmail">Partner's Email</Label>
                    <Input
                      id="partnerEmail"
                      type="email"
                      value={formData.partnerEmail}
                      onChange={(e) => handleInputChange('partnerEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerPhone">Partner's Phone</Label>
                    <Input
                      id="partnerPhone"
                      value={formData.partnerPhone}
                      onChange={(e) => handleInputChange('partnerPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerDateOfBirth">Partner's Date of Birth</Label>
                    <Input
                      id="partnerDateOfBirth"
                      type="date"
                      value={formData.partnerDateOfBirth}
                      onChange={(e) => handleInputChange('partnerDateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerNationality">Partner's Nationality</Label>
                    <Input
                      id="partnerNationality"
                      value={formData.partnerNationality}
                      onChange={(e) => handleInputChange('partnerNationality', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerPassportNumber">Partner's Passport Number</Label>
                    <Input
                      id="partnerPassportNumber"
                      value={formData.partnerPassportNumber}
                      onChange={(e) => handleInputChange('partnerPassportNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerPassportExpiry">Partner's Passport Expiry</Label>
                    <Input
                      id="partnerPassportExpiry"
                      type="date"
                      value={formData.partnerPassportExpiry}
                      onChange={(e) => handleInputChange('partnerPassportExpiry', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Travel Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">4. Travel Preferences & Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions/Preferences</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                    placeholder="e.g., vegetarian, allergies, preferences..."
                  />
                </div>
                <div>
                  <Label htmlFor="accessibilityNeeds">Accessibility Requirements</Label>
                  <Textarea
                    id="accessibilityNeeds"
                    value={formData.accessibilityNeeds}
                    onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                    placeholder="Any mobility or accessibility needs..."
                  />
                </div>
                <div>
                  <Label htmlFor="roomPreferences">Room Preferences</Label>
                  <Select
                    value={formData.roomPreferences}
                    onValueChange={(value) => handleInputChange('roomPreferences', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                      <SelectItem value="high-floor">High Floor</SelectItem>
                      <SelectItem value="ground-floor">Ground Floor</SelectItem>
                      <SelectItem value="quiet-area">Quiet Area</SelectItem>
                      <SelectItem value="city-view">City View</SelectItem>
                      <SelectItem value="nature-view">Nature View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="howHeardAbout">How did you hear about us?</Label>
                  <Select
                    value={formData.howHeardAbout}
                    onValueChange={(value) => handleInputChange('howHeardAbout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="friend-referral">Friend/Referral</SelectItem>
                      <SelectItem value="travel-agent">Travel Agent</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">5. Emergency Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactRelation">Relationship</Label>
                  <Input
                    id="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                    placeholder="e.g., spouse, parent, sibling"
                  />
                </div>
              </div>
            </div>

            {/* Travel Insurance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">6. Travel Insurance</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onCheckedChange={(checked) => handleInputChange('hasInsurance', checked)}
                />
                <Label htmlFor="hasInsurance">I have travel insurance</Label>
              </div>
              {formData.hasInsurance && (
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                    placeholder="Insurance company name"
                  />
                </div>
              )}
            </div>

            {/* Additional Comments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">7. Additional Information</h3>
              <div>
                <Label htmlFor="additionalComments">Special Requests or Comments</Label>
                <Textarea
                  id="additionalComments"
                  value={formData.additionalComments}
                  onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                  placeholder="Any special requests, celebrations, or additional information..."
                  rows={4}
                />
              </div>
            </div>

            {/* Security Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Verification
              </h3>
              <SecurityCaptcha
                onVerify={setCaptchaVerified}
                difficulty="medium"
                className="max-w-md mx-auto"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-bantu-orange hover:bg-bantu-orange/90"
                disabled={isSubmitting || !captchaVerified}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
