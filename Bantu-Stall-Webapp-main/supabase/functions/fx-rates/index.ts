import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS for browser and server usage
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---- Types ----
interface FxQuery {
  pairs?: string; // e.g. "USDZAR,EURUSD" or with separators "USD/ZAR,EUR-USD"
  base?: string;  // optional alternative to pairs, can be comma-separated
  quote?: string; // optional alternative to pairs, can be comma-separated
  granularity?: "real_time" | "daily" | "intraday"; // default real_time
  interval?: "5min" | "15min" | "60min"; // intraday only
  start?: string; // ISO date e.g. 2025-01-01
  end?: string;   // ISO date e.g. 2025-01-31
  days?: string;  // integer fallback for historical window
  limit?: string; // integer to limit returned points
  include?: "latest" | "history" | "both"; // default both
  provider?: "alpha" | "exchangerate"; // choose data source
}

interface CurrencyPair { base: string; quote: string; key: string; }

function httpJson(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
    ...init,
  });
}

function badRequest(message: string) {
  return httpJson({ error: message }, { status: 400 });
}

function providerError(message: string, status = 502) {
  return httpJson({ error: message }, { status });
}

function normalizePairToken(token: string): CurrencyPair | null {
  const cleaned = token.trim().replace(/[^a-zA-Z]/g, "").toUpperCase();
  if (cleaned.length !== 6) return null;
  return { base: cleaned.slice(0, 3), quote: cleaned.slice(3, 6), key: cleaned };
}

function parsePairs(q: FxQuery): CurrencyPair[] | null {
  const results: CurrencyPair[] = [];
  if (q.pairs) {
    const tokens = q.pairs.split(",");
    for (const t of tokens) {
      const p = normalizePairToken(t);
      if (!p) return null;
      results.push(p);
    }
    return results;
  }
  if (q.base && q.quote) {
    const bases = q.base.split(",");
    const quotes = q.quote.split(",");
    if (quotes.length !== bases.length) return null;
    for (let i = 0; i < bases.length; i++) {
      const p = normalizePairToken(`${bases[i]}${quotes[i]}`);
      if (!p) return null;
      results.push(p);
    }
    return results;
  }
  return null;
}

function clampInt(val: string | undefined, def: number, min: number, max: number): number {
  const n = parseInt(val ?? "", 10);
  if (Number.isFinite(n)) {
    return Math.max(min, Math.min(max, n));
  }
  return def;
}

// ---- Providers ----
const ALPHA_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");

async function fetchLatestAlpha(base: string, quote: string) {
  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "CURRENCY_EXCHANGE_RATE");
  url.searchParams.set("from_currency", base);
  url.searchParams.set("to_currency", quote);
  url.searchParams.set("apikey", ALPHA_KEY || "");
  const res = await fetch(url.toString());
  const json = await res.json();
  const data = json["Realtime Currency Exchange Rate"]; // per API spec
  if (!data) throw new Error(json?.Note || json?.Information || "Alpha Vantage realtime response malformed");
  const price = parseFloat(data["5. Exchange Rate"]);
  const ts = data["6. Last Refreshed"];
  if (!Number.isFinite(price)) throw new Error("Alpha Vantage realtime price missing");
  return { price, timestamp: ts };
}

async function fetchHistoryAlpha(base: string, quote: string, granularity: "daily" | "intraday", interval: "5min" | "15min" | "60min", limit: number, start?: string, end?: string) {
  const url = new URL("https://www.alphavantage.co/query");
  if (granularity === "daily") {
    url.searchParams.set("function", "FX_DAILY");
  } else {
    url.searchParams.set("function", "FX_INTRADAY");
    url.searchParams.set("interval", interval);
  }
  url.searchParams.set("from_symbol", base);
  url.searchParams.set("to_symbol", quote);
  url.searchParams.set("apikey", ALPHA_KEY || "");
  url.searchParams.set("outputsize", "full");

  const res = await fetch(url.toString());
  const json = await res.json();
  if (!res.ok || json?.Note || json?.Information || json?."Error Message") {
    const msg = json?.Note || json?.Information || json?.["Error Message"] || "Alpha Vantage time series error";
    throw new Error(msg);
  }

  let seriesKey = "";
  if (granularity === "daily") {
    seriesKey = "Time Series FX (Daily)";
  } else {
    seriesKey = `Time Series FX (${interval})`;
  }
  const series = json[seriesKey];
  if (!series) throw new Error("Alpha Vantage time series missing");

  const points = Object.entries(series).map(([ts, v]: [string, any]) => ({
    timestamp: ts,
    open: parseFloat(v["1. open"]),
    high: parseFloat(v["2. high"]),
    low: parseFloat(v["3. low"]),
    close: parseFloat(v["4. close"]),
  }))
  .filter((p) => {
    if (start && p.timestamp < start) return false;
    if (end && p.timestamp > end) return false;
    return true;
  })
  .sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));

  const sliced = limit > 0 ? points.slice(Math.max(0, points.length - limit)) : points;
  return sliced;
}

