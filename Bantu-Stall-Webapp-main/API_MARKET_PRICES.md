## Market Prices API (Experiential Travel & Education Packages)

A RESTful endpoint that estimates market prices for Bantu Stall's experiential travel and education packages, with historical trends derived from quotation activity. Implemented as a Supabase Edge Function `market-prices` (JWT-required).

Important: It does not return FX rates for currency pairs anymore. The redesigned market-prices endpoint is domain-specific (packages). If you still need currency-pair FX rates, we can add a separate REST endpoint (e.g., `fx-rates`) alongside this one for the real-time quotations flow.

### Base URL
- Supabase Functions: `https://<SUPABASE_PROJECT>.supabase.co/functions/v1/market-prices`
- Local (Supabase CLI): `http://localhost:54321/functions/v1/market-prices`

### Authentication
- Requires a valid Supabase JWT (user session or service key).
- Provide via `Authorization: Bearer <token>` header.

### Query Parameters
- packages: comma-separated package slugs. Supported: `corporate_retreat`, `education_retreat`, `speaker_experience`, `tedx_experience`. Default: `corporate_retreat`.
- categories: optional comma-separated categories to override package recipes (e.g. `accommodation,meals,activities`).
- group_size: integer, default `25`.
- nights: integer, default `3`.
- occupancy: integer people per room, default `2`.
- meals_per_day: integer, default `2`.
- hours_per_day: integer for facilitation/venue usage, default `8`.
- currency: output currency code, default `ZAR`. FX conversion via exchangerate.host.
- include: `latest` | `history` | `both` (default: `both`).
- start / end: historical trend window `YYYY-MM-DD` (default: last `days`).
- days: fallback days for history if start/end omitted (default: `90`).

### Data sources
- service_catalog table for category unit-price medians and pricing models.
- quotation_requests table to build historical average totals per day (filtered by selected services categories).
- exchangerate.host for FX conversions when `currency != ZAR`.

### Response (example)
```json
{
  "domain": "experiential_travel_education",
  "requested": {
    "packages": ["corporate_retreat"],
    "start": "2025-09-07",
    "end": "2025-10-07",
    "include": "both",
    "currency": "ZAR"
  },
  "data": {
    "corporate_retreat": {
      "package": "corporate_retreat",
      "currency": "ZAR",
      "fx_rate_from_ZAR": null,
      "assumptions": {"group_size":25,"nights":3,"occupancy":2,"meals_per_day":2,"hours_per_day":8},
      "breakdown": [
        {"category":"accommodation","unit_price":2500,"estimated_total":93750,"pricing_hint":"daily"},
        {"category":"meals","unit_price":350,"estimated_total":52500,"pricing_hint":"per_person"},
        {"category":"activities","unit_price":600,"estimated_total":15000,"pricing_hint":"per_person"},
        {"category":"facilitation","unit_price":1200,"estimated_total":28800,"pricing_hint":"hourly"},
        {"category":"transport","unit_price":8000,"estimated_total":8000,"pricing_hint":"per_event"},
        {"category":"venue_hire","unit_price":9000,"estimated_total":27000,"pricing_hint":"daily"}
      ],
      "totals": {"subtotal": 217050, "vat": 32558, "total": 249608, "vat_rate": 0.15},
      "history": [
        {"date":"2025-09-13","avg_total":235000},
        {"date":"2025-09-20","avg_total":241500}
      ]
    }
  }
}
```
On missing catalog data per category, the category is included with `unit_price: null` and zero contribution.

### Errors
- 400 Bad Request: missing/invalid params.
- 502 Bad Gateway: provider/database error.

### Examples
- Estimate a corporate retreat with defaults + 90-day history:
```bash
curl -s -H "Authorization: Bearer $SUPABASE_JWT" \
  "$BASE/functions/v1/market-prices?packages=corporate_retreat&include=both"
```

- Education retreat for 40 people, 4 nights, price in USD:
```bash
curl -s -H "Authorization: Bearer $SUPABASE_JWT" \
  "$BASE/functions/v1/market-prices?packages=education_retreat&group_size=40&nights=4&currency=USD"
```

- Custom categories (override recipe) for a speaker experience:
```bash
curl -s -H "Authorization: Bearer $SUPABASE_JWT" \
  "$BASE/functions/v1/market-prices?packages=speaker_experience&categories=venue_hire,av_production,catering"
```

### Implementation Notes
- Function path: `supabase/functions/market-prices/index.ts`.
- CORS enabled; JWT required.
- Uses `service_catalog` for medians by category and `quotation_requests` for trend line.
- VAT assumed at 15% (configurable in code); totals returned with VAT.
- If FX conversion to `currency != ZAR` fails, response falls back to ZAR.

### Env Vars (Function)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (secure DB reads)

### Integration Tips
- Frontend can call via `fetch` with the Supabase session token:
```ts
await fetch(`${base}/functions/v1/market-prices?packages=corporate_retreat&include=both`, {
  headers: { Authorization: `Bearer ${session.access_token}` }
});
```
- Cache responses briefly (e.g., 60–120s) to reduce load.
