import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

// CORS for browser and server usage
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ------------------ Domain model (Experiential Travel/Education) ------------------
// Predefined package "recipes" mapping to catalog categories
const PACKAGE_RECIPES: Record<string, { categories: string[] }> = {
  corporate_retreat: {
    categories: ["accommodation", "meals", "activities", "facilitation", "transport", "venue_hire"],
  },
  education_retreat: {
    categories: ["accommodation", "meals", "workshops", "activities", "transport"],
  },
  speaker_experience: {
    categories: ["venue_hire", "av_production", "catering", "facilitation", "transport"],
  },
  tedx_experience: {
    categories: ["venue_hire", "catering", "av_production", "facilitation"],
  },
};

// ------------------ Query types ------------------
interface PackageQuery {
  packages?: string; // comma-separated package slugs (e.g. corporate_retreat,education_retreat)
  categories?: string; // comma-separated explicit categories (overrides recipe)
  group_size?: string; // integer, default 25
  nights?: string;     // integer, default 3
  occupancy?: string;  // integer, default 2 (people per room)
  meals_per_day?: string; // integer, default 2
  hours_per_day?: string; // integer, default 8 for facilitation
  currency?: string;   // target currency, default ZAR
  include?: "latest" | "history" | "both"; // default both
  start?: string; // history start date YYYY-MM-DD
  end?: string;   // history end date YYYY-MM-DD
  days?: string;  // fallback history window (default 90)
}

interface CatalogRow {
  service_category: string;
  avg_price: number;
  pricing_model: "hourly" | "daily" | "per_person" | "per_event" | "fixed" | string;
  currency: string | null;
}

// ------------------ Helpers ------------------
function httpJson(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
    ...init,
  });
}

function badRequest(message: string) {
  return httpJson({ error: message }, { status: 400 });
}

function clampInt(val: string | undefined, def: number, min: number, max: number): number {
  const n = parseInt(val ?? "", 10);
  if (Number.isFinite(n)) return Math.max(min, Math.min(max, n));
  return def;
}

function pickPackages(q: PackageQuery): string[] {
  const names = (q.packages || "corporate_retreat").split(",").map((s) => s.trim()).filter(Boolean);
  return Array.from(new Set(names));
}

function pickCategories(pkgName: string, q: PackageQuery): string[] {
  if (q.categories) {
    return q.categories.split(",").map((s) => s.trim()).filter(Boolean);
  }
  const recipe = PACKAGE_RECIPES[pkgName];
  return recipe?.categories || [];
}

function normalizeCurrency(cur?: string | null): string {
  return (cur || "ZAR").toUpperCase();
}

// Simple VAT calculation (South Africa default 15%)
const DEFAULT_VAT_RATE = 0.15;

// Simple FX conversion via exchangerate.host (free). Only used if currency != ZAR.
async function convertAmount(amountZAR: number, target: string): Promise<{ amount: number; rate: number }>
{
  const tgt = target.toUpperCase();
  if (tgt === "ZAR") return { amount: amountZAR, rate: 1 };
  const url = new URL("https://api.exchangerate.host/convert");
  url.searchParams.set("from", "ZAR");
  url.searchParams.set("to", tgt);
  url.searchParams.set("amount", String(amountZAR));
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json?.success) throw new Error("FX conversion failed");
  return { amount: json.result as number, rate: json.info?.rate as number };
}

