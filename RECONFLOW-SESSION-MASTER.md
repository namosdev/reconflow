# SESSION MASTER — ReconFlow (MP-001) · v3
### How to use: Copy this file at the start of every new session.
### Fill in [TBD] items as they get decided. Add rows. Never delete prior entries.
### Paste at the top of your next Claude session alongside NAVIN-OSWAL-ENGINEERING-OS.md
### Last updated: October 10, 2026 (Session 7 close, 23:35 IST)
### Supersedes: Session Master (Apr 18) + Session 5 Summary (Sep 6) + Addendum A (Sep 13). All three are folded in here.

---

## Numbering — one chat thread = one session (Locked — Session 5)

| Session | Chat title | Date(s) |
|---|---|---|
| 0 | Engineering OS + MP-001 Bootstrap (pre-project docs) | Apr 15, 2026 |
| 1 | Reconciliation tool pricing and market strategy | Apr 15 |
| 2 | Executing the defined plan sequence | Apr 16–17 |
| 3 | Session master and engineering OS reference | Apr 18 |
| 4 | Automating bank statement uploads via email connectors (Business Architect) | Apr 18 |
| 5 | Parallel tasks for project completion (keepalive · matching engine · specs · launch doc · TrustBridge) | Apr 25 · Sep 6 · Sep 13 |
| 6 | Scanning chat sessions (memory · API credits · hosting · Supabase plan) | Sep 6 · Oct 10 |
| 7 | Verify · Fix · Prove (keepalive root cause · dedup trigger · first real parse · RLS/auth gap found) | Oct 10 |
| **8** | **Next — Secure the write path · Prove dedup end-to-end · Verify recon** | — |

Older docs that say "Session 4/5/6" use the pre-renumbering convention. This table is the key.

---

## Who This Is For

Navin Oswal — CA, Co-Founder of UNITS and UNIVEN, Pune.
Non-technical founder building with AI assistance.
All work done via browser: GitHub web UI + claude.ai + Claude Code.
No local terminal. No local development environment. (Local dev may become a deliberate session later — see Parked.)

**The thesis being tested:**
Domain expertise + AI > coding skills without context.

**This project specifically tests:**
Token cost visibility = real revenue model for AI-assisted micro-products.

---

## Product Identity

| Item | Value |
|---|---|
| Product name | ReconFlow |
| Tagline | Collections in sync. Records in flow. |
| Thesis line (Launch Doc) | Matching is commodity. Proof is the product. |
| Stage line (Launch Doc) | Reconciliation software tells you what matched. ReconFlow tells you what's missing. |
| Project codename | MP-001 |
| Started | April 15, 2026 |
| Stage | Keepalive fixed and proven. Dedup trigger live in DB (D8). First real AI parse done (311 in / 194 out). **Server routes cannot write — anon key hits RLS; routes also unauthenticated. Service-role + admin-check PR is Session 8 Priority 1.** Recon run still unverified. |
| Live URL | reconflow-zeta.vercel.app |
| GitHub Repo | github.com/namosdev/reconflow |
| Vercel project | reconflow (namosdev-8998s-projects) |
| Supabase project | reconflow (rtbbgxoljasonvnlwhyd) — free tier |
| Admin email | namos.dev@gmail.com |
| API funding | Claude Max 5x → $100/mo Console credits (Session 6) |

---

## The Principle That Reorders Everything (Locked — Session 5, Sep 13)

> **The bank statement is the bible.**
> One bank transaction = one receipt entry in the system. Always.
> Receipts and Tally entries are recorded *to match the bank* — never the other way round.

```
        RECEIPTS                 BANK STATEMENT                 TALLY
     (system intent)   ◄────────  (the bible)  ────────►   (accounting truth)
                                       │
                          every claim traces to a line here
```

The bank statement is the **TrustBridge**. ReconFlow's job: keep the bridge honest.
Allocation is not matching — which unit a payment belongs to is a downstream UNITS engine.

### The three gaps — the product stated as failures

| Gap | Definition | Severity | Meaning |
|---|---|---|---|
| Recording gap | Bank credit · no receipt | Medium | Money arrived, nobody raised a receipt |
| **Truth gap** | Receipt · no bank credit | **High** | Money recorded that the bank never saw — error or fraud |
| Accounting gap | Matched · not in Tally or posted differently | Medium | Books wrong. The auditor's finding. Phase 2. |

**Dashboard consequence:** add an **Unbacked Receipts** card (red, above the fold). Trigger: *"Add the truth gap card."*

### The customer acknowledgement — a fourth signal
Customer submits proof of payment from their side. **A claim, not a truth** — strengthens a match, never creates one.

```
Bank + receipt + ack        → CONFIRMED (three-way)
Bank + receipt              → MATCHED
Bank + ack, no receipt      → RECORDING GAP, payer known
Receipt + ack, no bank      → TRUTH GAP, timing suspected
Ack alone                   → PENDING_BANK
```
Status lifecycle: `PENDING_BANK → LINKED → CONFIRMED` (↘ `DISPUTED`). Ack may arrive before the bank line.
Customer never sees the developer's bank statement.

### Anchor — the unit is the record (BasalOS surface, not ReconFlow)
Record lives with `unit_id`, not the customer persona. Customers change; units don't. `unit_id` arrives with UNITS.

---

## Problem Statement (Locked — Session 1)

