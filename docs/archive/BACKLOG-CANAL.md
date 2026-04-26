# Canal SaaS — Product Backlog

Canal is the institutional content and communication SaaS consumed by the ness. website (and future tenants). This backlog captures prioritized features beyond what already exists.

---

## Existing (Shipped)

- Multi-tenant organizations via Better Auth
- D1 database: entries, jobs, cases tables
- Legacy read routes: `/api/insights`, `/api/jobs`, `/api/cases` (with slug variants)
- RAG chatbot: BGE-base embeddings + Vectorize + Llama 3.1 8B via `streamText()`
- Rate limiting: 20 req/min per IP on `/api/chat`
- CF Pages Function proxy at `functions/api/[[route]].ts`
- Newsletter endpoint: `POST /api/newsletter`
- Form submission endpoint: `POST /api/forms`

---

## Epic 1 — Chatbot Configuration per Tenant

### 1.1 Chatbot Profile
- [ ] Admin UI to set chatbot name, avatar URL, welcome message, and status label per tenant
- [ ] `tenants` table column `chatbot_config JSONB`: `{ name, avatar, welcomeMessage, statusLabel, model, temperature }`
- [ ] API: `GET /api/admin/chatbot-config`, `PUT /api/admin/chatbot-config`
- [ ] Widget reads config from `GET /api/chatbot-config` (public, cached 60s)

### 1.2 System Prompt per Tenant
- [ ] Admin UI: rich-text system prompt editor (markdown)
- [ ] Prompt stored in `tenants.chatbot_config.systemPrompt`
- [ ] Canal injects tenant system prompt as `role: system` before user messages

### 1.3 Knowledge Base Management
- [ ] Admin UI: upload documents (PDF, MD, TXT) to R2, trigger vectorization
- [ ] `POST /api/admin/seed-vectors`: chunk → embed → upsert to Vectorize per namespace (tenant slug)
- [ ] `DELETE /api/admin/vectors/:id`: remove a specific vector
- [ ] List ingested documents with status (pending / indexed / error)
- [ ] Vectorize query uses tenant namespace filter for RAG retrieval

### 1.4 Chat History & Analytics
- [ ] Store conversation turns in D1 `chat_sessions` + `chat_messages` tables
- [ ] Admin dashboard: session count, avg turns, top intents (extracted from messages), CSAT score (thumbs up/down widget)
- [ ] Export conversations as CSV

---

## Epic 2 — Automation per Activity Type

Each activity below should support: manual creation, scheduled publishing, and webhook/queue triggers.

### 2.1 Insights / Blog
- [ ] Queue: on new `entries` row with `type='insight'`, auto-generate SEO title + meta description via Workers AI
- [ ] Auto-translate to EN and ES using AI (store as `entries_i18n` table rows)
- [ ] Social post generation: produce LinkedIn + Instagram caption variants on publish
- [ ] Newsletter digest: weekly cron that collects published insights and sends digest email via Resend/SendGrid

### 2.2 Portfolio Cases
- [ ] Queue: on new case insert, AI generates structured summary (problem / approach / impact) in 3 languages
- [ ] Auto-tag by sector and technology stack
- [ ] Generate OG image via Cloudflare Images or R2-stored template (dynamic text overlay)

### 2.3 Jobs / Vacancies
- [ ] Queue: on new job posting, auto-publish to LinkedIn Jobs API
- [ ] Auto-close job after `expires_at` date; send internal Slack/webhook notification
- [ ] Applicant tracking: `POST /api/apply` stores résumé reference in R2, candidate row in D1
- [ ] AI screening: summarize résumé and score against job description; surface in admin

### 2.4 Brandbook / Brand Assets
- [ ] R2-backed asset library: logos, color palettes, typography specimens
- [ ] Admin upload + metadata (usage rights, variant, format)
- [ ] Public read endpoint: `GET /api/brand-assets` (filtered by tenant, public assets only)

### 2.5 Email Signatures
- [ ] Template engine: handlebars-style placeholders for name, role, phone, social links
- [ ] Admin creates signature templates; employees self-serve their own via authenticated `GET /api/signature/me`
- [ ] Render as HTML + plain-text variants; downloadable as HTML file

### 2.6 Comunicados (Internal Announcements)
- [ ] `comunicados` table: title, body, audience (all / department), scheduled_at, sent_at
- [ ] Send via Resend to internal list; webhook to Slack/Teams channel
- [ ] Admin dashboard: open rate, click rate (pixel tracking via Worker endpoint)

### 2.7 Social Posts
- [ ] Content calendar: scheduled posts per channel (LinkedIn, Instagram, X)
- [ ] AI draft generation from an insight or case entry
- [ ] Manual approval step before publish
- [ ] Integration with channel APIs (LinkedIn API v2, Instagram Graph API)
- [ ] Queue: Cloudflare Queues consumer sends to APIs at scheduled time

