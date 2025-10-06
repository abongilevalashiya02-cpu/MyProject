import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const brevoApiKey = Deno.env.get('BREVO_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface QuotationNotificationRequest {
  quotation_id?: string;
  type: 'quotation_sent' | 'quotation_created' | 'quote_request';
  quote_data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quotation_id, type, quote_data }: QuotationNotificationRequest = await req.json();
    
    console.log(`Processing ${type} for quotation ${quotation_id || 'quote request'}`);

    if (type === 'quote_request' && quote_data) {
      // Handle direct quote request from form
      const pdfBuffer = await generateQuotePDF(quote_data);
      const pdfBase64 = btoa(String.fromCharCode.apply(null, Array.from(pdfBuffer)));
      
      // Send emails with PDF attachment
      await sendUserQuoteEmail(quote_data, pdfBase64);
      await sendNontombiQuoteEmail(quote_data, pdfBase64);
      
      console.log('Quote request emails sent successfully');
      return new Response(
        JSON.stringify({ success: true, message: 'Quote request emails sent successfully' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Existing quotation flow
    if (!quotation_id) {
      throw new Error('Quotation ID is required for this type');
    }

    // Fetch quotation with all related data
    const { data: quotation, error: quotationError } = await supabase
      .from('quotations')
      .select(`
        *,
        client:clients(*),
        line_items:quotation_line_items(*),
        user_profile:profiles(*)
      `)
      .eq('id', quotation_id)
      .single();

    if (quotationError || !quotation) {
      console.error('Error fetching quotation:', quotationError);
      throw new Error('Quotation not found');
    }

    // Send email to admin (Nontombi)
    await sendAdminNotification(quotation);
    
    // Send confirmation email to user/client
    await sendClientConfirmation(quotation);

    console.log('Emails sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Emails sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in quotation-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function sendAdminNotification(quotation: any) {
  const lineItemsHtml = quotation.line_items
    .map((item: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.item_name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.description || ''}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">R${item.unit_price}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.tax_rate}%</td>
        <td style="padding: 8px; border: 1px solid #ddd;">R${item.line_total}</td>
      </tr>
    `)
    .join('');

  const emailContent = {
    sender: { name: "Bantu Stall System", email: "noreply@bantustall.com" },
    to: [{ email: "nontombi@bantustall.com", name: "Nontombi" }],
    subject: `New Quotation Request - ${quotation.quotation_number}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Quotation Request Received</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Quotation Details</h3>
          <p><strong>Quotation Number:</strong> ${quotation.quotation_number}</p>
          <p><strong>Issue Date:</strong> ${new Date(quotation.issue_date).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> ${new Date(quotation.due_date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${quotation.status}</p>
          <p><strong>Total Amount:</strong> R${quotation.total_amount}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Client Information</h3>
          <p><strong>Name:</strong> ${quotation.client.name}</p>
          <p><strong>Email:</strong> ${quotation.client.email}</p>
          <p><strong>Phone:</strong> ${quotation.client.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${quotation.client.company_name || 'Not provided'}</p>
          <p><strong>Address:</strong> ${quotation.client.address || 'Not provided'}</p>
          <p><strong>City:</strong> ${quotation.client.city || 'Not provided'}</p>
          <p><strong>Country:</strong> ${quotation.client.country || 'Not provided'}</p>
          <p><strong>VAT ID:</strong> ${quotation.client.vat_id || 'Not provided'}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>User Profile Information</h3>
          <p><strong>Name:</strong> ${quotation.user_profile?.first_name || ''} ${quotation.user_profile?.last_name || ''}</p>
          <p><strong>Email:</strong> ${quotation.user_profile?.email || 'Not available'}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Line Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #e2e8f0;">
                <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Description</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Unit Price</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Tax Rate</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
          </table>
          <div style="margin-top: 15px; text-align: right;">
            <p><strong>Subtotal: R${quotation.subtotal}</strong></p>
            <p><strong>Tax: R${quotation.tax_amount}</strong></p>
            <p style="font-size: 18px; color: #2563eb;"><strong>Total: R${quotation.total_amount}</strong></p>
          </div>
        </div>

        ${quotation.client_notes ? `
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Client Notes</h3>
            <p>${quotation.client_notes}</p>
          </div>
        ` : ''}

        ${quotation.terms_conditions ? `
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Terms & Conditions</h3>
            <p>${quotation.terms_conditions}</p>
          </div>
        ` : ''}

        <p style="margin-top: 30px; color: #64748b;">
          This quotation was generated automatically by the Bantu Stall quotation system.
        </p>
      </div>
    `
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(emailContent),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to send admin email:', errorText);
    throw new Error(`Failed to send admin email: ${response.status}`);
  }

  console.log('Admin notification sent successfully');
}

async function sendClientConfirmation(quotation: any) {
  const emailContent = {
    sender: { name: "Bantu Stall", email: "noreply@bantustall.com" },
    to: [{ email: quotation.client.email, name: quotation.client.name }],
    subject: `Quotation Confirmation - ${quotation.quotation_number}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Bantu Stall</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Quotation Confirmation</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Dear ${quotation.client.name},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for your quotation request! We have received your inquiry and created quotation 
            <strong style="color: #2563eb;">${quotation.quotation_number}</strong> for your consideration.
          </p>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #2563eb;">Quotation Summary</h3>
            <p><strong>Quotation Number:</strong> ${quotation.quotation_number}</p>
            <p><strong>Issue Date:</strong> ${new Date(quotation.issue_date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(quotation.due_date).toLocaleDateString()}</p>
            <p style="font-size: 18px; color: #2563eb;"><strong>Total Amount: R${quotation.total_amount}</strong></p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Our team will review your requirements and provide you with a detailed response shortly. 
            If you have any questions or need to make changes to your request, please don't hesitate to contact us.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">Expected Response Time: 24-48 hours</p>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #374151;">Next Steps:</h4>
            <ul style="color: #6b7280; line-height: 1.6;">
              <li>Our team will review your quotation request</li>
              <li>We will send you a detailed quotation within 24-48 hours</li>
              <li>You can accept, request modifications, or decline the quotation</li>
              <li>Upon acceptance, we will proceed with booking arrangements</li>
            </ul>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Bantu Stall Team<br>
            <a href="mailto:info@bantustall.com" style="color: #2563eb;">info@bantustall.com</a>
          </p>
        </div>

        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>This is an automated message from Bantu Stall. Please do not reply to this email.</p>
          <p>© 2025 Bantu Stall. All rights reserved.</p>
        </div>
      </div>
    `
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(emailContent),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to send client email:', errorText);
    throw new Error(`Failed to send client email: ${response.status}`);
  }

  console.log('Client confirmation sent successfully');
}

async function generateQuotePDF(quoteData: any): Promise<Uint8Array> {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    
    // Header with Bantu Stall branding - Updated colors
    pdf.setFillColor(203, 74, 1); // #CB4A01 - warm earthy orange
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BANTU STALL', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('African Travel & Retreat Platform', 20, 32);
    
    // Contact info (right side)
    pdf.setFontSize(10);
    pdf.text('nontombi@bantustall.com', pageWidth - 80, 20);
    pdf.text('+27 61 397 2802', pageWidth - 80, 28);
    pdf.text('www.bantustall.com', pageWidth - 80, 35);
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    
    // Quote title and date
    let yPosition = 60;
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CORPORATE RETREAT QUOTE', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const now = new Date();
    const quoteId = `BT-${now.getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    pdf.text(`Quote ID: ${quoteId}`, 20, yPosition);
    pdf.text(`Date: ${now.toLocaleDateString()}`, pageWidth - 60, yPosition);
    
    // Client information
    yPosition += 20;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Client Information', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const addClientInfo = (label: string, value: string) => {
      if (value && value.trim()) {
        pdf.text(`${label}: ${value}`, 20, yPosition);
        yPosition += 6;
      }
    };
    
    addClientInfo('Name', quoteData.contactName);
    addClientInfo('Email', quoteData.contactEmail);
    addClientInfo('Phone', quoteData.contactPhone);
    addClientInfo('Company', quoteData.companyName);
    
    // Retreat details
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Retreat Details', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const addRetreatInfo = (label: string, value: string) => {
      if (value && value.trim()) {
        pdf.text(`${label}: ${value}`, 20, yPosition);
        yPosition += 6;
      }
    };
    
    addRetreatInfo('Retreat Goal', quoteData.retreatGoal);
    addRetreatInfo('Group Size', `${quoteData.groupSize} attendees`);
    addRetreatInfo('Preferred Dates', quoteData.preferredDates);
    addRetreatInfo('Duration', quoteData.duration);
    addRetreatInfo('Location Preference', quoteData.locationPreference);
    addRetreatInfo('Budget Range', quoteData.budgetRange);
    addRetreatInfo('Accommodation Type', quoteData.accommodationType);
    
    if (quoteData.selectedVenue) {
      addRetreatInfo('Selected Venue', quoteData.selectedVenue.name);
      addRetreatInfo('Venue Location', `${quoteData.selectedVenue.location}, ${quoteData.selectedVenue.country}`);
    }
    
    // Activities
    if (quoteData.activities && quoteData.activities.length > 0) {
      yPosition += 5;
      pdf.text('Selected Activities:', 20, yPosition);
      yPosition += 6;
      quoteData.activities.forEach((activity: string) => {
        pdf.text(`• ${activity}`, 25, yPosition);
        yPosition += 5;
      });
    }
    
    // Catering preferences
    if (quoteData.cateringPreferences && quoteData.cateringPreferences.length > 0) {
      yPosition += 5;
      pdf.text('Catering Preferences:', 20, yPosition);
      yPosition += 6;
      quoteData.cateringPreferences.forEach((pref: string) => {
        pdf.text(`• ${pref}`, 25, yPosition);
        yPosition += 5;
      });
    }
    
    // Special requests
    if (quoteData.specialRequests && quoteData.specialRequests.trim()) {
      yPosition += 5;
      pdf.text('Special Requests:', 20, yPosition);
      yPosition += 6;
      const splitText = pdf.splitTextToSize(quoteData.specialRequests, pageWidth - 40);
      pdf.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5;
    }
    
    // Cost breakdown section
    if (quoteData.costBreakdown) {
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Cost Breakdown', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const { costBreakdown, currency } = quoteData;
      const currencySymbol = currency === 'ZAR' ? 'R' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;
      
      // Draw table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition - 2, pageWidth - 40, 8, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.text('Item', 25, yPosition + 3);
      pdf.text('Amount', pageWidth - 70, yPosition + 3);
      
      yPosition += 12;
      pdf.setFont('helvetica', 'normal');
      
      // Venue costs
      if (costBreakdown.venueTotal > 0) {
        pdf.text('Venue & Accommodation', 25, yPosition);
        pdf.text(`${currencySymbol}${costBreakdown.venueTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - 70, yPosition);
        yPosition += 6;
      }
      
      // Services costs
      if (costBreakdown.servicesTotal > 0) {
        pdf.text('Additional Services', 25, yPosition);
        pdf.text(`${currencySymbol}${costBreakdown.servicesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - 70, yPosition);
        yPosition += 6;
      }
      
      // Subtotal
      pdf.setDrawColor(150, 150, 150);
      pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
      yPosition += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Subtotal', 25, yPosition);
      pdf.text(`${currencySymbol}${costBreakdown.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - 70, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('VAT (15%)', 25, yPosition);
      pdf.text(`${currencySymbol}${costBreakdown.vat.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - 70, yPosition);
      
      // Total
      pdf.setDrawColor(0, 0, 0);
      pdf.line(20, yPosition + 4, pageWidth - 20, yPosition + 4);
      yPosition += 12;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Total Estimate', 25, yPosition);
      pdf.text(`${currencySymbol}${costBreakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - 70, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.text('*This is an estimate. Final pricing may vary based on specific requirements and availability.', 20, yPosition);
    }
    
    // Terms and conditions
    yPosition += 20;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Terms & Conditions', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const terms = [
      '• Quote valid for 30 days from date of issue',
      '• 50% deposit required to confirm booking',
      '• Final payment due 14 days before retreat date',
      '• Cancellation policy applies as per our terms of service',
      '• Prices are subject to availability and may change',
      '• All prices are in South African Rand (ZAR)'
    ];
    
    terms.forEach(term => {
      pdf.text(term, 20, yPosition);
      yPosition += 5;
    });
    
    // Footer with improved branding
    yPosition = pageHeight - 35;
    pdf.setFillColor(43, 71, 51); // #2B4733 - deep green
    pdf.rect(0, yPosition - 5, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text('Thank you for considering Bantu Stall', 20, yPosition + 5);
    pdf.setFontSize(9);
    pdf.text('📧 nontombi@bantustall.com | 📞 +27 61 397 2802 | 🌍 www.bantustall.com', 20, yPosition + 12);
    
    return new Uint8Array(pdf.output('arraybuffer'));
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
}

async function sendUserQuoteEmail(quoteData: any, pdfBase64: string) {
  const now = new Date();
  const filename = `quote_${now.toISOString().split('T')[0]}-${quoteData.contactName.split(' ')[0]}-${Math.random().toString(36).substr(2, 6)}.pdf`;
  
  const emailContent = {
    sender: { name: "Bantu Stall", email: "nontombi@bantustall.com" },
    to: [{ email: quoteData.contactEmail, name: quoteData.contactName }],
    subject: "Your Bantu Stall Quote is Ready 🧾",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">BANTU STALL</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">African Travel & Retreat Platform</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Hi ${quoteData.contactName.split(' ')[0]},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thanks for requesting a corporate retreat quote with Bantu Stall!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Attached is your personalized quote based on the details you submitted. If you'd like to discuss 
            adjustments, add-ons, or any other preferences — just reply to this email and we'll take it from there.
          </p>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #2563eb;">Quote Summary</h3>
            <p><strong>Retreat Goal:</strong> ${quoteData.retreatGoal}</p>
            <p><strong>Group Size:</strong> ${quoteData.groupSize} attendees</p>
            <p><strong>Preferred Dates:</strong> ${quoteData.preferredDates}</p>
            <p><strong>Budget Range:</strong> ${quoteData.budgetRange}</p>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #374151;">Next Steps:</h4>
            <ul style="color: #6b7280; line-height: 1.6;">
              <li>Review the attached detailed quote</li>
              <li>Contact us for any modifications or questions</li>
              <li>Confirm your booking to secure your dates</li>
              <li>We'll handle all the logistics for your perfect retreat</li>
            </ul>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Warm regards,<br>
            The Bantu Stall Team<br>
            <a href="mailto:nontombi@bantustall.com" style="color: #2563eb;">nontombi@bantustall.com</a>
          </p>
        </div>

        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2025 Bantu Stall. All rights reserved.</p>
        </div>
      </div>
    `,
    attachment: [{
      content: pdfBase64,
      name: filename
    }]
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(emailContent),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to send user email:', errorText);
    throw new Error(`Failed to send user email: ${response.status}`);
  }

  console.log('User quote email sent successfully');
}

async function sendNontombiQuoteEmail(quoteData: any, pdfBase64: string) {
  const now = new Date();
  const filename = `quote_${now.toISOString().split('T')[0]}-${quoteData.contactName.split(' ')[0]}-${Math.random().toString(36).substr(2, 6)}.pdf`;
  
  const emailContent = {
    sender: { name: "Bantu Stall System", email: "noreply@bantustall.com" },
    to: [{ email: "nontombi@bantustall.com", name: "Nontombi" }],
    subject: `New Quote Request Received – ${quoteData.contactName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Quote Request Received</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Client Details</h3>
          <p><strong>Name:</strong> ${quoteData.contactName}</p>
          <p><strong>Email:</strong> ${quoteData.contactEmail}</p>
          <p><strong>Phone:</strong> ${quoteData.contactPhone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${quoteData.companyName || 'Not provided'}</p>
          <p><strong>Submitted At:</strong> ${now.toLocaleString()}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Retreat Requirements</h3>
          <p><strong>Retreat Goal:</strong> ${quoteData.retreatGoal}</p>
          <p><strong>Group Size:</strong> ${quoteData.groupSize} attendees</p>
          <p><strong>Preferred Dates:</strong> ${quoteData.preferredDates}</p>
          <p><strong>Duration:</strong> ${quoteData.duration}</p>
          <p><strong>Location Preference:</strong> ${quoteData.locationPreference}</p>
          <p><strong>Budget Range:</strong> ${quoteData.budgetRange}</p>
          <p><strong>Accommodation Type:</strong> ${quoteData.accommodationType}</p>
          
          ${quoteData.selectedVenue ? `
            <p><strong>Selected Venue:</strong> ${quoteData.selectedVenue.name}</p>
            <p><strong>Venue Location:</strong> ${quoteData.selectedVenue.location}, ${quoteData.selectedVenue.country}</p>
          ` : ''}
          
          ${quoteData.activities && quoteData.activities.length > 0 ? `
            <p><strong>Activities:</strong> ${quoteData.activities.join(', ')}</p>
          ` : ''}
          
          ${quoteData.cateringPreferences && quoteData.cateringPreferences.length > 0 ? `
            <p><strong>Catering:</strong> ${quoteData.cateringPreferences.join(', ')}</p>
          ` : ''}
          
          ${quoteData.specialRequests ? `
            <p><strong>Special Requests:</strong> ${quoteData.specialRequests}</p>
          ` : ''}
        </div>

        <p style="margin-top: 30px; color: #64748b;">
          Quote PDF: Attached<br>
          Please follow up accordingly.
        </p>
        
        <p style="color: #64748b;">
          – Bantu Stall Bot
        </p>
      </div>
    `,
    attachment: [{
      content: pdfBase64,
      name: filename
    }]
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(emailContent),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to send Nontombi email:', errorText);
    throw new Error(`Failed to send Nontombi email: ${response.status}`);
  }

  console.log('Nontombi notification email sent successfully');
}

serve(handler);