# CLAUDE.md — ReconFlow Project Standing Orders
### Read this file before every session. These rules are non-negotiable.
### Last updated: April 16, 2026

---

## Project Identity

- Product name: ReconFlow
- Tagline: Collections in sync. Records in flow.
- Problem: AI-assisted bank reconciliation for real estate developers in India
- Stack: Next.js 14 (App Router) + Tailwind CSS + TypeScript + Supabase + Anthropic API
- Founder: Navin Oswal — non-technical. All work via browser only. No local terminal. No local dev environment.

---

## The Workflow — Non-Negotiable

1. Architecture and decisions are locked in Claude.ai BEFORE Claude Code is invoked
2. Claude Code receives a complete, unambiguous prompt — it does not make design decisions
3. Claude Code creates a PR — never merges to main directly
4. Preview URL on Vercel is tested before any merge
5. Main branch = live site. Only merge what is verified.

---

## What Claude Code Must Never Do

- Never run SQL directly. All SQL is run manually by the founder in Supabase SQL Editor as standalone blocks.
- Never hardcode secrets, API keys, or credentials in any file
- Never create or modify .env.local (only .env.local.example is allowed in the repo)
- Never merge a PR — always leave it open for founder review
- Never install packages not explicitly listed in the prompt
- Never make architectural decisions not specified in the prompt — flag ambiguity instead
- Never prefix ANTHROPIC_API_KEY with NEXT_PUBLIC_ — it must stay server-side only

---

## Security Rules

- ANTHROPIC_API_KEY is server-side only. All Anthropic API calls go through Next.js API routes (/app/api/). Never from the client. Never exposed to the browser.
- Supabase anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is safe to expose — RLS policies protect the data.
- Admin access is controlled by NEXT_PUBLIC_ADMIN_EMAIL environment variable.
- No sensitive data in URL parameters.
- .env.local is in .gitignore — always.

---

## Database Rules

- token_log table is always created first — before any other table. It logs from Day 1.
- All Supabase queries use .maybeSingle() not .single() — graceful null handling always.
- Silent failures are real bugs. Every fetch must handle the null/error case explicitly.
- Verify field names against actual table schema before writing any fetch logic.
- Schema changes are never made from Claude Code — only from Supabase SQL Editor.

---

## Token Logging Rule — Non-Negotiable

Every Anthropic API call in this codebase must log to the token_log table in Supabase.
No exceptions. One row per API call. Fields: session_id, user_id, model, input_tokens, output_tokens, feature, duration_ms.
Feature tags: bank_parse / auto_categorise / exception_explain / dispute_draft

---

## Environment Variables

| Variable | Scope | Rule |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Client + Server | Safe to expose |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Client + Server | Safe to expose — RLS protects data |
| NEXT_PUBLIC_ADMIN_EMAIL | Client + Server | Safe to expose |
| ANTHROPIC_API_KEY | Server only | NEVER prefix with NEXT_PUBLIC_ |

---

## Phase Boundaries

### Phase 1 (current build)
- Bank statement upload: CSV / Excel only (HDFC, ICICI, SBI)
- AI parsing and normalisation
- De-duplication engine
- Receipt matching (UTR first → Amount + Date fallback)
- Reconciliation dashboard
- Exception explanation
- Token logging

### Phase 2 (not in scope yet — do not build)
- PDF parsing
- Customer confirmation layer
- WhatsApp / Email dispute communication
- Tally auto-posting
- Direct bank API feed

---

## Reconciliation Logic

Matching priority order:
1. UTR exact match → AUTO_MATCHED
2. Amount + Date match (within 1 day tolerance) → MANUAL_MATCHED (user confirms)
3. Amount only → FLAGGED (exception explanation triggered)
4. No match → UNMATCHED (exception explanation triggered)

De-duplication composite key: bank_account_id + txn_date + amount + utr_ref

---

## Core Tables (schema lives in Supabase — not in codebase)

- token_log — created first, always
- bank_accounts_master
- bank_transactions_hub (includes dedup_guard unique index)
- model_pricing
- receipts (to be finalised Session 3)

---

## Pricing Model

customer_charge = actual_token_cost × 1.20
Token prices stored in model_pricing table — never hardcoded.

---

*Built by: Navin Oswal × Claude (Anthropic)*
*Project codename: MP-001*