### 2.8 Newsletters
- [ ] Subscriber management: double opt-in via `POST /api/newsletter` + confirmation email
- [ ] Unsubscribe endpoint: `GET /api/newsletter/unsubscribe?token=...`
- [ ] Template builder: block-based HTML email editor in admin
- [ ] Campaign scheduler + Resend/SendGrid delivery
- [ ] Analytics: open/click rates stored per subscriber

---

## Epic 3 — DSAR (Data Subject Access Request)

- [ ] Public form: `POST /api/dsar` — name, email, request type (access / rectification / erasure / portability), description
- [ ] `dsar_requests` D1 table with status workflow: received → in_review → completed / rejected
- [ ] Auto-acknowledgement email with ticket number and SLA (15 business days per LGPD/GDPR)
- [ ] Admin UI: intake list, status update, file upload for response package (R2)
- [ ] SLA countdown with overdue alerts (internal webhook/Slack)
- [ ] Audit log: all status changes with actor and timestamp

---

## Epic 4 — Canal de Denúncia / Whistleblower Channel

- [ ] Anonymous submission form: encrypted at rest (Web Crypto API, AES-GCM, key in KV per tenant)
- [ ] No IP or identity stored; submission returns a random 12-char case code for follow-up
- [ ] `whistleblower_cases` table: encrypted_payload BLOB, status, created_at only
- [ ] Follow-up: claimant enters case code to check status or add information (also encrypted)
- [ ] Admin: decrypt and review (key entered manually by authorized officer; never stored server-side)
- [ ] Configurable notification: send encrypted digest to compliance officer email on new report
- [ ] SLA tracking: target response within 5 business days

---

## Epic 5 — Multilingual Policy & Terms Editor

- [ ] `policies` table: type (terms / privacy / ethics / cookie), locale, body_md, version, effective_date, published_at
- [ ] Admin rich-text markdown editor (Monaco or CodeMirror) per locale
- [ ] Version history: immutable previous versions accessible by slug + version query param
- [ ] Public API: `GET /api/policies/:type?lang=pt` returns current published version
- [ ] Site Compliance page reads from this endpoint (replacing static MDX files)
- [ ] On publish: auto-translate base locale (PT) to EN + ES via AI; human review step before go-live
- [ ] Consent log: when users accept terms, log `{ userId?, fingerprint, version, timestamp }` in D1

---

## Epic 6 — Emergency Incident Channel (n.cirt)

- [ ] Dedicated `incidents` D1 table: id, tenant_id, severity, status, created_at, resolved_at
- [ ] `EmergencyChatModal` chat sessions tagged as `incident_type: emergency` in `chat_sessions`
- [ ] On first emergency message: auto-create incident record; notify on-call via PagerDuty/OpsGenie webhook
- [ ] Admin incident room: real-time status board, assign responder, timeline of actions
- [ ] Post-incident: AI-generated incident summary + root cause template (Markdown) stored in R2
- [ ] SLA: acknowledge within 15 min; configurable per tenant

---

## Epic 7 — Infrastructure & Ops

- [ ] `wrangler.toml` secrets management: document all required secrets (CANAL_WORKER_URL, DB binding, Vectorize binding, R2 binding, AI binding)
- [ ] Staging environment: `canal-staging.ness.workers.dev` with separate D1 + Vectorize namespaces
- [ ] CORS: whitelist `ness.com.br`, `trustness.com.br`, `forense.io` (and staging/preview URLs)
- [ ] Cloudflare Access: protect `/api/admin/*` routes behind Cloudflare Access policy
- [ ] Observability: Workers Analytics Engine for request metrics + error rates
- [ ] Durable Objects or Queues for all async jobs (avoid long-running Worker requests)

---

## Priority Order (MVP to Production)

| Priority | Epic | Why |
|----------|------|-----|
| P0 | 1.3 Knowledge Base (seed-vectors) | Chatbot has no RAG context without it |
| P0 | 7 CORS & Access | Required before going live on production domains |
| P1 | 1.1–1.2 Chatbot Config | Tenants need to customize their assistant |
| P1 | 2.1 Insights automation | Core content loop |
| P2 | 3 DSAR | LGPD compliance requirement |
| P2 | 4 Whistleblower | Compliance requirement for enterprise clients |
| P2 | 5 Policy Editor | Replaces hardcoded MDX, unblocks multilingual compliance |
| P3 | 2.2–2.8 Other automation | Growth / efficiency features |
| P3 | 6 n.cirt Incident Room | Differentiating CIRT service feature |
