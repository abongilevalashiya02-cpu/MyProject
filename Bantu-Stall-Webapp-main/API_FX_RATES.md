## FX Rates API (Currency Pairs)

A separate RESTful endpoint that returns FX market rates for currency pairs (latest and historical). Implemented as a Supabase Edge Function `fx-rates` (JWT-required). This complements the domain-specific `market-prices` endpoint.

### Base URL
- Supabase Functions: `https://<SUPABASE_PROJECT>.supabase.co/functions/v1/fx-rates`
- Local (Supabase CLI): `http://localhost:54321/functions/v1/fx-rates`

### Authentication
- Requires a valid Supabase JWT (user session or service key).
- Provide via `Authorization: Bearer <token>` header.

### Query Parameters
- pairs: comma-separated currency pairs. Accepts `USDZAR`, `EURUSD`, or with separators `USD/ZAR`, `EUR-USD` (they normalize). Example: `pairs=USDZAR,EURUSD`.
- Or use base and quote: both comma-separated and positional. Example: `base=USD,EUR&quote=ZAR,USD`.
- granularity: `real_time` | `daily` | `intraday` (default: `real_time`).
- interval: `5min` | `15min` | `60min` (intraday only; default: `60min`).
- start / end: ISO dates `YYYY-MM-DD` for historical window (default: last `days`).
- days: integer fallback if start/end omitted (default: `30`).
- limit: max data points for history per pair (default: `100`, max: `5000`).
- include: `latest` | `history` | `both` (default: `both`).
- provider: `alpha` | `exchangerate` (default: `alpha` if `ALPHA_VANTAGE_API_KEY` present; else fallback to exchangerate.host).

### Providers
- Alpha Vantage (recommended): realtime and FX time series (daily/intraday). Set env `ALPHA_VANTAGE_API_KEY` in the function environment.
- exchangerate.host (fallback): free daily latest and timeseries.

### Response (example)
```json
{
  "provider": "alpha_vantage",
  "granularity": "daily",
  "interval": "60min",
  "requested": {
    "pairs": [{"base":"USD","quote":"ZAR"}],
    "start": "2025-09-07",
    "end": "2025-10-07",
    "include": "both",
    "limit": 100
  },
  "data": {
    "USDZAR": {
      "pair": {"base":"USD","quote":"ZAR","key":"USDZAR"},
      "provider": "alpha_vantage",
      "latest": {"price": 18.55, "timestamp": "2025-10-07"},
      "history": [
        {"timestamp": "2025-09-30", "open": 18.3, "high": 18.7, "low": 18.2, "close": 18.5}
      ]
    }
  }
}
```

### Errors
- 400 Bad Request: missing/invalid params.
- 502 Bad Gateway: upstream provider error.

### Examples
- Latest + 30-day daily history for two pairs:
```bash
curl -s -H "Authorization: Bearer $SUPABASE_JWT" \
  "$BASE/functions/v1/fx-rates?pairs=USDZAR,EURUSD&granularity=daily&include=both&limit=60"
```

- Intraday 5min history (last 120 points) and latest for EUR/USD:
```bash
curl -s -H "Authorization: Bearer $SUPABASE_JWT" \
  "$BASE/functions/v1/fx-rates?base=EUR&quote=USD&granularity=intraday&interval=5min&include=both&limit=120"
```

- Use fallback provider explicitly:
```bash
curl -s -H "Authorization: Bearer $SUPABASE_JWT" \
  "$BASE/functions/v1/fx-rates?pairs=USDZAR&provider=exchangerate&include=both&days=14"
```

### Env Vars (Function)
- `ALPHA_VANTAGE_API_KEY` (optional, recommended)
