
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { PropertyListingFormData } from './propertyListingSchema';
import FormFieldWrapper from './FormFieldWrapper';
import { Mail, Phone, Globe, User } from 'lucide-react';

interface ContactSectionProps {
  form: UseFormReturn<PropertyListingFormData>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ form }) => {
  const { watch, formState: { errors } } = form;
  const formData = watch();

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          Provide contact details for booking inquiries and guest communication
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormFieldWrapper
          label="Contact Name"
          htmlFor="contactName"
          required
          error={errors.contactName?.message}
          isValid={!!formData.contactName && !errors.contactName}
          description="Primary contact person"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="contactName"
              {...form.register('contactName')}
              placeholder="John Doe"
              className="pl-10"
            />
          </div>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Contact Email"
          htmlFor="contactEmail"
          required
          error={errors.contactEmail?.message}
          isValid={!!formData.contactEmail && !errors.contactEmail}
          description="Primary email for bookings"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="contactEmail"
              type="email"
              {...form.register('contactEmail')}
              placeholder="contact@property.com"
              className="pl-10"
            />
          </div>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Contact Phone"
          htmlFor="contactPhone"
          required
          error={errors.contactPhone?.message}
          isValid={!!formData.contactPhone && !errors.contactPhone}
          description="Direct contact number"
        >
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="contactPhone"
              {...form.register('contactPhone')}
              placeholder="+27 11 123 4567"
              className="pl-10"
            />
          </div>
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper
        label="Website URL"
        htmlFor="websiteUrl"
        error={errors.websiteUrl?.message}
        isValid={!!formData.websiteUrl && !errors.websiteUrl}
        description="Your property's official website (optional)"
      >
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="websiteUrl"
            type="url"
            {...form.register('websiteUrl')}
            placeholder="https://www.yourproperty.com"
            className="pl-10"
          />
        </div>
      </FormFieldWrapper>
    </div>
  );
};

export default ContactSection;
