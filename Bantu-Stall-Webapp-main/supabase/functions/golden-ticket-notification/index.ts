import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoldenTicketData {
  name: string;
  organization?: string;
  country: string;
  email: string;
  destination: string;
  experienceType: string;
  groupSize: string;
  duration: string;
  budget: string;
  goal1: string;
  goal2: string;
  localFacilitators: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData }: { formData: GoldenTicketData } = await req.json();
    
    console.log('Received golden ticket application:', formData);
    console.log('Brevo API key exists:', !!Deno.env.get('BREVO_API_KEY'));

    // Prepare email content for admin notification
    const adminEmailContent = `
      <h2>New Golden Ticket Application</h2>
      
      <h3>Applicant Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${formData.name}</li>
        <li><strong>Organization:</strong> ${formData.organization || 'N/A'}</li>
        <li><strong>Country:</strong> ${formData.country}</li>
        <li><strong>Email:</strong> ${formData.email}</li>
      </ul>
      
      <h3>Experience Details:</h3>
      <ul>
        <li><strong>Destination:</strong> ${formData.destination}</li>
        <li><strong>Experience Type:</strong> ${formData.experienceType}</li>
        <li><strong>Group Size:</strong> ${formData.groupSize}</li>
        <li><strong>Duration:</strong> ${formData.duration}</li>
        <li><strong>Budget:</strong> ${formData.budget}</li>
      </ul>
      
      <h3>Team Goals:</h3>
      <ul>
        <li><strong>Primary Goal:</strong> ${formData.goal1}</li>
        <li><strong>Secondary Goal:</strong> ${formData.goal2}</li>
      </ul>
      
      <h3>Additional Information:</h3>
      <ul>
        <li><strong>Open to Local Facilitators:</strong> ${formData.localFacilitators}</li>
      </ul>
      
      <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
      
      <p>Please review this application and contact the applicant for more details.</p>
    `;

    // Send email to admin using Brevo API
    const adminEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': Deno.env.get('BREVO_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'BantuStall Golden Ticket',
          email: 'no-reply@bantustall.com'
        },
        to: [
          {
            email: 'kuda@bantustall.com',
            name: 'Kuda'
          }
        ],
        subject: `Golden Ticket Application from ${formData.name}`,
        htmlContent: adminEmailContent,
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text();
      console.error('Brevo admin email error:', errorText);
      console.error('Brevo admin email status:', adminEmailResponse.status);
      throw new Error('Failed to send admin email notification');
    }

    // Prepare confirmation email content for applicant
    const confirmationContent = `
      <h2>Thank you for your Golden Ticket application!</h2>
      
      <p>Dear ${formData.name},</p>
      
      <p>We have successfully received your Golden Ticket application for a <strong>${formData.experienceType}</strong> experience in <strong>${formData.destination}</strong>.</p>
      
      <p>Our team will review your submission and contact you within 24-48 hours to discuss next steps. We're excited about the possibility of creating an amazing experience for your team!</p>
      
      <h3>Your Application Summary:</h3>
      <ul>
        <li><strong>Destination:</strong> ${formData.destination}</li>
        <li><strong>Experience Type:</strong> ${formData.experienceType}</li>
        <li><strong>Group Size:</strong> ${formData.groupSize}</li>
        <li><strong>Duration:</strong> ${formData.duration}</li>
        <li><strong>Budget Range:</strong> ${formData.budget}</li>
      </ul>
      
      <p>If you have any questions in the meantime, please don't hesitate to reach out to <a href="mailto:kuda@bantustall.com">Kuda</a>.</p>
      
      <p>Best regards,<br>The BantuStall Team</p>
    `;

    // Send confirmation email to applicant using Brevo API
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
            email: formData.email,
            name: formData.name
          }
        ],
        subject: `Confirmation: Your Golden Ticket Application`,
        htmlContent: confirmationContent,
      }),
    });

    if (!confirmationEmailResponse.ok) {
      const errorText = await confirmationEmailResponse.text();
      console.error('Brevo confirmation email error:', errorText);
      console.error('Brevo confirmation email status:', confirmationEmailResponse.status);
      throw new Error('Failed to send confirmation email');
    }

    // Sync to HubSpot
    try {
      console.log('Syncing golden ticket application to HubSpot');
      
      // Sync contact
      const contactSyncResponse = await fetch('https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          email: formData.email,
          data: {
            email: formData.email,
            name: formData.name,
            company: formData.organization,
            source: 'golden_ticket_application',
            country: formData.country
          }
        }),
      });

      if (!contactSyncResponse.ok) {
        console.error('Failed to sync contact to HubSpot:', await contactSyncResponse.text());
      }

      // Sync deal
      const dealSyncResponse = await fetch('https://wnicvdcjbweavqdffnxp.supabase.co/functions/v1/hubspot-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'deal',
          email: formData.email,
          data: {
            service_type: 'Golden Ticket Experience',
            event_type: formData.experienceType,
            company: formData.organization || formData.name,
            budget_range: formData.budget,
            destination: formData.destination,
            group_size: formData.groupSize,
            duration: formData.duration
          }
        }),
      });

      if (!dealSyncResponse.ok) {
        console.error('Failed to sync deal to HubSpot:', await dealSyncResponse.text());
      }

      console.log('HubSpot sync completed');
    } catch (hubspotError) {
      console.error('HubSpot sync error:', hubspotError);
      // Don't fail the entire request if HubSpot sync fails
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Golden ticket application sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in golden-ticket-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});