async function fetchLatestExchangerateHost(pairs: CurrencyPair[]) {
  const byBase: Record<string, string[]> = {};
  for (const { base, quote } of pairs) {
    (byBase[base] ||= []).push(quote);
  }
  const out: Record<string, { price: number; timestamp: string }> = {};
  await Promise.all(Object.entries(byBase).map(async ([base, quotes]) => {
    const url = new URL("https://api.exchangerate.host/latest");
    url.searchParams.set("base", base);
    url.searchParams.set("symbols", quotes.join(","));
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!json?.success) throw new Error("exchangerate.host latest error");
    const ts = json?.date;
    for (const q of quotes) {
      const price = json?.rates?.[q];
      if (typeof price === "number") {
        out[`${base}${q}`] = { price, timestamp: ts };
      }
    }
  }));
  return out;
}

async function fetchHistoryExchangerateHost(base: string, quote: string, start: string, end: string, limit: number) {
  const url = new URL("https://api.exchangerate.host/timeseries");
  url.searchParams.set("base", base);
  url.searchParams.set("symbols", quote);
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json?.success) throw new Error("exchangerate.host timeseries error");
  const rates = json?.rates ?? {};
  const points = Object.entries(rates).map(([date, obj]: [string, any]) => ({
    timestamp: date,
    close: obj?.[quote] as number,
  })).sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
  const sliced = limit > 0 ? points.slice(Math.max(0, points.length - limit)) : points;
  return sliced;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (req.method !== "GET") {
      return badRequest("Only GET is supported. Use query parameters.");
    }

    const url = new URL(req.url);
    const q: FxQuery = Object.fromEntries(url.searchParams.entries()) as any;

    const granularity = (q.granularity || "real_time") as FxQuery["granularity"];
    const interval = (q.interval || "60min") as Required<FxQuery>["interval"];
    const include = (q.include || "both") as Required<FxQuery>["include"];
    const limit = clampInt(q.limit, 100, 1, 5000);

    const pairs = parsePairs(q);
    if (!pairs || pairs.length === 0) {
      return badRequest("Provide currency pairs via pairs=USDZAR,EURUSD or base=USD&quote=ZAR");
    }

    const today = new Date().toISOString().slice(0, 10);
    const days = clampInt(q.days, 30, 1, 3650);
    const start = q.start || new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const end = q.end || today;

    const requestedProvider = q.provider;
    const useAlpha = (requestedProvider === "alpha" || (!requestedProvider && !!ALPHA_KEY)) && !!ALPHA_KEY;
    const providerName = useAlpha ? "alpha_vantage" : "exchangerate_host";

    const results: Record<string, any> = {};

    if (useAlpha) {
      await Promise.all(pairs.map(async (p) => {
        const entry: any = { pair: p, provider: providerName };
        if (include === "latest" || include === "both") {
          try {
            entry.latest = await fetchLatestAlpha(p.base, p.quote);
          } catch (e: any) {
            entry.latest_error = e?.message || String(e);
          }
        }
        if (include === "history" || include === "both") {
          try {
            const histGran = granularity === "real_time" ? "daily" : granularity;
            entry.history = await fetchHistoryAlpha(p.base, p.quote, histGran as any, interval, limit, start, end);
          } catch (e: any) {
            entry.history_error = e?.message || String(e);
          }
        }
        results[p.key] = entry;
      }));
    } else {
      if (include === "latest" || include === "both") {
        const latestMap = await fetchLatestExchangerateHost(pairs);
        for (const p of pairs) {
          results[p.key] = { pair: p, provider: providerName, latest: latestMap[p.key] };
        }
      } else {
        for (const p of pairs) {
          results[p.key] = { pair: p, provider: providerName };
        }
      }
      if (include === "history" || include === "both") {
        await Promise.all(pairs.map(async (p) => {
          try {
            const hist = await fetchHistoryExchangerateHost(p.base, p.quote, start, end, limit);
            results[p.key].history = hist;
            if (!results[p.key].latest && hist.length > 0) {
              const last = hist[hist.length - 1];
              results[p.key].latest = { price: last.close, timestamp: last.timestamp };
            }
          } catch (e: any) {
            results[p.key].history_error = e?.message || String(e);
          }
        }));
      }
    }

    return httpJson({
      provider: providerName,
      granularity,
      interval: granularity === "intraday" ? interval : undefined,
      requested: {
        pairs: pairs.map((p) => ({ base: p.base, quote: p.quote })),
        start,
        end,
        include,
        limit,
      },
      data: results,
    }, { status: 200 });
  } catch (error: any) {
    console.error("fx-rates error:", error);
    return providerError(error?.message || "Unexpected error", 502);
  }
});
