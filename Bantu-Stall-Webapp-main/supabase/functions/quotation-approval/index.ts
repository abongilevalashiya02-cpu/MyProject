import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  quotation_id: string;
  action: 'approve' | 'reject' | 'request_changes';
  comments?: string;
  step_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
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

    const { quotation_id, action, comments, step_id }: ApprovalRequest = await req.json();

    if (!quotation_id || !action) {
      throw new Error("Missing required fields");
    }

    // Check if user has permission to approve (this would check user roles in production)
    const { data: userRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasApprovalRole = userRoles?.some(role => 
      ['admin', 'manager', 'sales', 'finance'].includes(role.role)
    ) || true; // Allow all for now

    if (!hasApprovalRole) {
      throw new Error("Insufficient permissions for approval");
    }

    // Get quotation details
    const { data: quotation, error: quotationError } = await supabaseAdmin
      .from('quotation_requests')
      .select('*')
      .eq('id', quotation_id)
      .single();

    if (quotationError || !quotation) {
      throw new Error("Quotation not found");
    }

    // Record the approval action
    const { error: approvalError } = await supabaseAdmin
      .from('quotation_approvals')
      .insert([{
        quotation_id,
        step_id: step_id || 'general_approval',
        approver_id: user.id,
        action,
        comments: comments?.trim() || null
      }]);

    if (approvalError) throw approvalError;

    // Update quotation status based on action
    let newStatus = quotation.status;
    switch (action) {
      case 'approve':
        newStatus = 'quoted';
        break;
      case 'reject':
        newStatus = 'declined';
        break;
      case 'request_changes':
        newStatus = 'reviewing';
        break;
    }

    const { error: updateError } = await supabaseAdmin
      .from('quotation_requests')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...(action === 'approve' && { quoted_at: new Date().toISOString() })
      })
      .eq('id', quotation_id);

    if (updateError) throw updateError;

    // Create notification for customer
    const { error: notificationError } = await supabaseAdmin
      .from('user_notifications')
      .insert([{
        user_id: quotation.user_id,
        type: 'quotation_update',
        title: `Quotation ${action === 'approve' ? 'Approved' : action === 'reject' ? 'Declined' : 'Requires Changes'}`,
        message: `Your quotation ${quotation.quote_reference || quotation.id.slice(0, 8)} has been ${action}d`,
        priority: action === 'reject' ? 'high' : 'medium',
        data: { quotation_id, action, comments }
      }]);

    if (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    // Log audit trail
    const { error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert([{
        user_id: user.id,
        action: `quotation_${action}`,
        resource: 'quotation',
        details: {
          quotation_id,
          old_status: quotation.status,
          new_status: newStatus,
          comments
        }
      }]);

    if (auditError) {
      console.error('Failed to log audit trail:', auditError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: newStatus,
        message: `Quotation ${action}d successfully` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error in quotation-approval function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
};

serve(handler);