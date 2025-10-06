
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSecureFormSubmission } from '@/hooks/useSecureFormSubmission';
import SecurityCaptcha from '@/components/security/SecurityCaptcha';
import EnhancedFormValidator from '@/utils/enhancedSecurity';
import { Shield } from 'lucide-react';

interface FormState {
  full_name: string;
  email: string;
  company: string;
  role: string;
  message: string;
}

const CustomerIntakeForm: React.FC = () => {
  const { toast } = useToast();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    full_name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });

  const { submitForm, isSubmitting } = useSecureFormSubmission({
    formType: 'customer_intake',
    maxSubmissions: 3,
    windowMinutes: 30,
    validateData: true,
    enableSuspiciousDetection: true
  });

  const validator = new EnhancedFormValidator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
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
      full_name: 'name',
      email: 'email',
      company: 'name',
      role: 'name'
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
      const { error } = await supabase
        .from('intake_submissions')
        .insert([
          {
            full_name: sanitizedData.full_name,
            email: sanitizedData.email,
            company: sanitizedData.company || null,
            role: sanitizedData.role || null,
            message: sanitizedData.message,
          }
        ]);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    });

    if (result.success) {
      toast({
        title: "Thank You!",
        description: "Your inquiry has been submitted successfully. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        company: '',
        role: '',
        message: ''
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto font-avenir">
      <Card className="shadow-lg rounded-2xl border-0">
        <CardContent className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Enquire About G20 Media Spaces
            </h3>
            <p className="text-gray-600 text-lg">
              Get in touch to secure your prime location for the historic 2025 G20 Summit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-base font-medium text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="h-12 text-base border-gray-300 rounded-xl focus:border-[#fbb040] focus:ring-[#fbb040] transition-all duration-250 ease-in-out"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 text-base border-gray-300 rounded-xl focus:border-[#fbb040] focus:ring-[#fbb040] transition-all duration-250 ease-in-out"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-base font-medium text-gray-700">
                  Company / Organisation
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={handleChange}
                  className="h-12 text-base border-gray-300 rounded-xl focus:border-[#fbb040] focus:ring-[#fbb040] transition-all duration-250 ease-in-out"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-base font-medium text-gray-700">
                  Role / Title
                </Label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="Your job title or role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-12 text-base border-gray-300 rounded-xl focus:border-[#fbb040] focus:ring-[#fbb040] transition-all duration-250 ease-in-out"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-medium text-gray-700">
                Message or Inquiry
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us about your G20 media space requirements, preferred locations, or any specific questions..."
                value={formData.message}
                onChange={handleChange}
                className="text-base border-gray-300 rounded-xl focus:border-[#fbb040] focus:ring-[#fbb040] transition-all duration-250 ease-in-out resize-none"
              />
            </div>

            {/* Security Verification */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Security Verification
              </Label>
              <SecurityCaptcha
                onVerify={setCaptchaVerified}
                difficulty="easy"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-bantu-orange hover:bg-bantu-orange/90 text-white"
              disabled={isSubmitting || !captchaVerified}
            >
              {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
            </Button>
            <p className="text-sm text-gray-500 text-center mt-4">
              * Required fields. We'll respond within 24 hours.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerIntakeForm;
