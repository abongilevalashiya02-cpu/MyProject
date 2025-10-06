
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface NewsletterSubscription {
  email: string;
}

export const subscribeToNewsletter = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      return { 
        success: false, 
        message: "Please enter a valid email address" 
      };
    }

    console.log("Attempting to subscribe email:", email);

    // Check if email already exists to provide a better user experience
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing subscriber:', checkError);
      return { 
        success: false, 
        message: "An error occurred while checking your subscription. Please try again." 
      };
    }

    if (existingSubscriber) {
      console.log("Email already subscribed:", email);
      return { 
        success: true, 
        message: "You're already subscribed to our newsletter!" 
      };
    }

    // Insert new subscriber
    console.log("Inserting new subscriber:", email);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      console.error('Error subscribing to newsletter:', error);
      
      // Handle unique constraint violations
      if (error.code === '23505') {
        return { 
          success: true, 
          message: "You're already subscribed to our newsletter!" 
        };
      }
      
      return { 
        success: false, 
        message: "Failed to subscribe. Please try again later." 
      };
    }

    console.log("Successfully subscribed email:", email);
    return { 
      success: true, 
      message: "Thank you for subscribing to our newsletter!" 
    };
  } catch (error) {
    console.error('Error in subscribeToNewsletter:', error);
    return { 
      success: false, 
      message: "An unexpected error occurred. Please try again later." 
    };
  }
};
