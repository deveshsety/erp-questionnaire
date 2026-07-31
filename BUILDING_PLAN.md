# ERP Readiness Assessment — Building Plan

Full dynamic app upgrade for the ERP Readiness & Maturity Assessment tool.
Current app: single static `index.html` (909 lines), no backend, no persistence, all data hardcoded in JS consts.

## Code Review (current state)

| Area | Status | Note |
|------|--------|------|
| Data | Hardcoded | `DIMENSIONS` (30 Qs), `INDUSTRIES` (5, weights), `LEVELS` (5), `PLAYBOOK`, `ROADMAP`, `VERDICTS` in JS |
| State | In-memory only | `answers`, `industryIdx`. Refresh loses everything |
| Logic | Monolithic `update()` | Render + score + verdict + radar + bars + playbook in one fn |
| Charts | Client-side SVG | Radar + bars portable to any frontend |
| Backend | None | No API, no persistence, no auth |

Risks:
- No company profile model (size, revenue, region, current software) — needed before vendor matching
- Scoring is single-path (weighted average) — vendor fit needs multi-factor
- All logic in global scope — future modules will collide

## Target Architecture

```
Frontend (static, GitHub Pages)
  index.html + data.js + app.js + styles.css
        │
        ▼
Supabase (free tier)
  ┌───────────────────┐
  │ Postgres DB       │
  │ Edge Functions    │  (scoring + recommendation engine)
  │ Auth (optional)   │
  └───────────────────┘
```

**Cost: $0.** Stack: static frontend + Supabase (Postgres + Edge Functions + Auth) + GitHub Pages.

## Phase 0 — File Split (safe, do first)

- `index.html` stays as the shell
- Extract `data.js` (questions, industries, weights, levels, playbook, roadmap)
- Extract `app.js` (logic, scoring, rendering)
- Extract `styles.css` (all CSS)
- Same behavior, modular structure. Zero risk.

## Phase 1 — Database Layer

**Use Supabase (Postgres).** Free tier, no credit card, browser SDK, realtime + auth built in.

Tables:

```sql
questions(id, dim, text, order)
industries(id, name)
dim_weights(industry_id, dim, weight)
assessments(id, session_id, industry, score, level, created_at)
answers(id, assessment_id, question_id, value)          -- 1..5 per question
companies(id, name, size, revenue, region, industry)    -- profile form before questionnaire
erp_vendors(id, name, tier, pricing_model, licensing)   -- SAP, Oracle, Microsoft, Infor,
                                                        -- Odoo, NetSuite, Acumatica, Sage,
                                                        -- Workday, Dynamics, Epicor, Deltek...
vendor_capabilities(vendor_id, dim, score)              -- how vendor handles each of 6 dimensions
vendor_fit(vendor_id, industry_id, fit_score)           -- vendor strength per industry
```

Seed from existing JS consts — questions and weights migrate 1:1.

## Phase 2 — Backend Logic

- Keep frontend scoring (fast, works offline), mirror on server via Supabase Edge Functions / RPC
- Server = single source of truth, prevents tampering, enables leaderboard/benchmarks later

API surface (PostgREST / REST):

- `POST /assessments` — save answers
- `GET /assessments/:id` — resume by link (shareable, no login needed)
- `GET /vendors?industry=&size=` — filtered catalog
- `GET /recommendations/:assessmentId` — match engine output

### Recommendation engine (3-layer)

1. **Gate:** readiness level — Level 1–2 → playbook first, vendor list suppressed (keeps existing "halt procurement" rule)
2. **Fit score:** `company industry × dim scores × vendor_capabilities` — weighted match against vendor strength profile.
   - Dim score 3.5+ = capability relevant
   - Company scores high but vendor low = risk flag
3. **Filter:** company size, revenue band, region, budget → shortlist of 3–5 vendors + "why" (matching dimensions, strengths, gaps)

Output per vendor: fit %, matched dimensions, risk flags, license model, typical deployment time, competitor alternatives.

## Phase 3 — Frontend Features

- Company profile step (size/revenue/industry) before questionnaire
- Save button → shareable link + QR to resume (read-only view for stakeholders, no login)
- Results additions:
  - Vendor shortlist cards (fit %, matched dims, risk flags)
  - Side-by-side vendor comparison table (reuse sticky-column pattern from wtable)
  - Downloadable PDF report (html2canvas or jsPDF)
- History page: past assessments
- Optional auth (Supabase built-in) — only if multi-user/admin needed

## Phase 4 — Admin

- Admin panel: CRUD questions, weights, vendors, capabilities — no redeploy needed
- Analytics: aggregate scores by industry, common weak dimensions, vendor shortlist stats

## Phase 5 — Hosting (free)

- Frontend: GitHub Pages (already live)
- Backend/DB: Supabase free tier (500MB DB, 500k API requests/mo)
- Custom domain: optional, ~$12/yr — not needed, `*.github.io` works

## Build Order

1. Phase 0 — file split
2. Phase 1 — Supabase schema + seed
3. Phase 3 core — save/resume
4. Phase 2 — recommendation engine
5. Vendor UI
6. Phase 4 — admin (last)