> Real estate builders and developers in India collect hundreds of payments monthly
> across multiple bank accounts, but reconciling those bank credits against their
> internally generated receipts — and ultimately against Tally — is done manually,
> slowly, and with no audit trail.
>
> Every unmatched transaction is simultaneously a collections blind spot, a potential
> revenue leak, and an auditor's nightmare; the back-office team spends days on work
> that should take minutes.
>
> ReconFlow gives builders an AI-assisted tri-party matching engine that ingests bank
> statements in any format, normalises and deduplicates them, and surfaces exactly
> which receipts are matched, which are open, and why — creating the first tight loop
> between bank reality, system intent, and accounting truth.

---

## User Persona (Locked — Session 1)

| Element | Definition |
|---|---|
| Primary user | Accounts / Collections team member at a real estate developer |
| Team size | 1–3 people managing receipts for an active project (100–500 units) |
| Daily pain | Downloads bank statement, opens Excel, manually matches to receipts, flags mismatches on WhatsApp |
| Current tools | Tally (system of record) + Excel (reconciliation) + WhatsApp (chasing) |
| What they fear | Audit season. Unidentified credits sitting for weeks. Collector claiming payment received that bank hasn't shown. |
| What they'll love | Uploading a CSV and seeing a live reconciliation dashboard instead of building one in Excel every week |
| Buyer | CFO or Finance Head |
| Daily user | Accounts executive |
| Customer (new, Session 5) | The unit buyer — touches ReconFlow only via the Ack Link on a phone |

---

## CFO Hook (Locked — Session 1)

> "Your accounts team spends 3 days every month reconciling what should take 3 hours.
> We automated the matching. They handle only the exceptions."

**Alternative (more emotional):**
> "Your collections team knows exactly how much pain lives between the bank statement
> and the receipt register. We built the bridge they've been building manually in Excel
> every week."

**Act IV beat (Session 5):**
> "And when your customer confirms from their side, you'll have the only three-way proof in Indian real estate."

---

## Decisions Register (D1–D10)

| # | Decision | Session | Status |
|---|---|---|---|
| D1 | PDF boundary: **deferred to Phase 2, gated** behind Replay + Chain verified on CSV/Excel first. (Was "excluded forever.") | 5 | Locked |
| D2 | Tenancy: **inherited from UNITS**. ReconFlow stays single-admin. No `client_id`/`tenant_id` columns ad hoc. | 5 | Locked |
| D3 | Spec boundary: **the ledger is the handoff**. ReconFlow = INGEST → NORMALISE → VALIDATE → MATCH → EXCEPTIONS → [ledger]. UNITS = [ledger] → CLASSIFY → CATEGORISE → ACCOUNTING → TALLY. | 5 | Locked |
| D4 | Anchor owns the ack UI; ReconFlow owns the ack data + an interim no-login intake (Ack Link). | 5 | Locked |
| D5 | **Flag, never block.** A recorded receipt is never blocked; it is aged and made impossible to ignore. "Ignore requires a reason." | 5 | Locked |
| D6 | Phase placement: `acknowledgements` schema + trust hierarchy = Phase 1 design; Ack Link = Phase 1 build after Fingerprint/Replay/Chain; WhatsApp API inbound = not built; Anchor = BasalOS roadmap. | 5 | Locked |
| D7 | API funding: Max 5x Console credits ($100/mo). **Testing only.** Nothing goes to production on promotional credits. Link the Console org whose key is in Vercel. | 6 | Locked |
| D8 | NULL-UTR dedup defect is fixed **before** any parse/upload testing. | 6 | Locked |
| D9 | ReconFlow stays **isolated** — own repo, own Vercel, own Supabase. Hosting inside navinoswal.com rejected. Share patterns, never data. | 6 | Locked |
| D10 | Supabase Pro flip trigger: **the day a real bank statement enters ReconFlow.** Not before. One-org vs two-org structure decided at flip time (lean: two). | 6 | Locked |
| D11 | Keepalive cadence **daily** (`0 6 * * *`), not every 6 days. 6× margin against Supabase's 7-day pause. Every job endpoint exports `dynamic = "force-dynamic"` and returns 500 on DB error. | 7 | Locked |
| D12 | **Dedup lives in the database**, not the route: `trg_txn_fingerprint` BEFORE INSERT trigger computes the tiered fingerprint and sets `duplicate_of`. Any insert path — seed, parse, future email connector — inherits it. Never hard-reject. | 7 | Locked |
| D13 | **The anon key never writes to financial tables.** Server routes use `SUPABASE_SERVICE_ROLE_KEY` (server-only env) and verify the caller is the admin *before* touching the DB. RLS stays as the boundary for everything the browser touches. Anon INSERT policies on `bank_transactions_hub` / `receipts` are forbidden. | 7 | Locked — build pending (8A) |

---

## Phase Boundaries (Locked — Session 1, updated Sessions 3 and 5)

### Phase 1 — What ReconFlow delivers (MVP)
- Bank statement upload (CSV / Excel — HDFC first, ICICI and SBI next)
- AI parsing and normalisation into standard schema
- De-duplication engine — **tiered fingerprint** (see Reconciliation Logic)
- Receipt matching — Four-Pass (UTR → Amount+Date → Amount → none)
- Reconciliation dashboard (Total | Auto Matched | Needs Review | Unmatched | **Unbacked Receipts**)
- Exception explanation (three signals: bank · receipt · customer)
- Statement chaining (Chain) + running-balance replay (Replay)
- Ack Link interim intake (`/ack/[token]`) — after Fingerprint/Replay/Chain
- Token logging (every AI call logged — non-negotiable from Day 1)

