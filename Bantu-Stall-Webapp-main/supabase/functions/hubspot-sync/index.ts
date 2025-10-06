import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HubSpotSyncRequest {
  type: 'contact' | 'company' | 'deal';
  data: any;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, email }: HubSpotSyncRequest = await req.json();
    const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY');

    if (!hubspotApiKey) {
      throw new Error('HubSpot API key not configured');
    }

    console.log(`Syncing ${type} to HubSpot for email: ${email}`);

    let hubspotData: any = {};
    let endpoint = '';

    switch (type) {
      case 'contact':
        hubspotData = {
          properties: {
            email: data.email,
            firstname: data.first_name || data.name?.split(' ')[0] || data.full_name?.split(' ')[0],
            lastname: data.last_name || data.name?.split(' ').slice(1).join(' ') || data.full_name?.split(' ').slice(1).join(' '),
            phone: data.phone || data.contact_phone,
            company: data.company || data.company_name || data.organization,
            jobtitle: data.job_title || data.role,
            lifecyclestage: 'lead',
            lead_source: data.source || data.marketing_source || data.heard_from || 'website'
          }
        };
        endpoint = 'https://api.hubapi.com/crm/v3/objects/contacts';
        break;

      case 'company':
        hubspotData = {
          properties: {
            name: data.company_name || data.company,
            domain: data.website_url,
            phone: data.contact_phone,
            industry: data.business_type || data.property_type,
            description: data.description,
            lifecyclestage: 'lead'
          }
        };
        endpoint = 'https://api.hubapi.com/crm/v3/objects/companies';
        break;

      case 'deal':
        hubspotData = {
          properties: {
            dealname: `${data.service_type || data.event_type || 'Quote Request'} - ${data.company || data.organization || 'New Lead'}`,
            amount: data.budget_range || data.total_amount || '0',
            dealstage: 'appointmentscheduled',
            pipeline: 'default',
            closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
          }
        };
        endpoint = 'https://api.hubapi.com/crm/v3/objects/deals';
        break;
    }

    // Create or update contact/company/deal in HubSpot
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      // If contact already exists, try to update instead
      if (type === 'contact' && result.category === 'CONFLICT') {
        const searchResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hubspotApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: data.email
              }]
            }]
          }),
        });

        const searchResult = await searchResponse.json();
        if (searchResult.results && searchResult.results.length > 0) {
          const contactId = searchResult.results[0].id;
          const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${hubspotApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(hubspotData),
          });
          console.log('Updated existing HubSpot contact:', contactId);
          return new Response(JSON.stringify({ success: true, updated: true, id: contactId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      }
      throw new Error(`HubSpot API error: ${result.message}`);
    }

    console.log(`Successfully synced ${type} to HubSpot:`, result.id);

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error syncing to HubSpot:', error);
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