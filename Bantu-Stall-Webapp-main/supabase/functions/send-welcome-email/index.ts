import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  userType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, userType }: WelcomeEmailRequest = await req.json();

    // Determine the appropriate welcome message based on user type
    const getUserTypeMessage = (type: string) => {
      switch (type) {
        case 'corporate':
          return 'plan amazing corporate retreats and team experiences across Africa.';
        case 'traveler':
          return 'explore authentic African destinations and unique cultural experiences.';
        case 'service_provider':
          return 'showcase your tourism services and connect with travelers.';
        case 'vendor':
          return 'sell your products and services on our marketplace.';
        default:
          return 'explore everything Africa has to offer.';
      }
    };

    const emailResponse = await resend.emails.send({
      from: "Bantu Stall <welcome@bantustall.site>",
      to: [email],
      subject: `Welcome to Bantu Stall, ${name}! 🌍`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Bantu Stall</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #e97515 0%, #f39c12 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Bantu Stall!</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Discover Africa's Hidden Gems</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #e97515; margin-bottom: 20px;">Hello ${name}! 👋</h2>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for joining Bantu Stall, Africa's premier platform for authentic travel experiences and cultural connections.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                As a <strong>${userType}</strong>, you're now ready to ${getUserTypeMessage(userType)}
              </p>
              
              <!-- Call to Action -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://wnicvdcjbweavqdffnxp.supabase.co', 'https://bantustall.site') || 'https://bantustall.site'}/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #e97515 0%, #f39c12 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; font-size: 16px; transition: transform 0.2s;">
                  Get Started Now
                </a>
              </div>
              
              <!-- Features -->
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #e97515; margin-bottom: 15px; font-size: 18px;">What you can do:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #e97515; font-weight: bold;">🌍</span> Explore authentic African destinations
                  </li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #e97515; font-weight: bold;">🤝</span> Connect with local service providers
                  </li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #e97515; font-weight: bold;">📅</span> Plan memorable corporate retreats
                  </li>
                  <li style="padding: 8px 0;">
                    <span style="color: #e97515; font-weight: bold;">🛍️</span> Discover unique African products
                  </li>
                </ul>
              </div>
              
              <!-- Support -->
              <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  Need help getting started? 
                  <a href="mailto:support@bantustall.site" style="color: #e97515; text-decoration: none;">Contact our support team</a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                © 2024 Bantu Stall. Connecting Africa, One Experience at a Time.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
                <a href="https://bantustall.site" style="color: #f39c12; text-decoration: none;">bantustall.site</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);