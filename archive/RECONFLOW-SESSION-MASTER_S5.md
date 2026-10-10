# SESSION MASTER — ReconFlow (MP-001)
### How to use: Copy this file at the start of every new session.
### Fill in [TBD] items as they get decided. Add rows. Never delete prior entries.
### Paste at the top of your next Claude session alongside NAVIN-OSWAL-ENGINEERING-OS.md
### Last updated: April 18, 2026

---

## Cumulative Session Summary — ReconFlow (MP-001)

---

## Who This Is For

Navin Oswal — CA, Co-Founder of UNITS and UNIVEN, Pune.
Non-technical founder building with AI assistance.
All work done via browser: GitHub web UI + claude.ai + Claude Code.
No local terminal. No local development environment. Ever.

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
| Project codename | MP-001 |
| Started | April 15, 2026 |
| Stage | Feature 1 built. First real parse pending API credits. Strategic architecture stress-tested. |
| Live URL | reconflow-zeta.vercel.app |
| GitHub Repo | github.com/namosdev/reconflow |
| Vercel project | reconflow (namosdev-8998s-projects) |
| Supabase project | reconflow (rtbbgxoljasonvnlwhyd) |
| Admin email | namos.dev@gmail.com |

---

## Problem Statement (Locked — Session 2)

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

## User Persona (Locked — Session 2)

| Element | Definition |
|---|---|
| **Primary user** | Accounts / Collections team member at a real estate developer |
| **Team size** | 1–3 people managing receipts for an active project (100–500 units) |
| **Daily pain** | Downloads bank statement, opens Excel, manually matches to receipts, flags mismatches on WhatsApp |
| **Current tools** | Tally (system of record) + Excel (reconciliation) + WhatsApp (chasing) |
| **What they fear** | Audit season. Unidentified credits sitting for weeks. Collector claiming payment received that bank hasn't shown. |
| **What they'll love** | Uploading a CSV and seeing a live reconciliation dashboard instead of building one in Excel every week |
| **Decision maker / buyer** | CFO or Finance Head |
| **Daily user** | Accounts executive |

---

## CFO Hook (Locked — Session 2)

> "Your accounts team spends 3 days every month reconciling what should take 3 hours.
> We automated the matching. They handle only the exceptions."

**Alternative (more emotional):**
> "Your collections team knows exactly how much pain lives between the bank statement
> and the receipt register. We built the bridge they've been building manually in Excel
> every week."

---

## Phase Boundaries (Locked — Session 2, updated Session 4)

