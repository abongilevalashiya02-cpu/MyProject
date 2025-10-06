import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationData } = await req.json();
    
    console.log('New Horo application received:', applicationData);

    // Here you can add email notification logic
    // For now, we'll just log the data
    
    // You could integrate with email services like:
    // - Resend (using RESEND_API_KEY)
    // - Brevo (using BREVO_API_KEY) 
    // - Or any other email service

    const emailContent = `
New Horo Experience Application Received!

Contact Information:
- Name: ${applicationData.fullName}
- Email: ${applicationData.workEmail}
- Phone: ${applicationData.phoneNumber || 'Not provided'}

Company Details:
- Company: ${applicationData.companyName}
- Role: ${applicationData.jobTitle}
- Team Size: ${applicationData.teamSize}

Experience Requirements:
- Objectives: ${applicationData.objectives?.join(', ') || 'Not specified'}
- Experience Details: ${applicationData.experienceDetails || 'Not provided'}
- Preferred Locations: ${applicationData.locations || 'Not specified'}
- Budget Range: ${applicationData.budgetRange || 'Not specified'}
- Source: ${applicationData.source || 'Not specified'}

Application ID: ${applicationData.applicationId}
`;

    console.log('Email content prepared:', emailContent);
    
    // TODO: Send actual email notification to the team
    // This would involve calling your preferred email service
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Horo application notification processed successfully' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing Horo application notification:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process notification' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})