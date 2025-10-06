
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from './ApplicationForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface ApplicationStep2Props {
  form: UseFormReturn<ApplicationFormValues>;
}

export const ApplicationStep2: React.FC<ApplicationStep2Props> = ({ form }) => {
  const handleFileUpload = (fieldName: keyof ApplicationFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real implementation, you would upload to Supabase storage and get the URL
      console.log(`Upload for ${fieldName}:`, e.target.files[0]);
      form.setValue(fieldName, `Upload simulated for: ${e.target.files[0].name}`);
    }
  };
  
  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real implementation, you would upload to Supabase storage and get URLs
      const currentImages = form.getValues('portfolioImages') || [];
      const newImage = `Upload simulated for: ${e.target.files[0].name}`;
      form.setValue('portfolioImages', [...currentImages, newImage]);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <FormField
        control={form.control}
        name="profilePhoto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Photo</FormLabel>
            <FormControl>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-gray-100 mb-2">
                    <Upload className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm mb-2">Drag and drop your photo, or click to browse</p>
                  <p className="text-xs text-gray-500 mb-4">JPG, PNG or GIF, max 5MB</p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="profilePhoto"
                    onChange={handleFileUpload('profilePhoto')}
                  />
                  <Button size="sm" onClick={() => document.getElementById('profilePhoto')?.click()}>
                    Browse Files
                  </Button>
                  {field.value && (
                    <p className="mt-2 text-sm text-green-600">{field.value}</p>
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="govIdDocument"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Verification</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-2 rounded-full bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Government ID</div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        id="govIdDocument"
                        onChange={handleFileUpload('govIdDocument')}
                      />
                      <Button size="sm" onClick={() => document.getElementById('govIdDocument')?.click()}>
                        Upload ID
                      </Button>
                      {field.value && (
                        <p className="mt-2 text-xs text-green-600">{field.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <FormField
                  control={form.control}
                  name="businessRegistration"
                  render={({ field }) => (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-2 rounded-full bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="text-sm font-medium">Business Registration</div>
                          <Input 
                            type="file" 
                            className="hidden" 
                            id="businessRegistration"
                            onChange={handleFileUpload('businessRegistration')}
                          />
                          <Button size="sm" onClick={() => document.getElementById('businessRegistration')?.click()}>
                            Upload Document
                          </Button>
                          {field.value && (
                            <p className="mt-2 text-xs text-green-600">{field.value}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">These documents help us verify your identity and business status.</p>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="portfolioImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Portfolio / Service Examples</FormLabel>
            <FormControl>
              <div className="border-2 border-dashed rounded-md p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {(field.value && field.value.length > 0) ? (
                    field.value.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded flex items-center justify-center p-2">
                        <p className="text-xs text-center">{image}</p>
                      </div>
                    ))
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="portfolioImage"
                    onChange={handlePortfolioUpload}
                  />
                  <Button size="sm" onClick={() => document.getElementById('portfolioImage')?.click()}>
                    Add More Photos
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Upload photos of your work, experiences you've led, or examples of your services.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="professionalBio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about yourself, your background, and experience..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