### Phase 2 — Explicitly NOT in Phase 1
- Email connector (CSV/Excel attachments)
- PDF upload — **gated** behind Replay + Chain (D1)
- WhatsApp / Email dispute communication
- Tally auto-posting (accounting gap card wired here)
- Direct bank API feed / n8n automation ingestion

### Phase 3
- Bank API read-only feed (propose the model now, build when banks allow)

### Format Boundary (Locked — Session 3, amended Session 5)
| Format | ReconFlow stance |
|---|---|
| CSV / Excel upload | ✅ Phase 1 — primary input |
| Email parsing (CSV/Excel attachments only) | ✅ Phase 2 |
| PDF upload | ⏸ Phase 2, gated (D1) — was "never" |
| Bank API (read-only feed) | ✅ Phase 3 |
| Screen scraping / OTP-based fetch | ❌ Never |

**Why deterministic input first:** validate deterministic input before admitting probabilistic input. Never test two uncertainties in one phase.

### The Tally Boundary Statement (for landing page)
> "What ReconFlow delivers to Tally: transactions that are bank-verified, matched to a
> receipt, deduplicated, and audit-trailed. Your Tally operator posts a clean entry —
> not a guess."
>
> "What ReconFlow does not do (Phase 1): auto-post to Tally. That's Phase 2.
> We get the data right first. Posting wrong data faster is not a feature."

---

## The Wow Moment (Locked — Session 1)

> I upload an HDFC bank statement (CSV) with 150 transactions.
> ReconFlow parses it in under 10 seconds, deduplicates it, and shows me a dashboard:
> 127 matched, 23 unmatched.
> I click on one unmatched entry — it tells me:
> "Amount ₹2,50,000 credited on Apr 3rd — no UTR in narration,
> closest receipt is #REC-2041 for ₹2,50,000 from Ramesh Mehta dated Apr 2nd —
> likely match, confirm?"
> I click confirm.
> The running balance at the bottom matches the bank's closing balance.
> That's the moment.

**Proof-of-value split (Session 5):** Chain for the buyer. Parse for the daily user. Demo runs both.

---

## UNITS Connection (Strategic)

ReconFlow is the **front half of UNITS**, shipped standalone to real estate where pain is sharpest.
`receipts` table mirrors UNITS schema field-for-field — plug-in adapter added then.
Trigger: *"Ready to plug into UNITS."*

---

## Tech Stack

```
Plan in Claude.ai (thinking / architecture)
        ↓
Execute in Claude Code (claude.ai/code)
        ↓
Version control in GitHub (web UI only)
        ↓
Deploy on Vercel (auto-deploy on merge to main; Hobby tier, 2 crons/day, logs = last hour)
        ↓
Data + Auth in Supabase (free tier — rtbbgxoljasonvnlwhyd; Pro when D10 triggers)
        ↓
AI via Claude API — funded by Max 5x Console credits (testing)
        ↓
Domain: reconflow-zeta.vercel.app (custom domain when validated)
```

---

## Workflow (Non-Negotiable)

```
Step 1: THINK      Plan in Claude.ai. Lock architecture. BOTH files in context: Engineering OS + Session Master.
Step 2: SPECIFY    Write the Claude Code prompt IN Claude.ai. Principles header from Engineering OS.
Step 3: EXECUTE    Paste into claude.ai/code. PR created. 500+ lines → split.
Step 4: PREVIEW    Vercel preview URL on the PR. Test on preview — never on main.
Step 5: VERIFY     Deployment checklist. Vercel + Supabase config gaps.
Step 6: MERGE      PR → main → live.
```

**Spec-triage rule (Session 5):** any incoming spec is read in three piles — (1) live defects in current build, (2) clean ports into scope, (3) conflicts with locked decisions.

---

## Mobile Architecture (Non-Negotiable — Locked Session 2)

Every page has two versions. Built in the same PR. Never retrofitted.
```
/        → Desktop. Mouse. Wide screen.
/m       → Mobile. Thumb. Narrow screen. Ground-up, own file. Never responsive prefixes.
```
- `/m` pages at `app/m/[page]/page.tsx`; sticky bottom CTA, full-width glass, 56px CTAs.

**Mobile status:** Parked for admin surfaces — desk product. Trigger: *"Mobile audit time."*
**Exception (Session 5):** `/ack/[token]` is mobile-first by nature. The customer always opens it on a phone. First ReconFlow surface where the mobile rule is not parked.

---

## Deployment Checklist (Non-negotiable before every merge)

### Vercel
- [ ] New env vars? → All Environments checked
- [ ] Variable NAMES match `.env.local` exactly?
- [ ] Preview deployment succeeds before merge?
- [ ] Preview reviewed on desktop width?

### Supabase
- [ ] Correct project? URL contains `rtbbgxoljasonvnlwhyd`
- [ ] New redirect URLs → Authentication → URL Configuration
- [ ] New tables → standalone SQL block in SQL Editor
- [ ] RLS policies written for every new table ← NON-NEGOTIABLE
- [ ] Magic link budget respected (3/hour free tier) — log in once, early

### Security
- [ ] Admin restricted to namos.dev@gmail.com
- [ ] No secrets in code; `.env.local` in `.gitignore`
- [ ] `ANTHROPIC_API_KEY` server-side only

### Testing
- [ ] Tested on preview URL
- [ ] Auth flow end to end
- [ ] At least one `token_log` row after any AI call

---

