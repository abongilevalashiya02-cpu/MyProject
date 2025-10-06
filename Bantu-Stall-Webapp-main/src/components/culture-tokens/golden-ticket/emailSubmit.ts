
import { FormValues } from './formSchema';
import { supabase } from '@/integrations/supabase/client';

export const sendFormDataByEmail = async (data: FormValues): Promise<{ success: boolean; error?: any }> => {
  try {
    // Call the golden-ticket-notification edge function
    const { data: result, error } = await supabase.functions.invoke('golden-ticket-notification', {
      body: { formData: data }
    });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in sendFormDataByEmail:', error);
    return { success: false, error };
  }
};
