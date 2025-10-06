import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutomationEmailRequest {
  type: 'onboarding' | 'payment_confirmation' | 'booking_confirmation' | 'quote_follow_up' | 'newsletter_welcome';
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: AutomationEmailRequest = await req.json();
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');

    if (!brevoApiKey) {
      throw new Error('Brevo API key not configured');
    }

    console.log(`Sending ${type} email to:`, data.email || data.contact_email);

    let emailData: any = {};

    switch (type) {
      case 'onboarding':
        emailData = {
          sender: { name: "Bantu Stall", email: "welcome@bantustall.com" },
          to: [{ email: data.email, name: data.name || "New User" }],
          subject: "Welcome to Bantu Stall - Your Corporate Retreat Journey Begins!",
          htmlContent: `
            <h1>Welcome to Bantu Stall, ${data.name || 'Friend'}!</h1>
            <p>Thank you for joining our community of forward-thinking organizations.</p>
            <p>We're excited to help you create meaningful corporate retreat experiences that inspire, connect, and transform your team.</p>
            
            <h2>What's Next?</h2>
            <ul>
              <li>📋 Complete your company profile</li>
              <li>🎯 Explore our corporate retreat planning tools</li>
              <li>🏞️ Browse our curated venue collection</li>
              <li>💬 Connect with our retreat specialists</li>
            </ul>
            
            <p>Ready to start planning? <a href="https://bantustall.com/dashboard">Access your dashboard</a></p>
            
            <p>Need assistance? Our team is here to help!</p>
            <p>Best regards,<br>The Bantu Stall Team</p>
          `
        };
        break;

      case 'payment_confirmation':
        emailData = {
          sender: { name: "Bantu Stall", email: "bookings@bantustall.com" },
          to: [{ email: data.contact_email, name: data.contact_name }],
          subject: "Payment Confirmed - Your Corporate Retreat is Secured!",
          htmlContent: `
            <h1>Payment Confirmed!</h1>
            <p>Dear ${data.contact_name},</p>
            <p>Great news! We've received your payment and your corporate retreat booking is now confirmed.</p>
            
            <h2>Booking Details:</h2>
            <ul>
              <li><strong>Booking Reference:</strong> ${data.booking_reference}</li>
              <li><strong>Amount Paid:</strong> ${data.amount}</li>
              <li><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
            
            <p>You'll receive detailed itinerary and preparation materials closer to your retreat date.</p>
            <p>Questions? Contact us at bookings@bantustall.com</p>
            
            <p>Best regards,<br>The Bantu Stall Team</p>
          `
        };
        break;

      case 'booking_confirmation':
        emailData = {
          sender: { name: "Bantu Stall", email: "bookings@bantustall.com" },
          to: [{ email: data.contact_email, name: data.contact_name }],
          subject: "Booking Confirmed - Your Corporate Retreat Awaits!",
          htmlContent: `
            <h1>Your Corporate Retreat is Confirmed!</h1>
            <p>Dear ${data.contact_name},</p>
            <p>Congratulations! Your corporate retreat booking has been confirmed.</p>
            
            <h2>Retreat Details:</h2>
            <ul>
              <li><strong>Venue:</strong> ${data.venue_name}</li>
              <li><strong>Dates:</strong> ${data.booking_details?.dates}</li>
              <li><strong>Guests:</strong> ${data.booking_details?.guests}</li>
            </ul>
            
            <h2>Next Steps:</h2>
            <ol>
              <li>Complete final headcount 2 weeks before arrival</li>
              <li>Review dietary requirements and special needs</li>
              <li>Prepare team-building activity preferences</li>
            </ol>
            
            <p>We're excited to host your team!</p>
            <p>Best regards,<br>The Bantu Stall Team</p>
          `
        };
        break;

      case 'quote_follow_up':
        emailData = {
          sender: { name: "Bantu Stall", email: "quotes@bantustall.com" },
          to: [{ email: data.email, name: data.name }],
          subject: "Your Corporate Retreat Quote - Ready When You Are!",
          htmlContent: `
            <h1>Following Up on Your Corporate Retreat Quote</h1>
            <p>Dear ${data.name},</p>
            <p>We hope you've had a chance to review the corporate retreat proposal we sent you.</p>
            
            <p>We understand that planning a corporate retreat is a significant decision, and we're here to answer any questions you might have.</p>
            
            <h2>Common Questions We Can Help With:</h2>
            <ul>
              <li>Customizing the itinerary to match your objectives</li>
              <li>Dietary accommodations and special requirements</li>
              <li>Team building activities and facilitation</li>
              <li>Transportation and logistics</li>
              <li>Budget adjustments and payment terms</li>
            </ul>
            
            <p>Ready to move forward or need clarification? Simply reply to this email or schedule a call with our team.</p>
            
            <p>Best regards,<br>The Bantu Stall Team<br>quotes@bantustall.com</p>
          `
        };
        break;

      case 'newsletter_welcome':
        emailData = {
          sender: { name: "Bantu Stall", email: "newsletter@bantustall.com" },
          to: [{ email: data.email, name: "Corporate Leader" }],
          subject: "Welcome to Bantu Stall Insights - Corporate Retreat Excellence",
          htmlContent: `
            <h1>Welcome to Bantu Stall Insights!</h1>
            <p>Thank you for subscribing to our newsletter.</p>
            
            <p>You'll now receive:</p>
            <ul>
              <li>🎯 Corporate retreat planning tips and best practices</li>
              <li>🏞️ Featured venue spotlights and new locations</li>
              <li>📊 Industry insights and team-building trends</li>
              <li>🎉 Exclusive offers and early access to new services</li>
            </ul>
            
            <p>Ready to plan your next corporate retreat? <a href="https://bantustall.com/quotations">Get a quote</a></p>
            
            <p>Follow us for daily inspiration:</p>
            <p><a href="#">LinkedIn</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a></p>
            
            <p>Best regards,<br>The Bantu Stall Team</p>
          `
        };
        break;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Brevo API error: ${result.message}`);
    }

    console.log(`Successfully sent ${type} email`);

    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error sending automation email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);