// Given a set of catalog rows for one category, compute a representative unit price
function computeCategoryUnitPrice(rows: CatalogRow[]): number | null {
  const prices = rows.map((r) => r.avg_price).filter((v) => typeof v === "number" && Number.isFinite(v));
  if (prices.length === 0) return null;
  // median to reduce outlier impact
  const sorted = prices.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Estimate cost for a category based on pricing model and usage assumptions
function estimateCategoryCost(
  category: string,
  rows: CatalogRow[],
  params: { groupSize: number; nights: number; occupancy: number; mealsPerDay: number; hoursPerDay: number }
) {
  const unitPrice = computeCategoryUnitPrice(rows);
  if (!unitPrice) {
    return { category, unit_price: null as number | null, estimated_total: 0, pricing_hint: "no_data" };
  }

  // prefer the most common pricing_model in this category
  const freq: Record<string, number> = {};
  for (const r of rows) freq[r.pricing_model] = (freq[r.pricing_model] || 0) + 1;
  const model = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

  const { groupSize, nights, occupancy, mealsPerDay, hoursPerDay } = params;

  let total = 0;
  switch (model) {
    case "per_person":
      // activities/meals often per person; meals likely per person per day
      if (category === "meals") total = unitPrice * groupSize * nights * mealsPerDay;
      else total = unitPrice * groupSize; // single activity/session default
      break;
    case "daily":
      if (category === "accommodation") total = unitPrice * nights * Math.ceil(groupSize / Math.max(1, occupancy));
      else total = unitPrice * Math.max(1, nights);
      break;
    case "hourly":
      total = unitPrice * hoursPerDay * Math.max(1, nights);
      break;
    case "per_event":
    case "fixed":
    default:
      total = unitPrice; // base per-event estimate
      break;
  }

  return { category, unit_price: unitPrice, estimated_total: Math.max(0, Math.round(total)), pricing_hint: model };
}

async function fetchCatalogByCategories(supabaseAdmin: any, categories: string[]) {
  const { data, error } = await supabaseAdmin
    .from("service_catalog")
    .select("service_category,avg_price,pricing_model,currency")
    .in("service_category", categories);
  if (error) throw error;
  const rows = (data || []) as CatalogRow[];
  const byCat: Record<string, CatalogRow[]> = {};
  for (const r of rows) {
    (byCat[r.service_category] ||= []).push(r);
  }
  return byCat;
}

async function buildHistoryFromQuotations(
  supabaseAdmin: any,
  categories: string[],
  start: string,
  end: string
) {
  // Use quotation_requests as proxy for market price over time
  // Filter by overlap with selected_services categories
  let query = supabaseAdmin
    .from("quotation_requests")
    .select("created_at,total_amount,selected_services,currency,status")
    .gte("created_at", start)
    .lte("created_at", end);

  // Not all rows have selected_services; where present, filter for overlap
  if (categories.length > 0) {
    // PostgREST overlap operator via supabase-js: .overlaps
    query = query.overlaps("selected_services", categories as any);
  }

  const { data, error } = await query;
  if (error) throw error;

  type Point = { date: string; totals: number[] };
  const map: Record<string, Point> = {};
  for (const row of data || []) {
    const date = new Date(row.created_at).toISOString().slice(0, 10);
    const amt = typeof row.total_amount === "number" ? row.total_amount : 0;
    if (!map[date]) map[date] = { date, totals: [] };
    if (amt > 0) map[date].totals.push(amt);
  }

  const points = Object.values(map)
    .map((p) => ({ date: p.date, avg_total: p.totals.length ? Math.round(p.totals.reduce((a, b) => a + b, 0) / p.totals.length) : 0 }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return points;
}

// ------------------ HTTP handler ------------------
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "GET") {
      return badRequest("Only GET is supported. Use query parameters.");
    }

    // Auth: required (verify_jwt = true in config)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return httpJson({ error: "Authorization header required" }, { status: 401 });

    // Supabase admin client for secure reads/aggregations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const q = Object.fromEntries(url.searchParams.entries()) as PackageQuery;

    // Defaults and params
    const packages = pickPackages(q);
    const groupSize = clampInt(q.group_size, 25, 1, 10000);
    const nights = clampInt(q.nights, 3, 1, 90);
    const occupancy = clampInt(q.occupancy, 2, 1, 6);
    const mealsPerDay = clampInt(q.meals_per_day, 2, 0, 5);
    const hoursPerDay = clampInt(q.hours_per_day, 8, 1, 16);
    const targetCurrency = normalizeCurrency(q.currency);
    const include = (q.include || "both") as NonNullable<PackageQuery["include"]>;

    const today = new Date().toISOString().slice(0, 10);
    const days = clampInt(q.days, 90, 1, 3650);
    const start = q.start || new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const end = q.end || today;

    // For each package, compute a market price estimate
    const results: Record<string, any> = {};

    for (const pkgName of packages) {
      const categories = pickCategories(pkgName, q);
      if (categories.length === 0) {
        results[pkgName] = { error: `No categories found for package '${pkgName}'. Provide categories=... or use a known package.` };
        continue;
      }

      // Fetch catalog data
      const byCat = await fetchCatalogByCategories(supabaseAdmin, categories);

      // Estimate components
      const components = categories.map((cat) =>
        estimateCategoryCost(cat, byCat[cat] || [], { groupSize, nights, occupancy, mealsPerDay, hoursPerDay })
      );

      // Subtotal in ZAR (catalog typically in ZAR). If catalog rows specify other currency, this is an estimate.
      const subtotalZAR = components.reduce((sum, c) => sum + (c?.estimated_total || 0), 0);
      const vatZAR = Math.round(subtotalZAR * DEFAULT_VAT_RATE);
      const totalZAR = subtotalZAR + vatZAR;

      let currency = "ZAR";
      let subtotal = subtotalZAR;
      let vat = vatZAR;
      let total = totalZAR;
      let fxRate: number | null = null;

      if (targetCurrency !== "ZAR") {
        try {
          const conv = await convertAmount(totalZAR, targetCurrency);
          fxRate = conv.rate;
          currency = targetCurrency;
          total = Math.round(conv.amount);
          subtotal = Math.round(total / (1 + DEFAULT_VAT_RATE));
          vat = total - subtotal;
        } catch (e) {
          // keep ZAR if FX fails
          currency = "ZAR";
        }
      }

      const pkgResult: any = {
        package: pkgName,
        currency,
        fx_rate_from_ZAR: fxRate,
        assumptions: { group_size: groupSize, nights, occupancy, meals_per_day: mealsPerDay, hours_per_day: hoursPerDay },
        breakdown: components,
        totals: { subtotal, vat, total, vat_rate: DEFAULT_VAT_RATE },
      };

      if (include === "history" || include === "both") {
        try {
          const historyPoints = await buildHistoryFromQuotations(supabaseAdmin, categories, start, end);
          pkgResult.history = historyPoints;
        } catch (e: any) {
          pkgResult.history_error = e?.message || String(e);
        }
      }

      results[pkgName] = pkgResult;
    }

    return httpJson({
      domain: "experiential_travel_education",
      requested: {
        packages,
        start,
        end,
        include,
        currency: targetCurrency,
      },
      data: results,
    }, { status: 200 });
  } catch (error: any) {
    console.error("market-prices (packages) error:", error);
    return httpJson({ error: error?.message || "Unexpected error" }, { status: 502 });
  }
});
