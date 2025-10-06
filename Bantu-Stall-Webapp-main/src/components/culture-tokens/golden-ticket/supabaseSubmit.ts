
import { SupabaseClient } from '@supabase/supabase-js';
import { FormValues } from './formSchema';

export const saveToSupabase = async (
  supabase: SupabaseClient | null,
  data: FormValues
): Promise<{ success: boolean; error?: any }> => {
  if (!supabase) {
    console.error("Supabase client is not initialized");
    return { success: false, error: "Supabase client is not initialized" };
  }
  
  try {
    console.log("Attempting to save to Supabase:", data);
    
    // Insert form data into Supabase table
    const { error, data: result } = await supabase
      .from('golden_tickets')
      .insert([
        {
          name: data.name,
          organization: data.organization || null,
          country: data.country,
          email: data.email,
          destination: data.destination,
          experience_type: data.experienceType,
          group_size: data.groupSize,
          duration: data.duration,
          budget: data.budget,
          goal_1: data.goal1,
          goal_2: data.goal2,
          local_facilitators: data.localFacilitators,
          submission_date: new Date().toISOString(),
          status: 'pending'
        }
      ]);
    
    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error };
    }
    
    console.log('Supabase insert successful:', result);
    return { success: true };
  } catch (error) {
    console.error('Error in saveToSupabase:', error);
    return { success: false, error };
  }
};
