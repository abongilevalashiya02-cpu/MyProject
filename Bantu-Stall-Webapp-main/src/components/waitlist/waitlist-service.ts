
import { supabase } from '@/integrations/supabase/client';
import { WaitlistEntry } from '@/types/waitlist';
import { appConfig } from '@/config/environment';

export async function submitWaitlistEntry(entry: WaitlistEntry): Promise<void> {
  console.log('Starting waitlist submission process for:', entry.name);
  
  // First try to save to Supabase
  let supabaseSuccess = false;
  
  if (supabase) {
    try {
      console.log('Attempting to save to Supabase database...');
      const { data, error } = await supabase
        .from('waitlist')
        .insert([entry]);
        
      if (!error) {
        console.log('Successfully saved waitlist data to Supabase:', data);
        supabaseSuccess = true;
      } else {
        console.error('Supabase insertion error:', error.code, error.message, error.details);
        
        // Check if it's a duplicate email error
        if (error.code === '23505' && error.message.includes('waitlist_email_unique')) {
          throw new Error('This email is already on our waitlist. Thank you for your interest!');
        }
      }
    } catch (supabaseError) {
      console.error('Uncaught Supabase error:', supabaseError);
      if (supabaseError instanceof Error) {
        // If it's already our custom error, rethrow it
        if (supabaseError.message.includes('already on our waitlist')) {
          throw supabaseError;
        }
      }
    }
  } else {
    console.warn('Supabase client not initialized, skipping database submission');
  }
  
  // If Supabase fails or isn't configured, fallback to EmailJS
  if (!supabaseSuccess) {
    console.log('Falling back to EmailJS for waitlist submission');
    
    try {
      // Format the message for the email
      const formattedMessage = `
        New Waitlist Signup:
        
        Name: ${entry.name}
        Email: ${entry.email}
        Country: ${entry.country}
        
        Submitted on: ${new Date().toLocaleString()}
      `;
      
      console.log('Preparing EmailJS submission with formatted message');
      
      // Use EmailJS to send the data
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: appConfig.integrations.emailJs.serviceId,
          template_id: appConfig.integrations.emailJs.templateId,
          user_id: appConfig.integrations.emailJs.publicKey,
          template_params: {
            to_email: 'kuda@bantustall.com',
            subject: `Waitlist Signup: ${entry.name} from ${entry.country}`,
            message: formattedMessage,
            from_name: entry.name,
            from_email: entry.email
          }
        })
      });
      
      if (response.status === 200) {
        console.log('EmailJS submission successful with status:', response.status);
        const responseData = await response.json().catch(() => null);
        if (responseData) {
          console.log('EmailJS response data:', responseData);
        }
      } else {
        console.error('EmailJS non-200 response:', response.status);
        const responseText = await response.text().catch(() => 'Could not read response text');
        console.error('EmailJS error response text:', responseText);
        throw new Error(`Failed to submit waitlist form (status: ${response.status})`);
      }
    } catch (emailJsError) {
      console.error('Error during EmailJS submission:', emailJsError);
      
      // Enhanced error with more context
      if (emailJsError instanceof Error) {
        throw new Error(`Waitlist submission failed: ${emailJsError.message}`);
      } else {
        throw new Error('Waitlist submission failed due to an unknown error with EmailJS');
      }
    }
  }
  
  console.log('Waitlist submission completed successfully for:', entry.name);
}
