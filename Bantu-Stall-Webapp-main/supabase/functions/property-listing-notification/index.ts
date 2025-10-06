
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PropertyListingData {
  propertyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  propertyType: string;
  location: string;
  description: string;
  userProfile?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyData }: { propertyData: PropertyListingData } = await req.json();
    
    console.log('Received property data:', propertyData);
    console.log('Brevo API key exists:', !!Deno.env.get('BREVO_API_KEY'));
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile if user is authenticated
    const authHeader = req.headers.get('Authorization');
    let userProfile = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, first_name, last_name')
          .eq('id', user.id)
          .single();
        userProfile = profile;
      }
    }

    // Prepare email content for admin notification
    const adminEmailContent = `
      <h2>New Property Listing Submission</h2>
      
      <h3>Property Details:</h3>
      <ul>
        <li><strong>Property Name:</strong> ${propertyData.propertyName}</li>
        <li><strong>Type:</strong> ${propertyData.propertyType}</li>
        <li><strong>Location:</strong> ${propertyData.location}</li>
        <li><strong>Description:</strong> ${propertyData.description}</li>
      </ul>
      
      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${propertyData.contactName}</li>
        <li><strong>Email:</strong> ${propertyData.contactEmail}</li>
        <li><strong>Phone:</strong> ${propertyData.contactPhone}</li>
      </ul>
      
      ${userProfile ? `
      <h3>Submitted by:</h3>
      <ul>
        <li><strong>User Email:</strong> ${userProfile.email}</li>
        <li><strong>User Name:</strong> ${userProfile.first_name} ${userProfile.last_name}</li>
      </ul>
      ` : ''}
      
      <p>Please review this listing and contact the property owner for more details.</p>
    `;

    // Send email to Nontombi using Brevo API
    const adminEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': Deno.env.get('BREVO_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'BantuStall Property Listings',
          email: 'no-reply@bantustall.com'
        },
        to: [
          {
            email: 'nontombi@bantustall.com',
            name: 'Nontombi'
          }
        ],
        subject: `New Property Listing: ${propertyData.propertyName}`,
        htmlContent: adminEmailContent,
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text();
      console.error('Brevo admin email error:', errorText);
      console.error('Brevo admin email status:', adminEmailResponse.status);
      console.error('Brevo admin email headers:', adminEmailResponse.headers);
      throw new Error('Failed to send admin email notification');
    }

    // Prepare confirmation email content for property owner
    const confirmationContent = `
      <h2>Thank you for listing your property!</h2>
      
      <p>Dear ${propertyData.contactName},</p>
      
      <p>We have successfully received your property listing for <strong>${propertyData.propertyName}</strong>.</p>
      
      <p>Our team will review your submission and contact you within 24-48 hours. If you have any questions in the meantime, please don't hesitate to reach out to <a href="mailto:nontombi@bantustall.com">Nontombi</a>.</p>
      
      <h3>Your Submission Details:</h3>
      <ul>
        <li><strong>Property Name:</strong> ${propertyData.propertyName}</li>
        <li><strong>Type:</strong> ${propertyData.propertyType}</li>
        <li><strong>Location:</strong> ${propertyData.location}</li>
      </ul>
      
      <p>Best regards,<br>The BantuStall Team</p>
    `;

    // Send confirmation email to property owner using Brevo API
    const confirmationEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': Deno.env.get('BREVO_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'BantuStall',
          email: 'no-reply@bantustall.com'
        },
        to: [
          {
            email: propertyData.contactEmail,
            name: propertyData.contactName
          }
        ],
        subject: `Confirmation: Your Property Listing for ${propertyData.propertyName}`,
        htmlContent: confirmationContent,
      }),
    });

    if (!confirmationEmailResponse.ok) {
      const errorText = await confirmationEmailResponse.text();
      console.error('Brevo confirmation email error:', errorText);
      console.error('Brevo confirmation email status:', confirmationEmailResponse.status);
      console.error('Brevo confirmation email headers:', confirmationEmailResponse.headers);
      throw new Error('Failed to send confirmation email');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in property-listing-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
