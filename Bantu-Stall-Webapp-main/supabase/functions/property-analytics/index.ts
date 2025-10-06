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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { dateRange, metrics } = await req.json();

    console.log('Generating property analytics report...');

    // Build base query
    let query = supabaseClient
      .from('property_listings')
      .select('*');

    // Apply date range if provided
    if (dateRange?.start && dateRange?.end) {
      query = query
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end);
    }

    const { data: properties, error } = await query;

    if (error) {
      throw error;
    }

    // Generate comprehensive analytics
    const analytics = generateAnalytics(properties || [], metrics);

    // Send email report if requested
    if (metrics?.includes('email_report')) {
      await sendAnalyticsReport(analytics);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analytics,
        generated_at: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Analytics generation error:', error);
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

function generateAnalytics(properties: any[], requestedMetrics: string[] = []) {
  const now = new Date();
  
  // Basic metrics
  const totalProperties = properties.length;
  const approvedProperties = properties.filter(p => p.status === 'approved').length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  const rejectedProperties = properties.filter(p => p.status === 'rejected').length;

  // Conversion metrics
  const conversionRate = totalProperties > 0 ? (approvedProperties / totalProperties) * 100 : 0;
  
  // Capacity analytics
  const capacities = properties.map(p => p.max_capacity || 0);
  const avgCapacity = capacities.reduce((a, b) => a + b, 0) / capacities.length || 0;
  const maxCapacity = Math.max(...capacities, 0);
  const minCapacity = Math.min(...capacities.filter(c => c > 0), 0);

  // Location analytics
  const locationStats = properties.reduce((acc, p) => {
    acc[p.location] = (acc[p.location] || 0) + 1;
    return acc;
  }, {});

  const topLocations = Object.entries(locationStats)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Property type analytics
  const typeStats = properties.reduce((acc, p) => {
    acc[p.property_type] = (acc[p.property_type] || 0) + 1;
    return acc;
  }, {});

  // Time-based analytics
  const monthlyData = generateMonthlyData(properties);
  const weeklyGrowth = calculateWeeklyGrowth(properties);

  // Feature analytics
  const featureStats = calculateFeatureStats(properties);
  
  // Price range analytics
  const priceStats = properties.reduce((acc, p) => {
    acc[p.price_range_usd] = (acc[p.price_range_usd] || 0) + 1;
    return acc;
  }, {});

  return {
    summary: {
      total_properties: totalProperties,
      approved_properties: approvedProperties,
      pending_properties: pendingProperties,
      rejected_properties: rejectedProperties,
      conversion_rate: Math.round(conversionRate * 100) / 100
    },
    capacity: {
      average: Math.round(avgCapacity),
      maximum: maxCapacity,
      minimum: minCapacity,
      distribution: generateCapacityDistribution(capacities)
    },
    locations: {
      top_locations: topLocations,
      total_locations: Object.keys(locationStats).length
    },
    property_types: typeStats,
    temporal: {
      monthly_data: monthlyData,
      weekly_growth: weeklyGrowth
    },
    features: featureStats,
    pricing: priceStats,
    insights: generateInsights(properties)
  };
}

function generateMonthlyData(properties: any[]) {
  const monthlyData = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = date.toISOString();
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    
    const monthProperties = properties.filter(p => 
      p.created_at >= monthStart && p.created_at <= monthEnd
    );

    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total: monthProperties.length,
      approved: monthProperties.filter(p => p.status === 'approved').length,
      pending: monthProperties.filter(p => p.status === 'pending').length,
      rejected: monthProperties.filter(p => p.status === 'rejected').length
    });
  }
  
  return monthlyData;
}

function calculateWeeklyGrowth(properties: any[]) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = properties.filter(p => new Date(p.created_at) >= oneWeekAgo).length;
  const lastWeek = properties.filter(p => 
    new Date(p.created_at) >= twoWeeksAgo && new Date(p.created_at) < oneWeekAgo
  ).length;

  const growthRate = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

  return {
    this_week: thisWeek,
    last_week: lastWeek,
    growth_rate: Math.round(growthRate * 100) / 100
  };
}

function calculateFeatureStats(properties: any[]) {
  const features = {
    eco_friendly: 0,
    luxury: 0,
    indoor_focus: 0,
    outdoor_focus: 0,
    csr_alignment: 0
  };

  properties.forEach(p => {
    if (p.eco_friendly) features.eco_friendly++;
    if (p.luxury) features.luxury++;
    if (p.indoor_focus) features.indoor_focus++;
    if (p.outdoor_focus) features.outdoor_focus++;
    if (p.csr_alignment) features.csr_alignment++;
  });

  return features;
}

function generateCapacityDistribution(capacities: number[]) {
  const ranges = {
    '1-50': 0,
    '51-100': 0,
    '101-200': 0,
    '201-500': 0,
    '500+': 0
  };

  capacities.forEach(capacity => {
    if (capacity <= 50) ranges['1-50']++;
    else if (capacity <= 100) ranges['51-100']++;
    else if (capacity <= 200) ranges['101-200']++;
    else if (capacity <= 500) ranges['201-500']++;
    else ranges['500+']++;
  });

  return ranges;
}

function generateInsights(properties: any[]) {
  const insights = [];
  
  // Most popular property type
  const typeStats = properties.reduce((acc, p) => {
    acc[p.property_type] = (acc[p.property_type] || 0) + 1;
    return acc;
  }, {});
  
  const mostPopularType = Object.entries(typeStats)
    .sort(([,a], [,b]) => b - a)[0];

  if (mostPopularType) {
    insights.push(`${mostPopularType[0]} is the most popular property type with ${mostPopularType[1]} listings`);
  }

  // Approval rate insight
  const approvalRate = (properties.filter(p => p.status === 'approved').length / properties.length) * 100;
  insights.push(`Current approval rate is ${Math.round(approvalRate)}%`);

  // Capacity insight
  const avgCapacity = properties.reduce((sum, p) => sum + (p.max_capacity || 0), 0) / properties.length;
  insights.push(`Average property capacity is ${Math.round(avgCapacity)} guests`);

  return insights;
}

async function sendAnalyticsReport(analytics: any) {
  // This would integrate with email service
  console.log('Analytics report would be sent via email:', analytics.summary);
}