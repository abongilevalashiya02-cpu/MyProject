## Bantu Stall Webapp — Codebase Overview (for Backend Intern)

Last updated: 2025-10-07

This document summarizes the architecture, backend integrations, data model, security, and developer workflow for the Bantu Stall web application. It is optimized for backend onboarding and day-to-day reference.

### High-level Architecture
- **Frontend**: Vite + React + TypeScript SPA with shadcn-ui and Tailwind CSS.
- **Backend/Platform**: Supabase (Auth, Postgres, RPC, Storage) + Edge Functions (Deno).
- **Integrations**: Brevo (transactional email), Resend (welcome email), HubSpot (CRM sync).
- **State/Queries**: Zustand store(s) + React Query.
- **Build/Tooling**: Vite, ESLint, PostCSS, Tailwind.

### Runbook (Local Development)
- Requirements: Node.js (via nvm), npm.
- Install deps: `npm i`
- Start dev server: `npm run dev` (Vite on port 8080 per `vite.config.ts`)
- Lint: `npm run lint`
- Preview prod build: `npm run build && npm run preview`
- Supabase (optional, for full local stack): `supabase start` then configure `.env` to point VITE_SUPABASE_URL/KEY at local instance.

### Project Structure (selected)
- `Bantu-Stall-Webapp-main/`
  - `src/`
    - `App.tsx`: App providers (React Query, Helmet, contexts), routing, guards.
    - `main.tsx`: React root.
    - `components/`: UI components and features (auth, quotation, venues, etc.).
    - `pages/`: Route-level pages (e.g., `QuotationFormPage.tsx`, `CentralizedDashboard.tsx`).
    - `contexts/`: `AuthContext.tsx`, `AppStateContext.tsx`.
    - `hooks/`: cross-cutting hooks (security, performance, pricing, quotations, etc.).
    - `config/`: `environment.ts` central config, feature flags.
    - `integrations/supabase/`: `client.ts` (typed client), `types.ts` (DB types), `queries/` (RPC wrappers).
    - `utils/`, `services/`, `data/`, `types/`: helpers, API client, static data, type defs.
  - `supabase/`
    - `config.toml`: local Supabase configuration incl. Edge Functions `verify_jwt` rules.
    - `functions/`: Deno Edge Functions (email, analytics, workflow, PDFs, etc.).
    - `migrations/`: SQL schema, functions, and RLS policies.
  - `public/`: static assets, PWA files.
  - `package.json`, `vite.config.ts`, `tailwind.config.ts`, `eslint.config.js`, `postcss.config.js`.

### Frontend Entry & Routing
- Router and route guards configured in `src/App.tsx`.
  - `ProtectedRoute`: redirects unauthenticated users to `/login` with intended destination.
  - `LandingPageGuard`: if authenticated, redirects to dashboard section based on `user.user_metadata`.
- Main modules: quotations, venues/properties, content/learning, profiles/settings, admin.

### Authentication & Authorization
- Supabase Auth with email/password and OAuth (`google`, `linkedin_oidc`).
- `AuthContext.tsx` owns session state, sign up/in/out flows, password reset, and welcome email trigger.
- Profiles: verified/created via DB trigger (presence is checked on sign-in).
- Role-based access: `user_roles` table + planned enforcement (see `ProtectedRoute` placeholder and DB `has_role` function). Many admin paths currently rely on frontend guard + DB RLS.

### Configuration & Environment
- `src/config/environment.ts` centralizes config (Supabase URL/keys, API base URL, feature flags).
  - Note: contains fallback Supabase URL and a publishable anon key. Move secrets to `.env` variables and remove hardcoded fallbacks for production.
- API base: `${supabaseUrl}/functions/v1` used for Edge Function invocation via Supabase client.

### API Client (Edge Functions)
- `src/utils/apiClient.ts` provides a singleton with retries/timeouts over `supabase.functions.invoke`.
- Convenience methods: `sendQuotation`, `approveQuotation`, `generatePdf`, `syncToHubspot`, `sendNotification`.
- Direct invocations also appear across features (e.g., `quotation-notification`, `security-monitor`, `backup-service`).