### Phase 1 — What ReconFlow delivers (MVP)
- Bank statement upload (CSV / Excel — HDFC first, ICICI and SBI next)
- AI parsing and normalisation into standard schema
- De-duplication engine (Bank Account + Date + Amount + UTR composite key)
- Receipt matching (UTR first → Amount + Date fallback)
- Reconciliation dashboard (Total credits | Matched | Unmatched | Running balance)
- Exception explanation (why didn't this match? closest candidate shown)
- Token logging (every AI call logged to Supabase — non-negotiable from Day 1)

### Phase 2 — Explicitly NOT in Phase 1
- Email connector (CSV/Excel attachments only — no PDF)
- Customer confirmation layer (2-step receipt with UTR + screenshot from customer)
- WhatsApp / Email dispute communication
- Tally auto-posting
- Direct bank API feed / n8n automation ingestion

### Phase 3
- Bank API read-only feed (propose the model now, build when banks allow)

### Format Boundary (Locked — Session 4)
| Format | ReconFlow stance |
|---|---|
| CSV / Excel upload | ✅ Phase 1 — primary input |
| Email parsing (CSV/Excel attachments only) | ✅ Phase 2 |
| PDF upload | ❌ Explicitly out of scope — forever |
| Bank API (read-only feed) | ✅ Phase 3 — propose model now |
| Screen scraping / OTP-based fetch | ❌ Never |

**Why CSV/Excel only (not PDF):**
PDF parsing for bank statements is probabilistic on financial data — exactly where
accuracy matters most. CSV/Excel is structured by definition. The bank already did
the hard work of extraction. We normalise columns — which is where AI earns its cost.
Forcing CSV is not a limitation. It is a deliberate quality boundary.

### The Tally Boundary Statement (for landing page)
> "What ReconFlow delivers to Tally: transactions that are bank-verified, matched to a
> receipt, deduplicated, and audit-trailed. Your Tally operator posts a clean entry —
> not a guess."
>
> "What ReconFlow does not do (Phase 1): auto-post to Tally. That's Phase 2.
> We get the data right first. Posting wrong data faster is not a feature."

---

## The Wow Moment (Locked — Session 2)

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

---

## UNITS Connection (Strategic)

ReconFlow is being built as a standalone micro-product first.
When validated, it becomes UNITS' killer back-office module.
receipts table mirrors UNITS schema field-for-field — plug-in adapter added then.
Trigger phrase for UNITS integration: *"Ready to plug into UNITS."*

---

## Tech Stack

```
Plan in Claude.ai (thinking / architecture)
        ↓
Execute in Claude Code (claude.ai/code)
        ↓
Version control in GitHub (web UI only)
        ↓
Deploy on Vercel (auto-deploy on merge to main)
        ↓
Data + Auth in Supabase (free tier — second project)
        ↓
Domain: reconflow-zeta.vercel.app (custom domain when validated)
```

---

## Workflow (Non-Negotiable)

```
Step 1: THINK
Plan in Claude.ai. Lock architecture. Lock design decisions.
No ambiguity allowed before Step 2.
BOTH files must be in context: Engineering OS + Session Master.

Step 2: SPECIFY
Write the Claude Code prompt IN Claude.ai.
All decisions are made here — not in Claude Code.
Every prompt must include a principles header from Engineering OS.

Step 3: EXECUTE
Paste prompt into claude.ai/code.
Claude Code creates a PR automatically.
If prompt is large (500+ lines output) — split into two prompts.

Step 4: PREVIEW
Vercel auto-generates a preview URL on the PR (GitHub comment).
Test on preview — never on main.

Step 5: VERIFY
Run the deployment checklist.
Fix any Vercel + Supabase config gaps.

Step 6: MERGE
PR → main → live site updates automatically.
```

---

## Mobile Architecture (Non-Negotiable — Locked Session 3)

Every page has two versions. Built in the same PR. Never retrofitted later.

```
/        → Desktop. Mouse. Wide screen. Full reading context.
/m       → Mobile. Thumb. Narrow screen. Quick context.
```

- /m pages are NOT responsive adaptations. They are separate files,
  ground-up design, own layout logic and information hierarchy.
- /m pages live at app/m/[page]/page.tsx
- Landing page mobile: app/m/page.tsx
- Never use responsive Tailwind prefixes as substitute for /m page
- Navigation on /m: sticky bottom CTA or bottom-tab — never hamburger
- Glass panels on /m: full width, no side-by-side columns
- CTA buttons on /m: full width, 56px height

**Mobile status:** Parked until Phase 1 feature complete.
ReconFlow is a desk product — accounts executives reconcile on laptops.
Mobile audit after Phase 1 is done. Trigger: *"Mobile audit time."*

---

## Deployment Checklist (Non-negotiable before every merge)

### Vercel
- [ ] New environment variables needed? → Add with All Environments checked
- [ ] Variable NAMES match between .env.local and Vercel exactly?
- [ ] Preview deployment succeeds before merging?
- [ ] Preview reviewed on desktop width?

### Supabase
- [ ] Correct Supabase project? Check URL: reconflow = rtbbgxoljasonvnlwhyd
- [ ] New redirect URLs needed? → Add to Authentication → URL Configuration
- [ ] New database tables needed? → Run SQL as standalone block in SQL Editor
- [ ] RLS policies written and applied for every new table? ← NON-NEGOTIABLE
- [ ] Magic link auth enabled?

### Security
- [ ] Admin access restricted to namos.dev@gmail.com only?
- [ ] No secrets or keys hardcoded in any file?
- [ ] .env.local in .gitignore?
- [ ] Anthropic API key in environment variable — never in code?

### Testing
- [ ] Tested on preview URL before merging?
- [ ] Auth flow tested end to end?
- [ ] Token logging verified — at least one row in token_log after AI call?

---

## Vercel Environment Variables

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All Environments | ✅ Added |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All Environments | ✅ Added |
| `NEXT_PUBLIC_ADMIN_EMAIL` | All Environments | ✅ namos.dev@gmail.com |
| `ANTHROPIC_API_KEY` | All Environments | ✅ Added — server-side only |
| `NEXT_PUBLIC_SITE_URL` | All Environments | ✅ https://reconflow-zeta.vercel.app |

**Critical rule:** `ANTHROPIC_API_KEY` must NEVER be exposed to the browser.
All Anthropic API calls go through Next.js API routes (server-side). Never from the client.

---

## Supabase Tables — Status

| Table | Status | Notes |
|---|---|---|
| `token_log` | ✅ Live | Created first — always. RLS policies applied. |
| `bank_accounts_master` | ✅ Live | RLS policies applied. HDFC account seeded. |
| `bank_transactions_hub` | ✅ Live | Includes dedup_guard index. RLS policies applied. |
| `model_pricing` | ✅ Live | Seeded with Sonnet + Haiku pricing |
| `receipts` | ✅ Live | Mirrors UNITS schema field-for-field |
| `waitlist` | ✅ Live | email + company_name. RLS policies applied. |

**RLS Rule (Locked — Session 4):**
Every new table needs RLS policies written immediately at creation.
Not after. Not when the bug appears. At creation, as a standalone SQL block.

---

## Supabase Auth — Configuration

| Setting | Value | Status |
|---|---|---|
| Site URL | https://reconflow-zeta.vercel.app | ✅ Configured |
| Redirect URL | https://reconflow-zeta.vercel.app/admin/dashboard | ✅ Configured |
| Auth method | Magic link only | ✅ Enabled |
| Admin user | namos.dev@gmail.com | ✅ Created |

---

## AI Call Map — Where Tokens Are Consumed (Locked — Session 2)

| User Action | Feature Tag | What AI Does | Revenue Implication |
|---|---|---|---|
| Upload bank statement (CSV/Excel) | `bank_parse` | Normalises inconsistent columns, extracts UTR | Biggest token cost |
| System processes transactions | `auto_categorise` | Identifies non-receipt entries, suggests GL | Medium cost |
| Unmatched transaction flagged | `exception_explain` | Finds closest receipt, explains mismatch | Light cost |
| Disputed payment | `dispute_draft` | Drafts WhatsApp/email to customer | Light cost — Phase 2 |

---

## Pricing Model (Locked — Session 2)

**Core principle:** You pay for exactly what it costs us, plus 20%.

```
customer_charge = actual_token_cost × 1.20
```

- Layer 1: Base subscription (TBD ₹/month)
- Layer 2: 120% of token consumption above base
- Token prices stored in model_pricing table — never hardcoded

---

## Token Tracking Schema (Locked — Session 1)

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

## Reconciliation Logic (Locked — Session 2)

**Matching priority order:**
1. UTR exact match → AUTO_MATCHED
2. Amount + Date match (within 1 day tolerance) → MANUAL_MATCHED (user confirms)
3. Amount only match → FLAGGED (exception explanation triggered)
4. No match → UNMATCHED (exception explanation triggered)

**De-duplication composite key:**
`bank_account_id + txn_date + amount + utr_ref`

**Balance integrity check (on every upload):**
```
(Previous running balance) + (Sum of new credits) - (Sum of new debits)
= Statement closing balance provided by user
```
If mismatch → entire batch held for review.

---

## Onboarding Design Principles (Locked — Session 4)

**Hard boundaries create onboarding obligations.**
If you constrain the input, you must own the journey to get the user
inside that constraint. CSV-only is a quality decision. The product must
facilitate users in taking deliberate steps to get inside that boundary.

**The universal bank export guide (not bank-specific):**
Every bank in India lets you export your account statement as CSV or Excel.
It is usually under Account Statement or Transaction History in net banking.
Select date range → choose CSV or Excel format → download.
Three sentences. Works for every bank. No maintenance.

**The onboarding arc:**
1. Guide user to export CSV (universal process, shown before upload)
2. Validate format client-side before Claude sees the file
3. First parse → show the magic (11-second reconciliation)
4. First parse celebration — shown once, never again
5. Email connector nudge — shown at peak receptivity after first parse

**The invisible work principle (Locked — Session 4):**
The latency gap between action and result is the highest-attention moment
in the product. Use it for storytelling — not spinners.

Stage 1 (synchronous — now):
Sequential narrative during parse:
"Reading your HDFC statement... extracting UTRs... normalising dates...
running deduplication... saving to ledger... done. 127 matched."

Stage 2 (async — email connector):
Narrative moves to notification layer.
"Last night ReconFlow processed 3 statements. 412 transactions ingested.
389 matched automatically. 23 waiting for you."

Stage 3 (ambient — fully automated):
Dashboard heartbeat. Weekly summary. Reconciliation health score.
User never watches it work — but always knows it worked.

The thread across all three: making invisible work visible is the
product's personality — not just a UX pattern.

---

## Business Architect Layer (Added — Session 5)

This section captures strategic stress-testing and architectural conviction.
It is distinct from Engineering OS (how we build) and the product spec (what we build).
It exists to answer existential questions before they become crises.

**The single most important sentence in this product:**
> Ingestion is the wedge. Reconciliation intelligence is the product.

If anyone — investor, CA, competitor, or team member — asks what ReconFlow is,
the answer lives in that sentence. The email connector is not the product.
The AI matching engine, anomaly detection, and exception intelligence are the product.
The data pipe is a detail that will change. The intelligence is what compounds.

---

### Stress Test 1 — "AI Agents make email ingestion obsolete"

**Verdict: False framing. Correct if intelligence is the product.**

AI Agents are intelligence. They need structured, reliable, contextualised financial
data to act on. That data does not exist cleanly for Indian SMEs anywhere today.
No agent can reconcile what it cannot see. The email connector creates the data layer
agents will eventually act on.

The question is not email vs agents. The question is:
- Option A: Building a data pipe → agents eat this. Kill it.
- Option B: Building reconciliation intelligence that currently ingests via email
  → agents will assist this. Build it.
- Option C: Building an outliers-first financial operating system
  → agents will be deployed inside this. This is the destination.

ReconFlow is Option B with Option C as the destination.
The north/south framing applies to the wedge, not the product.

---

### Stress Test 2 — "AA + Entity DigiLocker make email ingestion redundant"

**Verdict: Upgrade events, not break events. 3–5 year window is real.**

Account Aggregator (AA) covers ~126 FIPs (RBI-regulated). Business current account
coverage is partial and inconsistent. Entity DigiLocker exists but bank statement
adoption at SME scale is not meaningfully live as of April 2026.
Realistic timeline to meaningful SME coverage: 3–5 years.

**That is the window.**

AA and DigiLocker are future data pipes — better pipes than email.
When they arrive at meaningful coverage, the ingestion layer of ReconFlow
swaps from email to AA/DigiLocker. The reconciliation intelligence does not change.
The bank sender fingerprints, format normalisers, matching logic, anomaly taxonomy —
none of this changes when the data source changes.

**Architecture requirement (non-negotiable):**
Ingestion must be a modular, swappable layer. The reconciliation engine must be
agnostic to where the data came from. This is not a Phase 2 concern — it is a
Day 1 architecture decision. The email connector must be built as one pipe in a
multi-pipe system, not as the system itself.

**Monitoring posture (quarterly — not obsessively):**
- AA FIP coverage for business current accounts
- Entity DigiLocker adoption signals and RBI direction
- Any bank announcing direct API feeds for SMEs

The team that sees the inflection 6 months early converts a break event into
a breakthrough. Put it on the calendar, not just the radar.

---

### Stress Test 3 — "Universal Digital Business Identity (UNIVEN) makes UNITS redundant"

**Verdict: Complementary architecture. UNIVEN + UNITS is more defensible than either alone.**

Identity (who is this business?) and financial state (what is happening to this
business's money?) are separate problems. AA is a consent-based data rail.
Entity DigiLocker is a document vault. Universal Business Identity is an identifier layer.
None of these is reconciliation intelligence. They are all potential data sources
feeding into what UNITS/ReconFlow does.

**The architecture that emerges:**
UNIVEN = digital business identity layer (KYC + verified entity anchor + consent manager)
UNITS = financial intelligence layer (reconciliation + cash visibility + anomaly detection)
Together = identity creates the trust layer, financial intelligence creates the utility layer,
together they create the switching cost that neither product has alone.

When AA and DigiLocker are ready, UNIVEN becomes the consent manager
and UNITS upgrades its data pipe. This is a coherent long-term architecture,
not three competing ideas.

---

### The Three Real Breaking Risks (Session 5)

These are not the threats from the stress tests. These are the ones that kill
correctly-architected products.

**Breaking Risk 1 — The CA chokepoint**
Indian SMEs don't own their own reconciliation. Their CA does. A CA who sees
ReconFlow as a threat will quietly discourage adoption. The product must either
make the CA a distribution partner or make the SME owner so confident in their
own numbers they stop asking the CA for the basics. Both are hard.
Neither is engineering. Trigger: *"Design the CA channel strategy."*

**Breaking Risk 2 — Bank format entropy**
HDFC Excel exports look nothing like ICICI's. Axis changed their format twice in
18 months. This is an ongoing maintenance tax. The format parser must be built as
a config layer, not hardcoded logic. Every new bank and every format update
must be a config change, not a code change.
Trigger: *"Build the format config layer."*

**Breaking Risk 3 — No proof-of-value moment fast enough**
The intelligence compounds over time. The SME owner needs to feel something in
the first session. If the first experience is "your statements are ingested, please
wait for anomalies to surface," they will leave before the intelligence has data to
work with. The first-use experience needs a manufactured win.
Trigger: *"Design the forcing function."*

---

### Email Connector — Phased Cost Map (Session 5, INR at ₹93.20/USD)

Phase 2 of ReconFlow is the email connector. Four phases, bare minimum cost first.
The single biggest cost dominator is Gmail's CASA Tier 2 audit — deferred to V3.

| Phase | Connectors live | Monthly INR | One-time INR | SME market |
|---|---|---|---|---|
| V0 | None (manual upload only) | ~₹80 | ~₹5,000–₹9,000 | Demo only |
| V1 | Microsoft 365 / Outlook | ~₹4,274 | ₹0 | ~6–10% |
| V2 | + Zoho Mail + IMAP | ~₹20,863 | ₹0 | ~25–32% |
| V3 | + Gmail | ~₹53,525 | ₹93,000–₹3,00,000/yr | ~90–98% |

**The CASA rule:** Gmail's `gmail.readonly` scope requires a Google-approved CASA
Tier 2 security audit. Cost: ₹93,000–₹3,00,000/year. Recurring annually. This is
60–67% of the total infrastructure bill at every scale. Defer until V3.
Before V3 arrives, offer a "forward-to-UNITS alias" alternative for Gmail users
(zero OAuth scope, user sets one Gmail filter) — eliminates CASA entirely.

**Microsoft Graph is V1 priority because:**
- App registration: free
- Publisher verification: free (mandatory — without it enterprise tenants block consent)
- No security audit requirement
- Highest-ARPU SME segment (>10 employees, regulated industries, Tier-1 metros)
- 20 paying V1 customers cover infrastructure 5× over at ₹999–₹2,999/month pricing

**GST/tax note:**
All foreign SaaS (Supabase, Vercel, Microsoft, Zoho) = OIDAR services.
GST-registered entity: self-assess 18% IGST under RCM in GSTR-3B, claim ITC.
Net GST impact: zero. Retain CA on ₹2,000–₹5,000/month retainer from Day 1.

---

### CA Channel Strategy — Conviction Required (Session 5)

**North vs South framing:**
- North: CAs as distribution partners and validators
- South: ReconFlow replaces what CAs do

This is a founder conviction decision. The analysis from Session 5:

CAs fear losing billable hours on reconciliation. They secretly want to spend
less time on low-value data-wrangling and more time on advisory — which is
higher margin and more intellectually satisfying.

ReconFlow, framed correctly, doesn't eliminate CA reconciliation work.
It eliminates the *drudgery* so they can do the *judgment* work
that justifies their fees.

**The "healthy tease" principle:**
Implying disruption in communication while genuinely empowering in product
is a legitimate creative strategy — but only if the product delivers on the
empowerment first. Adversarial positioning without product substance creates
enemies in the channel you need most.

**Recommended conviction: Partner first. Tease second.**
Get 10 CAs using ReconFlow with their clients before running any campaign
implying disruption. Their endorsement is worth more than any campaign.
A CA practice dashboard (all client reconciliation statuses in one view,
anomaly alerts before the client calls) is both a distribution mechanism
and a retention mechanism.

---

## Session Learnings (Cumulative — Non-negotiable for future sessions)

**Learning 1 — Two files, no exceptions:**
Every session starts with BOTH Engineering OS + Session Master in context.
Engineering OS = how we build. Session Master = what we build.

**Learning 2 — Principles header in every Claude Code prompt:**
Every prompt starts with: "Core principles applying to this build..."
Forces conscious application — not assumed.

**Learning 3 — Large prompts get split:**
Any Claude Code prompt likely to generate 500+ lines gets split.
Desktop first, mobile second.

**Learning 4 — Preview on correct width before every merge:**
Preview reviewed before any merge. Never merge blind.

**Learning 5 — RLS policies at table creation time:**
Every new Supabase table needs RLS policies written immediately.
Not after. Not when the bug appears. At creation.
Silent RLS failures are the hardest bugs to find.

**Learning 6 — Always verify which Supabase project you're in:**
Two projects exist: personal site + ReconFlow.
URL bar shows project ID. reconflow = rtbbgxoljasonvnlwhyd.
Check before running any SQL. Check before reading any auth logs.
One wrong project cost 45 minutes in Session 4.

**Learning 7 — Anthropic API credits are separate from claude.ai:**
claude.ai subscription ≠ API credits.
console.anthropic.com → Billing → Credits.
Minimum top-up $5. Check before any session involving AI features.

**Learning 8 — Ingestion is the wedge. Intelligence is the product.**
If anyone on the team thinks they are building a Gmail connector, stop.
The email connector is the temporary data acquisition mechanism.
The reconciliation matching logic, anomaly detection, and exception intelligence
are the product. These compound. The data pipe does not.
Every architecture decision must protect the intelligence layer first.

**Learning 9 — Upgrade events require a monitoring posture, not a product response.**
AA + Entity DigiLocker SME coverage = 3–5 year window.
The architecture must be modular so swapping the data pipe doesn't rebuild the product.
Check the upgrade radar quarterly: AA FIP coverage for business accounts,
Entity DigiLocker bank adoption, RBI open banking signals.
Seeing the inflection 6 months early = breakthrough. 6 months late = disrupted.

**Learning 10 — CA channel: partner first, tease second.**
Never run disruption-framed communication before 10 CAs are using the product
with their clients and endorsing it. The CA is the most powerful distribution
channel and the most dangerous enemy. Choose deliberately, not by default.

---

## Build Status

```
Session 1: Engineering OS + Bootstrap           ✅ COMPLETE
Session 2: Problem Statement                    ✅ COMPLETE
Session 3: Infra + Architecture + Landing Page  ✅ COMPLETE
  → GitHub repo live: namosdev/reconflow
  → Supabase project live: reconflow
  → Vercel connected: reconflow-zeta.vercel.app
  → CLAUDE.md created with mobile architecture rules
  → 6 tables live in Supabase
  → Environment variables configured
  → Desktop landing page live ✅
  → Zero-to-Live Playbook created ✅

Session 4: Keepalive + Auth + Feature 1         ✅ MOSTLY COMPLETE
  → Supabase keepalive cron job live ✅
  → /api/ping confirmed working and returning alive ✅
  → Mobile /m redo — PARKED (trigger: "Mobile audit time") ✅
  → Middleware redirect (/ → /m on mobile) ✅ merged
  → Live waitlist count API ✅ merged
  → waitlist table created and RLS fixed ✅
  → RLS policies fixed across all tables ✅
  → Supabase Site URL corrected to production URL ✅
  → NEXT_PUBLIC_SITE_URL added to Vercel ✅
  → Admin auth live — /admin/login + magic link ✅
  → /admin/dashboard protected shell live ✅
  → /admin/auth/callback route live ✅
  → Feature 1 UI live — upload form on dashboard ✅
  → /api/bank/parse route live ✅
  → Token logging wired to bank_parse feature ✅
  → First real parse — PENDING (Anthropic API credits) ⚠️

Session 5: Business Architect                   ✅ COMPLETE
  → No code shipped. Intentionally.
  → Email connector architecture stress-tested and phased (V0→V3, INR costs locked) ✅
  → Indian SME email landscape mapped (Gmail ~40%, Outlook ~37%, Zoho ~8%, IMAP long tail) ✅
  → CASA Tier 2 cost risk identified and deferred to V3 ✅
  → Multi-pipe ingestion architecture validated ✅
  → Stress test 1: AI Agents — ingestion is wedge, intelligence is product ✅
  → Stress test 2: AA + Entity DigiLocker — upgrade events, 3–5 year window ✅
  → Stress test 3: Universal Business Identity — complementary, not competing ✅
  → Three real breaking risks identified and parked ✅
  → CA channel conviction framed: partner first, tease second ✅
  → Three strategic threads parked with triggers ✅
  → Business Architect Layer added to Session Master ✅

Session 6 (next):                               ⏳ PENDING
  → Confirm Anthropic API credits added
  → Run first real HDFC CSV parse
  → Verify token_log row with feature = bank_parse
  → Check bank_transactions_hub rows saved
  → First unit economics data point captured
```

---

## SESSION RESOURCE LOG

| # | Date | Model | Duration | What shipped |
|---|---|---|---|---|
| 1 | Apr 15, 2026 | Claude Sonnet 4.6 | ~1 hr | Engineering OS · Bootstrap · Token schema · Unit economics |
| 2 | Apr 15, 2026 | Claude Sonnet 4.6 | ~1 hr | Problem statement · Persona · MVP scope · Wow moment · AI token map · Pricing · CFO hook · Tally boundary |
| 3 | Apr 16–17, 2026 | Claude Sonnet 4.6 | ~4 hrs | Infra live · 6 DB tables · CLAUDE.md · Desktop landing page · Mobile architecture principle · Zero-to-Live Playbook |
| 4 | Apr 18, 2026 | Claude Sonnet 4.6 | ~4 hrs | Keepalive cron · Auth shell · Feature 1 UI · Parse API · RLS fixes · Format boundary locked · Onboarding principles · Invisible work principle · Building story draft |
| 5 | Apr 18, 2026 | Claude Sonnet 4.6 | ~3 hrs | Business Architect session · Email connector phasing (V0–V3, INR costs) · UNITS CRED-style narrative · Stress test: agents / AA / DigiLocker / UDBI · Multi-pipe architecture validated · CA channel conviction · Three strategic threads parked |

**Cumulative:** Sessions: 5 | Tracked duration: ~13 hrs | Live URL: reconflow-zeta.vercel.app

---

## Parked Ideas — With Triggers

| Idea | Trigger phrase |
|---|---|
| Model pricing table in Supabase — seed with current Anthropic rates | *"Let's build the pricing table."* |
| Per-user cost dashboard | *"Let's build the cost dashboard."* |
| Revenue model calculator | *"Let's build the revenue calculator."* |
| Parse animation — sequential narrative during AI processing | *"Let's build the parse animation."* |
| Bank export guide — universal 3-sentence process, shown before upload | *"Build the bank export guide."* |
| Format validator — client-side check before Claude sees the file | *"Build the format validator."* |
| First parse celebration — wow moment UI, shown once only | *"Build the first parse celebration."* |
| Email connector — full phased build V0→V3 (INR cost map locked in Session 5) | *"Build the email connector."* |
| Format boundary statement — landing page copy on CSV-only decision | *"Write the format boundary statement."* |
| Bank API proposal — read-only access model for Phase 3 | *"Write the bank API proposal."* |
| Bank format config layer — parser as config, not hardcode (Breaking Risk 2) | *"Build the format config layer."* |
| Proof-of-value forcing function — CRED equivalent for ReconFlow (Breaking Risk 3) | *"Design the forcing function."* |
| CA channel strategy — partner onboarding, practice dashboard, communication plan | *"Design the CA channel strategy."* |
| Upgrade event radar — AA FIP coverage, Entity DigiLocker, RBI signals (quarterly) | *"Set up the upgrade radar."* |
| UNIVEN + UNITS combined architecture — identity layer + intelligence layer | *"Design the UDBI layer."* |
| UNITS CRED-style narrative — full draft written in Session 5 | *"Write the UNITS story."* |
| Mobile audit — ground-up /m pages for all features | *"Mobile audit time."* |
| Micro-animations — scroll entrance, hover, form success | *"Let's build the animations."* |
| Phase 2: Customer confirmation layer | *"Ready for customer confirmation."* |
| Phase 2: WhatsApp / Email dispute communication | *"Ready for dispute comms."* |
| Phase 2: Tally auto-posting integration | *"Ready for Tally sync."* |
| Phase 3: Direct bank API feed | *"Ready for bank feeds."* |
| Phase 3: n8n / email automation ingestion | *"Ready for automated ingestion."* |
| Plug-in adapter for UNITS | *"Ready to plug into UNITS."* |
| Plug-in adapter for UNIVEN | *"Ready to plug into UNIVEN."* |
| Reconciliation Health Dashboard (MTTR, Unidentified Credit Ratio, Automation Rate) | *"Let's build the health dashboard."* |
| Smart Rules engine (auto-categorise bank charges, interest, TDS) | *"Let's build smart rules."* |
| Matching Engine logic doc | *"Let's document the matching engine."* |
| Generic (non-real-estate) version of ReconFlow | *"Ready to go generic."* |
| Admin dashboard — token usage view | *"Let's build the admin dashboard."* |
| Waitlist → onboarding email sequence | *"Ready for onboarding flow."* |
| CA practice dashboard — all client reconciliation statuses, anomaly alerts | *"Build the CA dashboard."* |

---

## Building Story — Parked Draft Asset

**Trigger:** *"Add the building story draft."*
**Status:** Full draft written in Session 4. Ready for refinement.
**Sections written:**
- Decision 1: Think before you build
- Decision 2: The six-line cron job
- Decision 3: Skip mobile for now
- Decision 4: Token logging is the nervous system

**Sections to add (triggers):**
- Onboarding obligation section → *"Add the onboarding obligation section."*
- Invisible work section (3 stages) → *"Add the invisible work section."*
- Format boundary section (CSV-only decision) → *"Add the format boundary section."*
- Business architect section (stress test + ingestion/intelligence distinction) → *"Add the architect section."*

**Draft text is preserved in Session 4 conversation history.**
Retrieve with: *"Show me the building story draft."*

---

## Pending Items — Priority Order

### Session 6 — Priority 1 (do first, non-negotiable)
- [ ] Add credits to Anthropic API account (console.anthropic.com → Billing)
      Minimum $5. Check before doing anything else.
- [ ] Run first real HDFC CSV parse on admin dashboard
- [ ] Verify token_log has one row with feature = 'bank_parse'
- [ ] Verify bank_transactions_hub has rows saved
- [ ] Note actual input_tokens and output_tokens — first real unit economics data

### Session 6 — Priority 2
- [ ] Add ICICI bank statement support to /api/bank/parse
      Same API route — extend Claude prompt to handle ICICI column format
      Test with real ICICI CSV before merging

### Session 6 — Priority 3
- [ ] Receipt matching engine
      Compare bank_transactions_hub against receipts table
      Apply reconciliation logic: UTR → Amount+Date → Amount only
      Update recon_status field on each transaction

### Session 6 — Priority 4 (if time permits)
- [ ] Reconciliation dashboard — matched/unmatched counts, running balance
      This is the wow moment UI. Do not start until priorities 1-3 done.

### Before Session 6 (Navin to do)
- [ ] Add Anthropic API credits before session starts
- [ ] Have at least one real HDFC CSV bank statement ready to upload

---

## Next Session — Opening Brief

**Session 6: First Real Parse + ICICI + Receipt Matching**

Three outputs in this exact priority order:

**6A — First real parse (do first)**
Confirm API credits. Upload real HDFC CSV.
Check token_log row. Check bank_transactions_hub rows.
Note actual token counts — first real unit economics data point.

**6B — ICICI support**
Extend parse API to handle ICICI format.
Same engine, extended Claude prompt. Test with real ICICI CSV.

**6C — Receipt matching engine**
Wire reconciliation logic against receipts table.
Update recon_status on each parsed transaction.
UTR → Amount+Date → Amount only → UNMATCHED.

**Opening line for Session 6:**
> "Session 6. API credits confirmed. Upload a real HDFC CSV.
> Show me the token_log row and the transactions table.
> First unit economics data. Start there."

---

## How to Use This File Next Session

1. Copy this entire file
2. Paste at the top of your new Claude session
3. Also paste NAVIN-OSWAL-ENGINEERING-OS.md — non-negotiable, no exceptions
4. Update "Last updated" date in the header
5. Add a new row to the SESSION RESOURCE LOG
6. Update Build Status for anything completed
7. Fill in any [TBD] items as they get decided
8. Move completed pending items to Build Status or remove
9. Add any new parked ideas with trigger phrases
10. Save updated file back to GitHub (reconflow repo → main branch)

---

## What Makes This Template Different From navinoswal.com Version

| Element | navinoswal.com template | ReconFlow template |
|---|---|---|
| Primary purpose | Personal site build log | Commercial micro-product |
| Revenue model section | Not applicable | Token economics + pricing model |
| AI call map | Not applicable | Every token-consuming action documented |
| Token log schema | Not applicable | Core table — created before anything else |
| Phase boundaries | Build phases | Product phases (Phase 1 / Phase 2 / Phase 3) |
| Format boundary | Not applicable | CSV/Excel only — PDF never — locked with rationale |
| Onboarding design | Not applicable | Hard boundary = onboarding obligation |
| Invisible work principle | Not applicable | Latency gap = storytelling opportunity |
| CFO hook | Not applicable | Locked sales language for decision maker |
| Tally boundary | Not applicable | Phase 1 scope limiter — on landing page |
| UNITS connection | Not applicable | Strategic plug-in path documented |
| Building story | Not applicable | Live draft — grows with the product |
| Design system | Locked (sage + amber) | Dark, finance-grade — own identity |
| Business Architect layer | Not applicable | Strategic stress-testing before building — existential threats mapped and resolved |
| Upgrade event radar | Not applicable | AA / DigiLocker / Agents — quarterly monitoring with break vs breakthrough framing |
| CA channel conviction | Not applicable | Partner first, tease second — locked with rationale |

---

*Session Master version: April 18, 2026*
*Sessions 1 + 2 + 3 + 4 + 5 complete. Session 6 ready to run.*
*Built by: Navin Oswal × Claude (Anthropic)*
