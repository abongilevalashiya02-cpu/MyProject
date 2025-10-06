import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { 
      trigger, 
      property_id, 
      action_type, 
      admin_notes,
      notification_settings 
    } = await req.json();

    console.log('Processing property workflow automation:', { trigger, property_id, action_type });

    let result;

    switch (trigger) {
      case 'property_submitted':
        result = await handlePropertySubmission(supabaseClient, property_id, notification_settings);
        break;
      
      case 'property_approved':
        result = await handlePropertyApproval(supabaseClient, property_id, admin_notes);
        break;
      
      case 'property_rejected':
        result = await handlePropertyRejection(supabaseClient, property_id, admin_notes);
        break;
      
      case 'bulk_action':
        result = await handleBulkAction(supabaseClient, action_type, property_id);
        break;
      
      case 'review_reminder':
        result = await handleReviewReminder(supabaseClient);
        break;
      
      default:
        throw new Error(`Unknown trigger: ${trigger}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        processed_at: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Workflow automation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handlePropertySubmission(supabaseClient: any, propertyId: string, notificationSettings: any) {
  console.log('Handling property submission:', propertyId);

  // Get property details
  const { data: property, error: propertyError } = await supabaseClient
    .from('property_listings')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (propertyError) throw propertyError;

  const actions = [];

  // 1. Send confirmation email to property owner
  if (notificationSettings?.email_owner !== false) {
    const emailResult = await sendPropertySubmissionEmail(property);
    actions.push({ action: 'owner_email_sent', success: emailResult.success });
  }

  // 2. Notify admin team
  if (notificationSettings?.notify_admin !== false) {
    const adminResult = await notifyAdminTeam(property, 'new_submission');
    actions.push({ action: 'admin_notification_sent', success: adminResult.success });
  }

  // 3. Auto-assign for review based on property type or location
  const assignmentResult = await autoAssignReviewer(supabaseClient, property);
  actions.push({ action: 'auto_assigned_reviewer', success: assignmentResult.success });

  // 4. Create analytics entry
  await trackPropertySubmission(supabaseClient, property);

  // 5. Sync to external CRM (HubSpot)
  if (notificationSettings?.sync_crm !== false) {
    const crmResult = await syncToHubSpot(property);
    actions.push({ action: 'crm_sync', success: crmResult.success });
  }

  return {
    property_id: propertyId,
    status: 'submission_processed',
    actions_completed: actions
  };
}

async function handlePropertyApproval(supabaseClient: any, propertyId: string, adminNotes?: string) {
  console.log('Handling property approval:', propertyId);

  // Get property details
  const { data: property, error: propertyError } = await supabaseClient
    .from('property_listings')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (propertyError) throw propertyError;

  const actions = [];

  // 1. Send approval email to property owner
  const emailResult = await sendApprovalEmail(property, adminNotes);
  actions.push({ action: 'approval_email_sent', success: emailResult.success });

  // 2. Add to search index (if applicable)
  const indexResult = await addToSearchIndex(property);
  actions.push({ action: 'added_to_search_index', success: indexResult.success });

  // 3. Update CRM with approval status
  const crmResult = await updateHubSpotDeal(property, 'approved');
  actions.push({ action: 'crm_updated', success: crmResult.success });

  // 4. Send welcome package
  const welcomeResult = await sendWelcomePackage(property);
  actions.push({ action: 'welcome_package_sent', success: welcomeResult.success });

  // 5. Create onboarding tasks
  const onboardingResult = await createOnboardingTasks(supabaseClient, property);
  actions.push({ action: 'onboarding_created', success: onboardingResult.success });

  return {
    property_id: propertyId,
    status: 'approval_processed',
    actions_completed: actions
  };
}

async function handlePropertyRejection(supabaseClient: any, propertyId: string, adminNotes?: string) {
  console.log('Handling property rejection:', propertyId);

  // Get property details
  const { data: property, error: propertyError } = await supabaseClient
    .from('property_listings')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (propertyError) throw propertyError;

  const actions = [];

  // 1. Send rejection email with feedback
  const emailResult = await sendRejectionEmail(property, adminNotes);
  actions.push({ action: 'rejection_email_sent', success: emailResult.success });

  // 2. Update CRM with rejection status
  const crmResult = await updateHubSpotDeal(property, 'rejected');
  actions.push({ action: 'crm_updated', success: crmResult.success });

  // 3. Schedule follow-up (if resubmission is possible)
  const followUpResult = await scheduleFollowUp(supabaseClient, property);
  actions.push({ action: 'follow_up_scheduled', success: followUpResult.success });

  return {
    property_id: propertyId,
    status: 'rejection_processed',
    actions_completed: actions
  };
}

async function handleBulkAction(supabaseClient: any, actionType: string, propertyIds: string[]) {
  console.log('Handling bulk action:', actionType, 'for', propertyIds.length, 'properties');

  const results = [];

  for (const propertyId of propertyIds) {
    try {
      let result;
      
      switch (actionType) {
        case 'approve':
          result = await handlePropertyApproval(supabaseClient, propertyId);
          break;
        case 'reject':
          result = await handlePropertyRejection(supabaseClient, propertyId);
          break;
        case 'notify':
          result = await sendBulkNotification(supabaseClient, propertyId);
          break;
        default:
          throw new Error(`Unknown bulk action: ${actionType}`);
      }

      results.push({ property_id: propertyId, success: true, result });
    } catch (error) {
      results.push({ property_id: propertyId, success: false, error: error.message });
    }
  }

  return {
    action_type: actionType,
    properties_processed: propertyIds.length,
    results
  };
}

async function handleReviewReminder(supabaseClient: any) {
  console.log('Sending review reminders for pending properties');

  // Get properties pending for more than 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: pendingProperties, error } = await supabaseClient
    .from('property_listings')
    .select('*')
    .eq('status', 'pending')
    .lt('created_at', threeDaysAgo);

  if (error) throw error;

  const reminders = [];

  for (const property of pendingProperties || []) {
    const reminderResult = await sendReviewReminder(property);
    reminders.push({
      property_id: property.id,
      property_name: property.property_name,
      days_pending: Math.floor((Date.now() - new Date(property.created_at).getTime()) / (24 * 60 * 60 * 1000)),
      reminder_sent: reminderResult.success
    });
  }

  return {
    pending_properties: (pendingProperties || []).length,
    reminders_sent: reminders.filter(r => r.reminder_sent).length,
    reminders
  };
}

// Email and notification functions
async function sendPropertySubmissionEmail(property: any) {
  // Integrate with email service (Brevo, SendGrid, etc.)
  console.log('Sending submission confirmation email to:', property.contact_email);
  return { success: true, message_id: 'mock_message_id' };
}

async function sendApprovalEmail(property: any, adminNotes?: string) {
  console.log('Sending approval email to:', property.contact_email);
  return { success: true, message_id: 'mock_message_id' };
}

async function sendRejectionEmail(property: any, adminNotes?: string) {
  console.log('Sending rejection email to:', property.contact_email);
  return { success: true, message_id: 'mock_message_id' };
}

async function sendReviewReminder(property: any) {
  console.log('Sending review reminder for property:', property.property_name);
  return { success: true };
}

async function sendBulkNotification(supabaseClient: any, propertyId: string) {
  console.log('Sending bulk notification for property:', propertyId);
  return { success: true };
}

// CRM and external integrations
async function syncToHubSpot(property: any) {
  console.log('Syncing property to HubSpot:', property.property_name);
  return { success: true, contact_id: 'mock_hubspot_id' };
}

async function updateHubSpotDeal(property: any, status: string) {
  console.log('Updating HubSpot deal status:', status);
  return { success: true, deal_id: 'mock_deal_id' };
}

// Utility functions
async function autoAssignReviewer(supabaseClient: any, property: any) {
  console.log('Auto-assigning reviewer for:', property.property_name);
  return { success: true, reviewer_id: 'mock_reviewer_id' };
}

async function trackPropertySubmission(supabaseClient: any, property: any) {
  console.log('Tracking property submission analytics');
  return { success: true };
}

async function addToSearchIndex(property: any) {
  console.log('Adding property to search index:', property.property_name);
  return { success: true };
}

async function sendWelcomePackage(property: any) {
  console.log('Sending welcome package to:', property.contact_email);
  return { success: true };
}

async function createOnboardingTasks(supabaseClient: any, property: any) {
  console.log('Creating onboarding tasks for:', property.property_name);
  return { success: true };
}

async function scheduleFollowUp(supabaseClient: any, property: any) {
  console.log('Scheduling follow-up for:', property.property_name);
  return { success: true };
}

async function notifyAdminTeam(property: any, type: string) {
  console.log('Notifying admin team about:', type, property.property_name);
  return { success: true };
}