## Vercel Environment Variables

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | ✅ |
| `NEXT_PUBLIC_ADMIN_EMAIL` | All | ✅ namos.dev@gmail.com |
| `ANTHROPIC_API_KEY` | All | ✅ server-side only. **Must belong to the Console org linked to the Max plan.** |
| `NEXT_PUBLIC_SITE_URL` | All | ✅ https://reconflow-zeta.vercel.app |

---

## Supabase Tables — Status

| Table | Status | Notes |
|---|---|---|
| `token_log` | ✅ Live | RLS applied. **First real row Oct 10:** `bank_parse` · sonnet-4-6 · 311 in / 194 out / 505 total · 2,341 ms · 2-row CSV |
| `bank_accounts_master` | ✅ Live | HDFC seeded |
| `bank_transactions_hub` | ✅ Live | **Session 7:** `dedup_guard` dropped. New columns `fingerprint`, `duplicate_of` (uuid → txn_id), `line_no`. Trigger `trg_txn_fingerprint` (security definer) sets both on insert. Index `idx_txn_fingerprint`. T1 passed (SQL re-insert → `duplicate_of` set). **No anon INSERT policy — by design (D13); writes must come via service role.** |
| `model_pricing` | ✅ Live | Sonnet + Haiku seeded |
| `receipts` | ✅ Live | Mirrors UNITS. `payment_reference` = UTR key. 'EMPTY' strings fixed to NULL. |
| `waitlist` | ✅ Live | RLS applied |
| `keepalive_log` | ✅ Live — **fixed Session 7** | Root cause: route was statically cached by Next.js 14 (ran once at build, never again — all 5 "verified" Apr 25 rows were build-time artefacts). PR #15: `force-dynamic` + real 500 on error. Cron Run button → row written. Daily from Oct 11. Weekly check: latest `pinged_at` ≤ 2 days. **RLS policy "Admin only" is actually `ALL TO public USING(true)` — misnamed, over-permissive; tighten to anon INSERT-only (parked).** |
| `statements` | ⏳ Designed | statement_id, bank_account_id, period_start/end, opening/closing_balance, file_sha256, validation_status. Enables Chain. |
| `acknowledgements` | ⏳ Designed | ack_id, unit_id, submitted_by, claimed_amount/date/ref, proof_url, txn_id, receipt_id, status, submitted_at, linked_at. Built when Ack Link lands. |
| Storage bucket `ack-proofs` | ⏳ Designed | Admin-read only. Screenshots stored, never parsed. |

**Seed data live (Session 5):** 4 bank txns (Priya ₹75,000 · Rajesh ₹5,00,000 · Sunita ₹2,50,000 · Anil ₹1,25,000) + 3 receipts (REC-2041 Rajesh · REC-2042 Sunita · REC-2043 Anil). Expected run: Rajesh AUTO_MATCHED, Priya UNMATCHED.

**RLS Rule:** every new table gets RLS at creation, as a standalone SQL block.

---

## Supabase Auth — Configuration

| Setting | Value |
|---|---|
| Site URL | https://reconflow-zeta.vercel.app |
| Redirect URL | https://reconflow-zeta.vercel.app/admin/dashboard |
| Auth method | Magic link only (3 emails/hour on free tier) |
| Admin user | namos.dev@gmail.com |

---

## Routes — Live

