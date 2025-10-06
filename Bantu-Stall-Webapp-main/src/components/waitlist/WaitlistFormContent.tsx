
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { WaitlistEntry } from '@/types/waitlist';
import { submitWaitlistEntry } from './waitlist-service';
import { waitlistFormSchema, WaitlistFormData } from './types';

// Import field components
import NameField from './FormFields/NameField';
import EmailField from './FormFields/EmailField';
import CountryField from './FormFields/CountryField';
import SubmitButton from './FormFields/SubmitButton';

interface WaitlistFormContentProps {
  setOpen: (open: boolean) => void;
}

const WaitlistFormContent: React.FC<WaitlistFormContentProps> = ({ setOpen }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    
    try {
      const waitlistEntry: WaitlistEntry = {
        name: data.name,
        email: data.email,
        country: data.country,
        created_at: new Date().toISOString()
      };
      
      await submitWaitlistEntry(waitlistEntry);
      
      toast({
        title: "Successfully joined waitlist!",
        description: "We'll keep you updated on our launch.",
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting waitlist form:', error);
      toast({
        title: "Submission failed",
        description: "There was an error joining the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <NameField form={form} />
        <EmailField form={form} />
        <CountryField form={form} />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default WaitlistFormContent;
