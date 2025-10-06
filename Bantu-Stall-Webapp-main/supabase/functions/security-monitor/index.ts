import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { type, severity, details }: SecurityEvent = await req.json();

    if (!type || !severity) {
      throw new Error("Missing required fields: type and severity");
    }

    // Get client IP and user agent
    const clientIP = req.headers.get("x-forwarded-for") || 
                    req.headers.get("x-real-ip") || 
                    "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Log security event
    const { error: logError } = await supabaseAdmin
      .from('security_events')
      .insert([{
        event_type: type,
        severity,
        ip_address: clientIP,
        details: {
          ...details,
          user_agent: userAgent,
          timestamp: new Date().toISOString()
        }
      }]);

    if (logError) {
      console.error('Failed to log security event:', logError);
      throw logError;
    }

    // Check for suspicious patterns
    if (severity === 'high' || severity === 'critical') {
      const { data: recentEvents } = await supabaseAdmin
        .from('security_events')
        .select('*')
        .eq('ip_address', clientIP)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(10);

      if (recentEvents && recentEvents.length >= 5) {
        // Consider blocking IP if too many high-severity events
        await supabaseAdmin
          .from('blocked_ips')
          .upsert([{
            ip_address: clientIP,
            reason: `Multiple ${severity} security events`,
            blocked_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }], { onConflict: 'ip_address' });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Security event logged successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error in security-monitor function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);