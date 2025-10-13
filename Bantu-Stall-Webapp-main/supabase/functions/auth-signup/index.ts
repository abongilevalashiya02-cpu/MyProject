import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, metadata, redirectUrl }: {
      email: string;
      password: string;
      metadata?: Record<string, unknown>;
      redirectUrl?: string;
    } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Optional: simple rate limit using RPC if available
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    try {
      const { data: allowed } = await (supabaseAdmin as any).rpc("check_signup_rate_limit", {
        _email: email,
        _ip_address: ip,
      });
      if (allowed === false) {
        return new Response(JSON.stringify({ error: "Too many signup attempts. Please try again later." }), {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } catch (_err) {
      // If rate limit RPC not available, ignore silently
    }

    // Create user using Admin API
    const { data: createdUser, error: createError } = await (supabaseAdmin as any).auth.admin.createUser({
      email,
      password,
      user_metadata: metadata ?? {},
    });

    if (createError) {
      const status = String(createError.message || "").toLowerCase().includes("already") ? 409 : 400;
      return new Response(JSON.stringify({ error: createError.message || "Failed to create user" }), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate confirmation link for the user
    const publicSiteUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://bantustall.com";
    const callback = redirectUrl || `${publicSiteUrl.replace(/\/$/, '')}/auth/callback?redirect=/`;

    const { data: linkData, error: linkError } = await (supabaseAdmin as any).auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        redirectTo: callback,
        data: metadata ?? {},
      },
    });

    if (linkError) {
      return new Response(JSON.stringify({ error: linkError.message || "Failed to generate signup link" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const actionLink = (linkData as any)?.properties?.action_link as string | undefined;

    // Attempt to send confirmation email via Resend if configured
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey && actionLink) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Bantu Stall <welcome@bantustall.com>",
          to: [email],
          subject: "Confirm your Bantu Stall account",
          html: `
            <p>Welcome! Please confirm your account by clicking the button below.</p>
            <p>
              <a href="${actionLink}" style="display:inline-block;padding:12px 16px;background:#e97515;color:#fff;border-radius:8px;text-decoration:none">Confirm my account</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${actionLink}">${actionLink}</a></p>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Failed to send confirmation email via Resend", emailErr);
      // Do not fail the whole request if email sending fails; return the link
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: createdUser?.user?.id,
        needsEmailConfirmation: true,
        action_link: actionLink,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("auth-signup function error", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unexpected server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
