import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, Building } from 'lucide-react';

interface FormData {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
}

interface StepContactInfoProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export default function StepContactInfo({ formData, updateFormData }: StepContactInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Contact Information
        </h3>
        <p className="text-muted-foreground">
          We'll use this information to send you the quotation and follow up on your request.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                type="text"
                placeholder="Your full name"
                value={formData.contactName}
                onChange={(e) => updateFormData({ contactName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                type="email"
                placeholder="your.email@company.com"
                value={formData.contactEmail}
                onChange={(e) => updateFormData({ contactEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                type="tel"
                placeholder="+27 XX XXX XXXX"
                value={formData.contactPhone}
                onChange={(e) => updateFormData({ contactPhone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Name
              </Label>
              <Input
                type="text"
                placeholder="Your company or organization"
                value={formData.companyName}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">What happens next?</h4>
            <ul className="text-sm text-green-700 mt-1 space-y-1">
              <li>• You'll receive a confirmation email immediately</li>
              <li>• Our team will review your requirements within 2 hours</li>
              <li>• Detailed quotation delivered within 24 hours</li>
              <li>• Optional consultation call to discuss your needs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}