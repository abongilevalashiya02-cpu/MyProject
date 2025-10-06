
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Shield } from 'lucide-react';
import { subscribeToNewsletter } from '@/services/newsletterService';
import { toast } from "sonner";
import { useSecureFormSubmission } from '@/hooks/useSecureFormSubmission';
import EnhancedFormValidator from '@/utils/enhancedSecurity';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  
  const { submitForm, isSubmitting } = useSecureFormSubmission({
    formType: 'newsletter_subscription',
    maxSubmissions: 5,
    windowMinutes: 60,
    validateData: true,
    enableSuspiciousDetection: true
  });

  const validator = new EnhancedFormValidator();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    // Process newsletter subscription
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Enhanced validation
    const validation = validator.validateForm({ email }, { email: 'email' });
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.fieldErrors).flat();
      toast.error(`Invalid email: ${errorMessages.join(', ')}`);
      return;
    }

    if (validation.securityIssues.length > 0) {
      // Handle security validation silently
      toast.error("Please check your email address and try again.");
      return;
    }

    const result = await submitForm(validation.sanitizedData, async (sanitizedData) => {
      await subscribeToNewsletter(sanitizedData.email);
      return { success: true };
    });

    if (result.success) {
      toast.success("Successfully subscribed to our newsletter!");
      setEmail('');
    }
  };

  return (
    <div>
      <h4 className="font-medium text-lg mb-4">Join Our Newsletter</h4>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <div className="relative flex-grow">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input 
            type="email" 
            placeholder="Your email address" 
            className="bg-gray-800 border-gray-700 pl-10 text-white rounded-2xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit"
          className="bg-bantu-orange hover:bg-bantu-orange/90 text-white rounded-2xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      <p className="text-gray-500 text-sm mt-2">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterForm;