### Supabase Edge Functions (current repository)
All functions live under `supabase/functions/<name>/index.ts`. Key functions and purpose:
- `automation-emails`: Sends templated emails via Brevo for onboarding, payment/booking confirmations, newsletter welcome.
- `backup-service`: Simulated backup/restore/verify workflows, logs to `audit_logs` and `security_events`.
- `golden-ticket-notification`: Notifies admin + applicant via Brevo; syncs Contact/Deal to HubSpot.
- `horo-application-notification`: Logs Horo applications and prepares email content (integration point for an email provider).
- `hubspot-sync`: Creates/updates Contact/Company/Deal in HubSpot.
- `property-analytics`: Aggregates metrics over `property_listings`; can send email reports (stub).
- `property-listing-notification`: Notifies admin and property owner via Brevo; reads `profiles` if user logged in.
- `property-workflow-automation`: Handles submission/approval/rejection/bulk/review reminders; stubs for email/CRM/indexing.
- `quotation-approval`: Authenticated approval actions; writes `quotation_approvals`, updates `quotation_requests`, creates `user_notifications`, and logs `audit_logs`.
- `quotation-notification`: For both ad-hoc quote requests (generates PDF via jsPDF and emails) and existing quotations; emails client and admin via Brevo.
- `quotation-pdf`: Authenticated PDF generation for `quotation_requests` with audit log.
- `security-monitor`: Logs `security_events`; may block IPs in `blocked_ips` on repeated high-severity events.
- `send-welcome-email`: Sends welcome email via Resend using `RESEND_API_KEY`.
- `system-monitor`: Returns metrics/health checks/alerts and logs system metrics in `security_events`.

Verify-JWT settings (from `supabase/config.toml`):
- JWT required: `hubspot-sync`, `automation-emails`, `quotation-notification`, `horo-application-notification`, `property-listing-notification`, `golden-ticket-notification`.
- No JWT: `security-monitor`, `performance-analytics` (referenced), `system-monitor`, `backup-service` (these may be callable without auth; design accordingly).

Invoked but not present in repo (stubs or planned):
- `chat-support`, `performance-analytics`, `user-analytics`, `error-analytics`, `flight-pricing`, `send-email`, `send-notification`.

### Database Model (selected)
Type-safe definitions in `src/integrations/supabase/types.ts`. Core tables:
- Users & Profiles: `profiles`, `user_roles` (enum `app_role`: admin|user|host|experience_creator).
- Quotations: `quotation_requests`, `quotation_request_line_items`, `quotation_approvals`, `quotation_versions`, `quotations`, `quotation_line_items`, `quotation_activities`, `quotation_templates`, `customer_feedback`.
- Services & Providers: `service_catalog` (enum `service_pricing_model`), `service_provider_applications`, `quotation_service_items`, `quotation_service_providers`.
- Properties/Venues: `property_listings` (rich attributes, media urls), plus analytics via RPC and Edge Functions.
- Misc/UX: `user_notifications`, `user_notification_settings`, `user_entries`, `retreats`, `newsletter_subscribers|subscriptions`, `horo_applications`, `speaker_applications`, `sponsor_inquiries`, `smoke_thunder_bookings`.
- Security/Rate limiting: `security_events`, `audit_logs`, `api_rate_limits`, `form_rate_limits`, `form_security_logs`, `form_suspicious_patterns`, `blocked_ips`.

RPC/DB functions (subset):
- `get_property_listings_public` (public-safe view of properties; used by `integrations/supabase/queries`), `get_property_contact_info_admin` (admin-only contact fields).
- `generate_quotation_number`, `calculate_quotation_totals`.
- Rate limiting & security: `check_rate_limit`, `check_signup_rate_limit`, `check_form_rate_limit`, `detect_suspicious_form_patterns`, `is_ip_blocked`, `has_role`.

