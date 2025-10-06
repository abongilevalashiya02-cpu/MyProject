import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PdfRequest {
  quotation_id: string;
  include_watermark?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase clients
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const { quotation_id, include_watermark = false }: PdfRequest = await req.json();

    if (!quotation_id) {
      throw new Error("Quotation ID is required");
    }

    // Get quotation with related data
    const { data: quotation, error: quotationError } = await supabaseAdmin
      .from('quotation_requests')
      .select(`
        *,
        quotation_request_line_items (*)
      `)
      .eq('id', quotation_id)
      .single();

    if (quotationError || !quotation) {
      throw new Error("Quotation not found");
    }

    // Check if user has access to this quotation
    if (quotation.user_id !== user.id) {
      // Check if user is admin
      const { data: userRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = userRoles?.some(role => role.role === 'admin');
      if (!isAdmin) {
        throw new Error("Access denied");
      }
    }

    // Generate PDF using external service or library
    const pdfData = await generateQuotationPDF(quotation, include_watermark);

    // Log PDF generation in audit trail
    const { error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert([{
        user_id: user.id,
        action: 'download',
        resource: 'quotation',
        details: {
          quotation_id,
          type: 'pdf_generation',
          include_watermark
        }
      }]);

    if (auditError) {
      console.error('Failed to log audit trail:', auditError);
    }

    // Return PDF as blob
    return new Response(pdfData, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quotation-${quotation.quote_reference || quotation.id}.pdf"`
      },
    });

  } catch (error: any) {
    console.error("Error in quotation-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
};

// PDF generation function (simplified)
async function generateQuotationPDF(quotation: any, includeWatermark: boolean = false): Promise<Uint8Array> {
  // This would integrate with a PDF generation library
  // For now, return a simple PDF placeholder
  const pdfContent = `
    QUOTATION: ${quotation.quote_reference || quotation.id}
    Company: ${quotation.company_name}
    Contact: ${quotation.contact_name}
    Total: R${quotation.total_amount?.toLocaleString() || 'TBD'}
    Status: ${quotation.status}
    ${includeWatermark ? '\n\nDRAFT - NOT FINAL' : ''}
  `;
  
  // Convert to Uint8Array (in reality, you'd use jsPDF or similar)
  return new TextEncoder().encode(pdfContent);
}

serve(handler);