| Route | Method | Purpose |
|---|---|---|
| `/` · `/m` | — | Landing (desktop / mobile) |
| `/api/ping` | GET | Keepalive; writes `keepalive_log` row. `force-dynamic`; 500 on DB error (PR #15) |
| `/api/waitlist/count` | GET | Live waitlist count |
| `/admin/login` · `/admin/auth/callback` · `/admin/dashboard` | — | Magic-link admin. Dashboard shows "N duplicate rows ignored" (PR #16) |
| `/api/bank/parse` | POST | HDFC CSV → Claude → `bank_transactions_hub`; logs tokens. Returns `duplicates` (PR #16). **⚠️ Unauthenticated (middleware excludes `/api/*`) and cannot write (anon key → 42501). Fix = 8A.** Reads only first 8,000 chars of CSV (~60 rows) — chunking parked. |
| `/api/recon/match` | POST `{ bank_account_id }` | Four-Pass engine; bidirectional write; skips `duplicate_of IS NOT NULL` (PR #16). **⚠️ Same auth/write gap as parse. Fix = 8A.** |
| `/ack/[token]` | — | ⏳ Designed, not built |

---

## AI Call Map — Where Tokens Are Consumed

| User Action | Feature Tag | What AI Does | Note |
|---|---|---|---|
| Upload bank statement | `bank_parse` | Normalises columns, extracts UTR | Biggest cost |
| System processes transactions | `auto_categorise` | ~~Identifies non-receipt entries~~ → **rule-based, zero tokens** (Session 5). AI only for residue. | Cost −25–35% |
| Unmatched flagged | `exception_explain` | Closest receipt, explains mismatch | Light |
| Disputed payment | `dispute_draft` | Drafts WhatsApp/email | Phase 2 |

---

## Pricing Model (Locked — Session 1; caution added Session 6)

`customer_charge = actual_token_cost × 1.20` + base subscription (TBD ₹/month).
Token prices in `model_pricing`, never hardcoded.
**Caution:** promotional Console credits make our cost zero during testing. Unit economics are read from `token_log × model_pricing`, never from the credit balance.

---

## Token Tracking Schema (Locked — Session 0)

```sql
CREATE TABLE token_log (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    timestamptz DEFAULT now(),
  session_id    text,
  user_id       text,
  model         text,
  input_tokens  integer NOT NULL,
  output_tokens integer NOT NULL,
  total_tokens  integer GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  feature       text,
  duration_ms   integer,
  notes         text
);
```

---

## Reconciliation Logic (Locked — Session 1; built Session 5)

**Four-Pass — `POST /api/recon/match`:**
| Pass | Rule | Status |
|---|---|---|
| 1 | `utr_ref` = `payment_reference` (case-insensitive) AND amounts equal | `AUTO_MATCHED` |
| 2 | Amount exact, `receipt_date` within ±1 day of `txn_date` | `MANUAL_MATCHED` |
| 3 | Amount exact only | `FLAGGED` |
| 4 | No candidate | `UNMATCHED` |

Bidirectional write: `bank_transactions_hub.recon_status + system_receipt_id`; `receipts.recon_status + matched_txn_id + matched_at + matched_by='SYSTEM'`. Per-transaction error isolation.

**Dedup — BUILT Session 7 (D8, D12). DB trigger `trg_txn_fingerprint`:**
The Session 5 diagnosis was half right. The parse route wrote `utr_ref = ''` (not NULL), so `dedup_guard` was not *weak* — it was **over-aggressive**: two same-day ₹50,000 cash deposits with no UTR would collapse into one. Data loss, not duplication.
Fix — tiered fingerprint, computed in Postgres on every insert:
```
1. utr_ref exists         → md5('T1' | bank_account_id | upper(utr_ref))
2. running_balance exists → md5('T2' | bank_account_id | txn_date | amount | running_balance)
3. else                   → md5('T3' | bank_account_id | txn_date | amount | raw_narration | line_no)
```
Trigger also coerces `''` → NULL on `utr_ref`. First row with a fingerprint is the original; later rows get `duplicate_of = original.txn_id`. Never hard-reject. Match engine and dashboard filter `duplicate_of IS NULL`.
**The auditor sentence:** *"The bank's running balance is a sequence number it can't fake — two real transactions never share one; one transaction uploaded twice always does."*
Status: T1 (SQL-level) passed. T2 (route-level, 2-row CSV uploaded twice) blocked by 8A.

**Balance integrity (Replay):** row-level `balance[i] = balance[i-1] − debit + credit`; mismatch localised to a line.
**Statement chaining (Chain):** `opening[n] = closing[n-1]`, `period_start[n] = period_end[n-1] + 1`. Gaps phrased as questions. Answer to Breaking Risk 3.
**Exceptions:** batched by customer name; value-gated (above client threshold always reviewed); three signals per row.
**Aging for unbacked receipts (D5):** 0–2d amber · 3–7d red, top of list · 8–15d pinned above stat cards · 15+ every page load. Dismiss only with a logged reason.

---

## Onboarding Design Principles (Locked — Session 3)

Hard boundaries create onboarding obligations. Universal 3-sentence bank export guide (not bank-specific).
Arc: export guide → client-side format validator → first parse magic → celebration (once) → connector nudge.
Onboarding asks for 3 months of history so Chain has data on day one.

**The invisible work principle:** latency is the highest-attention moment. Stage 1 sequential narrative during parse · Stage 2 notification-layer storytelling (email connector) · Stage 3 ambient dashboard heartbeat, weekly summary leads with the truth gap.

---

## Business Architect Layer (Session 4)

**The single most important sentence:** *Ingestion is the wedge. Reconciliation intelligence is the product.*

| Stress test | Verdict |
|---|---|
| AI agents make email ingestion obsolete | False framing. Agents need clean data; ReconFlow creates it. Option B → C. |
| AA + Entity DigiLocker make email redundant | Upgrade events. 3–5 year window. Ingestion must be a swappable layer from Day 1. |
| UNIVEN makes UNITS redundant | Complementary. Identity layer + intelligence layer = switching cost. |

**Three real breaking risks:** CA chokepoint (*"Design the CA channel strategy"*) · bank format entropy (*"Build the format config layer"*) · no fast proof-of-value (*"Design the forcing function"* — Chain is the answer).

**Email connector cost map (INR @ ₹93.20/USD):** V0 manual ~₹80/mo · V1 Microsoft 365 ~₹4,274/mo · V2 +Zoho+IMAP ~₹20,863/mo · V3 +Gmail ~₹53,525/mo + CASA Tier 2 ₹93k–₹3L/yr. Defer Gmail to V3; offer forward-to-alias meanwhile.

**CA channel conviction:** Partner first. Tease second. 10 CAs using it before any disruption framing.

**GST note:** foreign SaaS = OIDAR; self-assess 18% IGST under RCM, claim ITC. Net zero. Retain CA from Day 1.

---

## Session Learnings (Cumulative — Non-negotiable)

1. Two files, no exceptions — Engineering OS + Session Master in every session.
2. Principles header in every Claude Code prompt.
3. 500+ line prompts get split.
4. Preview on correct width before every merge.
5. RLS at table creation time.
6. Verify the Supabase project — URL contains `rtbbgxoljasonvnlwhyd`. One wrong project cost 45 min.
7. **(Amended Session 6)** Claude API is billed at the Console, separate from the claude.ai subscription — **but Max 5x/20x and Team plans include monthly Console credits** ($100/mo on Max 5x). Claim at claude.ai → Settings → Billing → link one Console org. Pro is not eligible. Credits expire monthly, no rollover.
8. Ingestion is the wedge. Intelligence is the product.
9. Upgrade events need a quarterly monitoring posture, not a product response.
10. CA channel: partner first, tease second.
11. Scheduled jobs must write their own proof of execution.
12. "Endpoint responds" ≠ "cron is firing."
13. NULL is distinct in Postgres unique indexes.
14. Never seed placeholder strings into nullable columns.
15. Supabase magic link: 3 emails/hour on free tier. Log in once, early.
16. Deterministic before probabilistic. Fact before judgement.
17. Validate deterministic input before admitting probabilistic input.
18. Analyse incoming specs in three piles.
19. The ledger is the contract.
20. **(Session 6)** The Session Master is a ritual, not a document. Three chats in a row started with a stale anchor. Update it at close, every close, before anything else.
21. **(Session 6)** Share patterns, never data. One scaffold, one CLAUDE.md template, one keepalive recipe across projects — never one database.
22. **(Session 6)** Promotional credits are not unit economics. Read cost from `token_log × model_pricing`, never from the credit balance.
23. **(Session 6)** Vercel preview deployments + a second Supabase project cover most of what "localhost" would give a browser-only founder. Local dev is a deliberate session, not a side-quest.
24. **(Session 7)** A keepalive is verified by a row you didn't cause. Build-day rows prove the code; only an unattended run proves the schedule. Check a week later, not the same day.
25. **(Session 7)** Next.js caches a GET route that reads nothing from the request — it runs once at build and serves the result forever. Every job endpoint exports `dynamic = "force-dynamic"`. "Endpoint responds" ≠ "cron fires" ≠ **"function executes"**.
26. **(Session 7)** supabase-js never throws — it returns `{ error }`. A `try/catch` around an insert catches nothing. Check `error` explicitly and return a real 500, or the route lies with a 200. Three defects tonight hid behind swallowed errors.
27. **(Session 7)** The anon key is public. An anon INSERT policy on a table is a public write endpoint. Server routes write with the service-role key *after* verifying the caller; RLS is for what the browser touches. Never "fix" a 42501 by widening the policy.
28. **(Session 7)** Rules that must hold for every insert path belong in the database (trigger), not in one route. Same logic as RLS-at-creation.
29. **(Session 7)** "Working" claims in this file are only true for paths that were exercised end-to-end. Parse was "working" since Session 3 and had never written a row. Dedup was "defective" and was actually destructive. Read the code before trusting the summary.

---

## Build Status (chat-thread numbering)

```
Session 0: Engineering OS + Bootstrap                        ✅
Session 1: Problem statement · persona · pricing · wow moment ✅
Session 2: Infra · 6 tables · CLAUDE.md · landing page       ✅
Session 3: Keepalive cron · auth · Feature 1 upload · parse  ✅ (first real parse blocked — credits)
Session 4: Business Architect — no code, intentionally       ✅
Session 5: Keepalive proof log · Four-Pass engine · dashboard ✅ MOSTLY
  → keepalive_log + /api/ping insert — verified 2 rows        ✅
  → POST /api/recon/match — merged                             ✅
  → Recon summary panel on /admin/dashboard — merged          ✅
  → Seed data (4 txns, 3 receipts); 'EMPTY' → NULL fix        ✅
  → Specs analysed (3 piles); dedup defect found              ✅ (fix NOT built)
  → Launch Doc v1.1 · D1–D3 locked                             ✅
  → Addendum A: TrustBridge · three gaps · Anchor · Ack Link · D4–D6 ✅
  → Reconciliation run verified                                ⚠️ blocked — magic link limit
  → First real parse                                           ⚠️ blocked — credits
Session 6: Memory tooling · API credits · hosting · Supabase plan ✅
  → Max 5x Console credits confirmed as funding path           ✅
  → D7–D10 locked; Learnings 20–23                             ✅
  → Session Master v2 (this file)                              ✅
Session 7: Verify · Fix · Prove                               ✅ MOSTLY
  → Pre-flight: repo (archive/ for old docs), Supabase restored from pause, $100 credits visible ✅
  → Keepalive root cause (static-cached route since Apr 25) → PR #15 ✅
  → Cron verified via Run button; vercel.json → daily (cde8e9e)    ✅
  → Dedup: SQL migration + trigger applied; T1 passed               ✅
  → PR #16: parse/match/dashboard use duplicate_of                  ✅
  → First real AI parse: 311 in / 194 out, token_log row            ✅ (7C data point)
  → Rows saved from parse                                            ❌ 42501 — anon key, no INSERT policy
  → Found: /api/bank/parse and /api/recon/match unauthenticated      ❌ → D13, 8A
  → T2 dedup test (route-level)                                      ⏳ blocked by 8A
  → Recon run verified                                               ⏳ not reached
Session 8 (next): Secure the write path · Prove dedup · Verify recon ⏳
```

---

## SESSION RESOURCE LOG

| # | Date | Model | Duration | What shipped |
|---|---|---|---|---|
| 0 | Apr 15 | Sonnet 4.6 | ~1 hr | Engineering OS · Bootstrap · Token schema |
| 1 | Apr 15 | Sonnet 4.6 | ~1 hr | Problem statement · Persona · Pricing · Wow moment · CFO hook · Tally boundary |
| 2 | Apr 16–17 | Sonnet 4.6 | ~4 hrs | Infra live · 6 tables · CLAUDE.md · Landing page · Mobile principle · Zero-to-Live Playbook |
| 3 | Apr 18 | Sonnet 4.6 | ~4 hrs | Keepalive cron · Auth · Feature 1 · Parse API · RLS fixes · Format boundary · Onboarding + invisible work principles |
| 4 | Apr 18 | Sonnet 4.6 | ~3 hrs | Business Architect · Email connector phasing · Stress tests · CA conviction |
| 5 | Apr 25 · Sep 6 · Sep 13 | Fable 5.1 by Sep | ~7 hrs est. | keepalive_log · Four-Pass engine · Dashboard · Spec triage · Launch Doc v1.1 · TrustBridge/Anchor/Ack Link · D1–D6 |
| 6 | Sep 6 · Oct 10 | Fable 5.1 | ~1.5 hrs | Memory tooling explained · API credit path · Hosting + Supabase plan decisions · D7–D10 · Session Master v2 |
| 7 | Oct 10 | Fable 5.1 | ~2 hrs (22:00–23:35 IST) | Keepalive root cause + PR #15 · daily cron · dedup trigger (SQL) + PR #16 · first real parse · RLS/auth gap found · D11–D13 · Learnings 24–29 · Session Master v3 |

**Cumulative:** 8 sessions (0–7) · ~23.5 hrs tracked · reconflow-zeta.vercel.app

---

## Parked Ideas — With Triggers (merged, all sessions)

| Idea | Trigger phrase |
|---|---|
| ~~Tiered dedup fingerprint + `duplicate_of`~~ | Built Session 7 (D12). Route-level test pending 8B. |
| CSV chunking — parse reads only first 8,000 chars (~60 rows); `max_tokens` 4000 caps output too | *"Build CSV chunking."* — needed before any statement > 60 rows |
| RLS audit: `keepalive_log` policy misnamed "Admin only" but `ALL TO public`; review every anon policy after 8A | *"Audit the policies."* |
| `statements` table + chaining + coverage timeline | *"Build the chain."* |
| Row-level running-balance replay | *"Build replay."* |
| Exceptions UI — three signals, batched by customer, value-gated, aging | *"Build the exceptions UI."* |
| Unbacked Receipts card on dashboard | *"Add the truth gap card."* |
| Ack Link — `/ack/[token]`, confirm + claim variants, `acknowledgements` table, `ack-proofs` bucket | *"Build the ack link."* |
| Deterministic rules replacing `auto_categorise` | *"Build smart rules."* |
| PDF ingestion — Phase 2, gated | *"Ready for PDF parsing."* |
| External cut of launch doc | *"Cut the external launch doc."* |
| Supabase Pro — one org vs two; branching for test DBs | *"Supabase plan call."* |
| Local dev setup — deliberate session | *"Local dev session."* |
| Custom SMTP for magic links (raises 3/hr limit) | *"Set up SMTP."* |
| ICICI / SBI parse support | *"Add ICICI support."* |
| Parse animation — sequential narrative | *"Let's build the parse animation."* |
| Bank export guide — universal 3 sentences | *"Build the bank export guide."* |
| Format validator — client-side | *"Build the format validator."* |
| First parse celebration | *"Build the first parse celebration."* |
| Email connector V0→V3 | *"Build the email connector."* |
| Format boundary statement — landing copy | *"Write the format boundary statement."* |
| Bank API proposal — Phase 3 | *"Write the bank API proposal."* |
| Bank format config layer (Breaking Risk 2) | *"Build the format config layer."* |
| Proof-of-value forcing function (Breaking Risk 3) | *"Design the forcing function."* |
| CA channel strategy + CA practice dashboard | *"Design the CA channel strategy."* / *"Build the CA dashboard."* |
| Upgrade event radar — quarterly | *"Set up the upgrade radar."* |
| UNIVEN + UNITS combined architecture | *"Design the UDBI layer."* |
| UNITS CRED-style narrative | *"Write the UNITS story."* |
| Mobile audit — admin surfaces | *"Mobile audit time."* |
| Micro-animations | *"Let's build the animations."* |
| Per-user cost dashboard · revenue calculator · admin token view · health dashboard | *"Let's build the cost dashboard."* etc. (unchanged) |
| Phase 2/3 items: customer confirmation · dispute comms · Tally sync · bank feeds · automated ingestion | *"Ready for …"* (unchanged) |
| Plug-in adapters | *"Ready to plug into UNITS."* / *"Ready to plug into UNIVEN."* |
| Generic (non-real-estate) version | *"Ready to go generic."* |
| Waitlist → onboarding email sequence | *"Ready for onboarding flow."* |
| Building story draft + sections (onboarding obligation · invisible work · format boundary · architect) | *"Add the building story draft."* / *"Add the … section."* |
| Substack: cron proof-of-execution follow-up | navinoswal.com project — out of scope here |

---

## Art Director — Two Surfaces Specified (Session 5)

1. **Exceptions screen** (desktop): three-signal table · aging colour bands · Request-ack action · Ignore-with-reason modal · Unbacked Receipts card.
2. **Ack Link page** (mobile `/ack/[token]`): one screen, three buttons, optional UTR + screenshot; confirm and claim variants; thank-you / already-used / expired states. First thing a customer ever sees of ReconFlow.
Brief lives in `ART-DIRECTOR-BRIEF-TRUSTBRIDGE-DEMO.md`.

---

## Pending Items — Session 7 — CLOSED (see Build Status)

Session 7 ran 22:00–23:35 IST, Oct 10. Pre-flight took 60 min instead of 10 because the keepalive had been dead since Apr 25. Dedup (7B) built and SQL-tested. First real parse (7C) happened. Route-level dedup test and recon verification did not — the write path is blocked (42501) and unauthenticated. Stopped deliberately: a security-boundary PR at midnight is how mistakes ship.

---

## Pending Items — Session 8 — Priority Order (non-negotiable)

### Before Session 8 (Navin — 5 min, no building)
- [ ] **Oct 11, after 12:30 IST:** `keepalive_log` has a row between 06:00–07:00 UTC that you did not cause. Vercel → Settings → Cron Jobs → View Logs shows the run. (Learning 24)
- [ ] Supabase → Settings → API → copy the **`service_role`** key (secret). Vercel → Environment Variables → add `SUPABASE_SERVICE_ROLE_KEY`, type **Secret**, All Environments. No `NEXT_PUBLIC_` prefix. Do this *before* the 8A prompt or the preview build fails.
- [ ] 2-row HDFC CSV from Session 7 still on disk (`CSV statement.csv`)

### 8A — Secure the write path (D13) — ~30 min
Paste after the Principles header:

```
CONTEXT
ReconFlow (Next.js 14.2 App Router, @supabase/supabase-js v2, no @supabase/ssr).
Server routes currently use the public anon key and fail RLS (42501) on insert.
Middleware excludes /api/*, so the routes are also unauthenticated.
A new env var SUPABASE_SERVICE_ROLE_KEY exists in Vercel (server-only).
Do NOT touch any SQL, RLS policy, vercel.json, or /api/ping.

TASK — one PR

1. lib/supabaseAdmin.ts (new)
   export `supabaseAdmin` = createClient(NEXT_PUBLIC_SUPABASE_URL,
   SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }).
   Top-of-file comment: "Server only. Bypasses RLS. Never import in client code."

2. lib/requireAdmin.ts (new)
   export async function requireAdmin(req: NextRequest):
     Promise<{ ok: true; email: string } | { ok: false; res: NextResponse }>
   - Read `Authorization: Bearer <token>`; missing → 401 { error: 'Not authenticated' }
   - Verify with createClient(url, ANON_KEY).auth.getUser(token)
   - user.email must equal process.env.NEXT_PUBLIC_ADMIN_EMAIL (case-insensitive)
     else → 403 { error: 'Not authorised' }

3. app/api/bank/parse/route.ts and app/api/recon/match/route.ts
   - First line of handler: const auth = await requireAdmin(req); if (!auth.ok) return auth.res
   - Replace the local anon createClient with `supabaseAdmin` for every DB call
     (bank_accounts_master, bank_transactions_hub, receipts, token_log).
   - Everything else byte-identical, including token_log write and duplicate counting.

4. app/admin/dashboard/page.tsx
   - Before each fetch to /api/bank/parse and /api/recon/match:
       const { data: { session } } = await supabase.auth.getSession()
     and add header  Authorization: `Bearer ${session?.access_token ?? ''}`
   - On 401 response, show "Session expired — log in again" in the status line.

5. .env.local.example — add SUPABASE_SERVICE_ROLE_KEY= with "# server only, never NEXT_PUBLIC".

Keep the diff under 150 lines. No new dependencies.
```

- [ ] Review the diff before merging (Claude reads it from the repo). **Test on the preview URL first** (Workflow Step 4 — skipped in Session 7, don't repeat).
- [ ] Negative test on preview: open `/api/bank/parse` with no token (e.g. curl or browser POST) → expect 401. That's the proof the boundary exists.

### 8B — T2: prove dedup end-to-end (needs 8A)
- [ ] Log in once (magic-link budget). Upload the 2-row CSV → "2 saved, 0 duplicates flagged" · Total 6
- [ ] Upload the same file again → "0 saved, 2 duplicates flagged" · Total still 6 · "2 duplicate rows ignored" line visible
- [ ] `token_log` has 2 more `bank_parse` rows. Record tokens. D8 closed.

### 8C — Verify the reconciliation run (pending since Session 5)
- [ ] Run Reconciliation on the dashboard. Rajesh → `AUTO_MATCHED`, Priya → `UNMATCHED`. Screenshot `bank_transactions_hub` and `receipts`.

### 8D — Unit economics data point
- [ ] `select * from model_pricing` → compute cost of the Session 7 parse (311 in / 194 out, sonnet-4-6) in ₹. First real number for the pricing model. Record it here.

### 8E — If time permits
- [ ] *"Audit the policies."* — tighten `keepalive_log` to anon INSERT-only; confirm no anon INSERT on any financial table
- [ ] *"Add the truth gap card."*

**Opening line for Session 8:**
> "Session 8. First: did the cron fire on its own on Oct 11? Then 8A — service role + admin check. Then prove dedup with two uploads. Then the recon run. Start there."

**The honest note:** Session 7 found three "working" things that had never worked end-to-end (keepalive, parse save, dedup). Expect 8A to surface a fourth. That's the job this phase — the build is ahead of the proof, and the proof is the product.

---

## How to Use This File Next Session

1. Copy this entire file. Paste at the top of the new session with NAVIN-OSWAL-ENGINEERING-OS.md.
2. Update "Last updated". Add a Resource Log row. Update Build Status.
3. Move completed pending items to Build Status.
4. Add new parked ideas with triggers. Add new decisions to the register (D11+). Add learnings (24+).
5. **At session close, update this file before anything else.** (Learning 20)
6. Save back to GitHub (reconflow repo → main) and to the project files.

---

*Session Master v3 · October 10, 2026 · Sessions 0–7 complete · Session 8 ready to run*
*Built by: Navin Oswal × Claude (Anthropic)*