RLS & Policies (high-level)
- Migrations harden RLS over time: removing overly permissive policies, enforcing authenticated-only access, and routing public reads through RPC (e.g., properties).
- Typical patterns:
  - Authenticated users can read/write their own rows (e.g., bookings with `user_id`).
  - Admin-only policies for sensitive tables (contact details, vendor listings, analytics tables).
  - Public inserts allowed for some lead-capture tables (newsletter/contact), but reads restricted.

### Storage
- `avatars` bucket used in `ProfileForm.tsx` for profile images.

### Security & Observability
- `components/security/SecurityHeaders.tsx`: Injects CSP and security headers via meta tags at runtime.
- Hooks: `useDeviceFingerprinting`, `useSecurityAlerts`, `useSecurityMonitoring`, `useSessionTimeout`.
- Tables: `audit_logs` (important actions), `security_events` (alerts/metrics), `blocked_ips`.
- Edge Functions for monitoring (`security-monitor`, `system-monitor`), and rate-limiting RPCs.

### Build & Config
- `vite.config.ts`: alias `@` to `src`, manual chunking for large deps, dev server on port 8080, `react-swc`, bundle optimizations.
- `tailwind.config.ts`: custom theme tokens, animations, content paths.
- `eslint.config.js`: TS/React rules, react-refresh, modern ESLint config.
- `postcss.config.js`: Tailwind + autoprefixer.
- `package.json` scripts: `dev`, `build`, `build:dev`, `build:light`, `lint`, `preview`.

### Key Feature Flows
- Quotation flow:
  1) User creates a quotation request (`quotation_requests`, line items).
  2) Edge Functions handle notifications (`quotation-notification`), approvals (`quotation-approval`), and PDF export (`quotation-pdf`).
  3) `user_notifications` created for status changes; `audit_logs` record actions.
- Property listing flow:
  1) Submission via UI → Edge Function `property-listing-notification` emails admin + owner.
  2) Analytics via `property-analytics` and admin dashboards.
  3) `property-workflow-automation` handles approval/rejection and follow-ups.
- Golden Ticket flow: Form submission → `golden-ticket-notification` emails + HubSpot sync.
- Security monitoring: Client hooks and server functions log to `security_events`; potential IP blocking.

### Environment & Secrets (expected)
- Frontend `.env` (Vite):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Edge Functions (Deno env):
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `BREVO_API_KEY`, `RESEND_API_KEY`, `HUBSPOT_API_KEY`

Important: Remove hardcoded Supabase keys from `src/config/environment.ts` and `src/integrations/supabase/client.ts` for production. Prefer env injection via build system.

### Known Gaps / Follow-ups
- Missing Edge Functions referenced in code: `chat-support`, `performance-analytics`, `user-analytics`, `error-analytics`, `flight-pricing`, `send-email`, `send-notification`.
  - Action: implement or remove references; update `config.toml` with `verify_jwt` accordingly.
- Role-based routing/guards: `ProtectedRoute` has TODO for roles. Consider server-side checks via RLS + `has_role` RPC and UI guard.
- Public vs Admin property contact fields: Ensure UIs use `get_property_listings_public` unless admin.
- Backups: `backup-service` is simulated; plan real storage, encryption, and retention.

### How to Add a New Backend Feature
1) Model: Add tables/columns and RLS in a new migration. Update generated types.
2) RPC/Function: Prefer PostgreSQL functions for simple data access; Edge Function for external integrations or multi-step workflows.
3) Auth: Enforce with `verify_jwt` in `config.toml` and RLS on tables.
4) Client: Expose via `ApiClient` and typed queries in `integrations/supabase/queries`.
5) Observability: Write to `audit_logs` and `security_events` for critical actions; add rate limiting if public.

### Quick References
- Typed Supabase client: `src/integrations/supabase/client.ts`
- DB interfaces: `src/integrations/supabase/types.ts`
- Public property listings RPC usage: `src/integrations/supabase/queries/propertyListings*.ts`
- Auth context: `src/contexts/AuthContext.tsx`
- Main routes: `src/App.tsx` and `src/pages/*`
- Edge Functions: `supabase/functions/*`

If you need deeper details on a module, start with the corresponding page in `src/pages/`, find the feature’s components, then search for related RPC/Edge Function calls.
