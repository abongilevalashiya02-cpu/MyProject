
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { PropertyListingFormData } from './propertyListingSchema';
import FormFieldWrapper from './FormFieldWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Info } from 'lucide-react';

interface PricingSectionProps {
  form: UseFormReturn<PropertyListingFormData>;
}

const PricingSection: React.FC<PricingSectionProps> = ({ form }) => {
  const { watch, formState: { errors } } = form;
  const formData = watch();

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-foreground">Pricing Information</h3>
        <p className="text-sm text-muted-foreground">
          Set competitive pricing for your property in both USD and ZAR
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormFieldWrapper
          label="Price Range (USD)"
          htmlFor="priceRangeUSD"
          required
          error={errors.priceRangeUSD?.message}
          isValid={!!formData.priceRangeUSD && !errors.priceRangeUSD}
          description="Daily rate per person in US Dollars"
        >
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="priceRangeUSD"
              {...form.register('priceRangeUSD')}
              placeholder="100-250 per person per day"
              className="pl-10"
            />
          </div>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Price Range (ZAR)"
          htmlFor="priceRangeZAR"
          required
          error={errors.priceRangeZAR?.message}
          isValid={!!formData.priceRangeZAR && !errors.priceRangeZAR}
          description="Daily rate per person in South African Rand"
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">R</span>
            <Input
              id="priceRangeZAR"
              {...form.register('priceRangeZAR')}
              placeholder="1,800-4,600 per person per day"
              className="pl-8"
            />
          </div>
        </FormFieldWrapper>
      </div>

      {/* Pricing Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">What to Include in Your Rate:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <ul className="list-disc list-inside space-y-1">
                  <li>Accommodation</li>
                  <li>Meeting facilities</li>
                  <li>Basic WiFi</li>
                  <li>Parking</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li>Standard amenities</li>
                  <li>Welcome refreshments</li>
                  <li>Concierge services</li>
                  <li>Airport transfers (if offered)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSection;
