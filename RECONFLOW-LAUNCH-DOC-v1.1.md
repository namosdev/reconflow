# ReconFlow — The Launch Document
### Product feature narrative, keynote structure
### MP-001 · Consolidated from Sessions 1–6 (Apr 15 – Sep 6, 2026)
### Status: v1.1 · Three open decisions resolved Sep 6, 2026 · Built by Navin Oswal × Claude

---

## How to read this document

This is written as a keynote. Features are named, ordered, and staged the way a launch event stages them — problem first, inversion second, features third, one-more-thing last.

It is also honest about state. Every feature carries a build status. Three tiers:

| Tier | Meaning |
|---|---|
| **SHIPPED** | Code merged to main, live on reconflow-zeta.vercel.app |
| **BUILT, UNVERIFIED** | Code merged, never successfully run end-to-end |
| **DESIGNED** | Specified and locked, not yet built |

A keynote that stages designed features as shipped is a keynote you cannot deliver twice. The tiers stay in the internal version of this document and come out of the external one.

---

# ACT I — The problem

## The three-day month

Every real estate developer in India runs the same monthly ritual.

An accounts executive downloads a bank statement. Opens Excel. Opens the receipt register. And begins matching, by eye, one line at a time. Four hundred credits against three hundred and eighty receipts. Cheque numbers that don't appear in the narration. UTRs buried inside a hundred-character NEFT string. Two buyers who paid the identical amount on the identical day.

When something doesn't match, it goes on a WhatsApp thread. The thread grows. The month closes anyway.

**Three days of work that should take three hours.**

## What it actually costs

The three days are not the real cost. The real cost is what the three days fail to produce.

At the end of it, the CFO still cannot answer three questions:

1. **Is every collection accounted for?** Not "did the numbers tie" — did any credit arrive that nobody has claimed?
2. **Has a collector claimed a payment the bank never received?** The receipt exists. Does the money?
3. **Are we looking at every statement?** Or is there a period nobody downloaded, sitting invisible between two months that both look fine?

Question three is the one nobody asks, because nobody has ever had a way to answer it.

## The persona

| Element | Definition |
|---|---|
| **Daily user** | Accounts / collections executive, 1–3 person team |
| **Buyer** | CFO or Finance Head |
| **Project scale** | 100–500 units, multiple bank accounts |
| **Current stack** | Tally (record) + Excel (reconciliation) + WhatsApp (chasing) |
| **What they fear** | Audit season. Unidentified credits aging silently. A collector's claim the bank can't confirm. |

## The CFO hook — LOCKED

> **"Your accounts team spends 3 days every month reconciling what should take 3 hours. We automated the matching. They handle only the exceptions."**

---

# ACT II — The inversion

## What every reconciliation tool does

Shows you what matched.

Upload a statement, get a list. Green rows on top, red rows below. The tool's claim is a percentage: *94% auto-matched.*

## Why that claim is hollow

Ninety-four percent **of what?**

Of the rows in the file you uploaded. Which assumes the file is complete. Which nobody checked.

A tool that matches 94% of an incomplete statement is not 94% right. It is confidently wrong, with a progress bar.

## The ReconFlow thesis

> ### Matching is commodity. **Proof is the product.**

Anyone can compare two columns. What no tool in an Indian developer's stack does today is prove that the ledger it is comparing is *complete and correct before it starts.*

That reframes the entire product:

| Everyone else | ReconFlow |
|---|---|
| "94% matched" | "This ledger is provably complete, and 94% of it matched" |
| Tells you what matched | Tells you **what's missing** |
| Confidence as a number | Confidence as a **chain of evidence** |
| Statement-level "it balances" | Row-level "line 47 is where it breaks" |

**The one-line version, for the stage:**

> **Reconciliation software tells you what matched. ReconFlow tells you what's missing.**

## The internal north star — do not put this on a slide

> **Ingestion is the wedge. Reconciliation intelligence is the product.**

The upload form is a temporary data-acquisition mechanism. Email connectors, Account Aggregator, direct bank feeds — all future replacements for the same pipe. The matching engine, the validation layer, the exception intelligence: that is what compounds and what survives every pipe swap.

Architectural consequence, locked Day 1: **ingestion is a modular, swappable layer. The reconciliation engine is agnostic to where data came from.**

---

# ACT III — The features

Seven named features. Three shipped, one defective, three designed.

---

## 1 · PARSE
### One upload. Any bank. No template.

**Status: BUILT, UNVERIFIED** — `/api/bank/parse` merged. Never run on real data; blocked on Anthropic API credits.

HDFC's export looks nothing like ICICI's. Axis changed format twice in eighteen months. Every reconciliation tool solves this by making you map columns manually, once per bank, forever.

Parse sends the raw file to Claude Sonnet and gets back a normalised schema. Column order doesn't matter. Header naming doesn't matter. Date format doesn't matter.

**What it does:**
- Normalises inconsistent columns into a single canonical transaction schema
- Extracts UTR / NEFT / IMPS reference from unstructured narration strings
- Writes to `bank_transactions_hub` with full raw narration preserved
- Logs every token consumed to `token_log`

**The design constraint that matters:** raw narration is stored verbatim, forever. Never cleaned, never overwritten. It is the audit anchor — every downstream claim traces back to the original source line.

**Format boundary — LOCKED (Phase 1):** CSV and Excel only. Structured by definition; the bank already did the extraction. AI earns its cost on normalisation, not on guessing. *(PDF: deferred to Phase 2 — see Decisions Locked.)*

**Onboarding obligation:** a hard input boundary creates a duty to walk users into it. The universal three-sentence export guide — works for every Indian bank, requires no per-bank maintenance:

> Every bank in India lets you export your statement as CSV or Excel. It's usually under Account Statement or Transaction History in net banking. Select date range → choose CSV or Excel → download.

---

## 2 · FOUR-PASS
### The matching engine.

**Status: SHIPPED** — `POST /api/recon/match` merged and live.

Four passes, in strict priority order. Each pass only sees what the previous pass couldn't resolve.

| Pass | Rule | Outcome |
|---|---|---|
| **1** | `utr_ref` = `payment_reference`, amounts equal | `AUTO_MATCHED` |
| **2** | Amount exact, date within ±1 day | `MANUAL_MATCHED` — user confirms |
| **3** | Amount exact only | `FLAGGED` — exception explanation |
| **4** | No candidate | `UNMATCHED` |

**Why the ladder is strict:** each rung is a different strength of evidence. A UTR match is *identity*. An amount-and-date match is *inference*. An amount-only match is *coincidence-shaped*. Collapsing them into one "matched" bucket destroys the only information a CFO actually needs — how much to trust each row.

**Bidirectional write.** A match updates both sides in one operation. `bank_transactions_hub` gets `recon_status` and `system_receipt_id`; `receipts` gets `recon_status`, `matched_txn_id`, `matched_at`, `matched_by`. Neither table can drift from the other.

**The UPI advantage.** India prints the same reference number on both sides of a transfer. Pass 1 is near-deterministic here in a way it simply cannot be in a market without UPI. This is a structural home-market advantage, not a feature.

---

## 3 · EXCEPTIONS
### It doesn't just flag. It explains.

**Status: DESIGNED** — not built.

A flag is a chore. An explanation is a decision.

> *"₹2,50,000 credited on 3 April — no UTR in narration. Closest receipt is REC-2041, ₹2,50,000 from Ramesh Mehta, dated 2 April. Likely match — confirm?"*

**Two design rules, both adopted from the Statement Engine spec:**

**Batch by customer, not by transaction.** *"Ramesh Mehta — 4 unmatched credits, ₹9,80,000 — classify once, apply to all."* One decision instead of four. This is the single largest lever on time-to-clean, and adopting it now costs nothing because the exception UI does not yet exist.

**Confidence gating by value.** Any transaction above a client-set threshold always goes to review, regardless of match confidence. A wrong match on a ₹2,000 maintenance credit and a wrong match on a ₹50,00,000 instalment are not the same event. Cheap rule, disproportionate protection.

---

## 4 · FINGERPRINT
### Deduplication that survives a missing UTR.

**Status: DEFECTIVE — LIVE BUG. Highest priority.**

**The defect.** The current guard is:

```sql
UNIQUE INDEX dedup_guard
  ON bank_transactions_hub (bank_account_id, txn_date, amount, utr_ref)
```

Postgres treats NULL as *distinct* in a unique index. So:

| Scenario | Behaviour | Correct? |
|---|---|---|
| Two rows, same account/date/amount, same UTR | Second rejected | ✅ |
| Two rows, same account/date/amount, **both UTR NULL** | **Both inserted** | ❌ |
| Same CSV re-uploaded, no UTRs parsed | **Every row duplicated** | ❌ |

The guard protects only when the UTR parsed cleanly — and stops protecting in exactly the case it exists for.

**Real-estate failure case:** two buyers each pay ₹5,00,000 on 14 April by cheque. No UTR. Statement uploaded, then re-uploaded a week later to catch late entries. Four ₹5,00,000 rows now exist. Running balance breaks. Matched count is wrong. The CFO sees an inflated collections figure.

**The fix — tiered fingerprint.** The column needed already exists: `running_balance`.

```
1. If utr_ref exists:        hash(bank_account_id, utr_ref)
2. Else if running_balance:  hash(bank_account_id, txn_date, amount, running_balance)
3. Else:                     hash(bank_account_id, txn_date, amount, raw_narration, line_no)
```

**Why `running_balance` is the right discriminator:** two *genuine* same-day, same-amount credits land at **different** running balances. Two *copies* of one transaction land at the **same** one. The balance column distinguishes a repeat from a duplicate — nothing else in the row can.

**Second change, equally important — never hard-reject.** Mark `duplicate_of = txn_id` and exclude from aggregates. A wrongly-rejected row is invisible and unrecoverable. A wrongly-flagged row is one click to restore.

**Trigger:** *"Fix the dedup fingerprint."*

---

## 5 · REPLAY
### Not "the statement is wrong." **Line 47 is wrong.**

**Status: DESIGNED** — not built. Column exists.

Bank statements print the balance after every row. Replay it:

```
running_balance[i] == running_balance[i-1] − debit[i] + credit[i]
```

Worked example:

```
opening              1,07,976.34
08/06   −200.00   →  1,07,776.34  ✓
09/06 −2,000.00   →  1,05,776.34  ✓
09/06 −30,000.00  →    75,776.34  ✓
```

**Why this beats the current check.** Today's balance integrity rule is statement-level: *opening + credits − debits = closing.* That tells you something is wrong somewhere. Replay localises the error to an exact row.

For a CA persona, that difference is everything. "Your statement doesn't balance" is an accusation. "Line 47 is where the chain breaks" is a colleague.

**Honesty requirement — do not skip this.** Validation strength is a property of the source, and the UI must say so:

| Source | Proof strength |
|---|---|
| Bank statement with balance column | **Row-level proof** |
| Statement without balance column | Statement-level only |
| Future AA feed | Depends on whether balance is included |

Claiming uniform confidence across sources is the fastest way to lose a CA. They will find the one place it isn't true.

---

## 6 · METER
### You pay what it costs us, plus twenty percent.

**Status: SHIPPED (infrastructure)** — `token_log` and `model_pricing` live. Never populated with real usage.

Every AI call is logged: model, input tokens, output tokens, feature tag, duration. Pricing is read from a `model_pricing` table, never hardcoded, so a rate change is a row update.

```
customer_charge = actual_token_cost × 1.20
```

**Two structural corrections carried from Session 1, both still true:**

**Consumption alone is not a business.** Pure token pass-through yields very low absolute revenue per customer. A base subscription layer sits underneath the meter; the meter handles usage above it.

**A whole planned AI cost should be deleted.** The AI Call Map lists `auto_categorise` — Claude identifying bank charges, GST, interest, TDS. That work must be **deterministic and rule-based, never AI.** Not for cost reasons — for correctness. A 97%-accurate classifier silently corrupts 3% of the ledger and nothing downstream catches it.

| Deterministic — no tokens | AI-worthy |
|---|---|
| Bank charge / GST / interest / TDS? | Normalising messy column headers |
| Credit or debit? | Extracting UTR from unstructured narration |
| Transfer between the developer's own accounts? | Explaining why a match failed |

Measured effect in the source spec: **25–35% of rows removed from the AI workload before AI runs.** Better unit economics as a side effect of a correctness decision.

---

## 7 · LEDGER
### Every claim traces to a source line.

**Status: SHIPPED (foundation)**

Nothing is destructive. Raw narration is retained permanently. Every match records who made it, when, and by what rule. `matched_by` distinguishes `SYSTEM` from `ADMIN`.

**The Tally boundary — LOCKED, and it belongs on the landing page:**

> "What ReconFlow delivers to Tally: transactions that are bank-verified, matched to a receipt, deduplicated, and audit-trailed. Your Tally operator posts a clean entry — not a guess."
>
> "What ReconFlow does not do in Phase 1: auto-post to Tally. That's Phase 2. We get the data right first. **Posting wrong data faster is not a feature.**"

---

# ACT IV — One more thing

## CHAIN
### We found the month you're missing.

**Status: DESIGNED — not built. Requires a `statements` table that does not yet exist.**

Every feature so far improves work the team already does. This one answers a question they have never been able to ask.

**The mechanism.** Store each uploaded statement's control totals — `opening_balance`, `closing_balance`, `period_start`, `period_end`. Then chain consecutive statements per account:

```
statement[n].opening_balance  ==  statement[n-1].closing_balance
AND
statement[n].period_start     ==  statement[n-1].period_end + 1 day
```

**A verified chain:**

```
May26 closes 22/05   1,67,831.19
Jun26 opens  24/05   1,67,831.19   ✓
Jun26 closes 22/06   1,77,176.19
Jul26 opens  24/06   1,77,176.19   ✓
```

**A detected gap:**

```
Statement covers 20/05 – 18/06
Statement covers 20/06 – 18/07
Prior known statement ends 18/04
→ 18/04 – 20/05 has NO STATEMENT. GAP.
```

**The output artefact: a coverage timeline.** One horizontal bar per account per year. Holes rendered in red.

## Why this is the "one more thing"

**It's the sentence that sells the product:**

> *"You have no statement covering 18 April to 20 May on your HDFC current account. Three weeks of collections are unaccounted for."*

**It solves Breaking Risk 3 — the absence of a fast proof-of-value moment.** Reconciliation intelligence compounds over months. A new customer has no history for it to work on. They churn before the intelligence has data. Chain produces a manufactured win *on first upload*, with zero accumulated history.

**It is strictly stronger than the 11-second parse as a demo.** The parse does something they already do, faster. Chain finds a problem they did not know they had. One is impressive. The other is unforgettable.

**Nothing in their stack does this.** Tally doesn't. Excel doesn't. Their bank portal doesn't. Their CA doesn't — because their CA is working from the same statements the client sent them.

---

# ACT V — Pricing and availability

## Pricing — LOCKED

- **Layer 1:** base subscription (₹/month — TBD)
- **Layer 2:** 120% of measured token consumption above base
- Rates live in `model_pricing`. Never hardcoded.

## Availability roadmap

| Phase | Contents |
|---|---|
| **Phase 1** | Manual CSV/Excel upload · Parse · Four-Pass · Exceptions · Fingerprint · Replay · Chain · Meter |
| **Phase 2** | Email connector (CSV/Excel attachments) · **PDF upload, gated behind Replay + Chain** · Customer confirmation layer · WhatsApp/email dispute comms · Tally auto-post |
| **Phase 3** | Bank read-only API feed · Account Aggregator ingestion |
| **Never** | Screen scraping · OTP-based fetch |

## Email connector — cost-phased (Session 5, ₹93.20/USD)

| Phase | Connectors | Monthly | One-time | SME coverage |
|---|---|---|---|---|
| V0 | Manual upload only | ~₹80 | ₹5–9k | Demo |
| V1 | Microsoft 365 / Outlook | ~₹4,274 | ₹0 | 6–10% |
| V2 | + Zoho + IMAP | ~₹20,863 | ₹0 | 25–32% |
| V3 | + Gmail | ~₹53,525 | ₹93k–3L/yr | 90–98% |

**The CASA rule.** Gmail's `gmail.readonly` scope requires a Google-approved CASA Tier 2 audit — ₹93,000–₹3,00,000 **annually**, 60–67% of the total infrastructure bill at every scale. Deferred to V3. Before V3, Gmail users get a forward-to-alias path: one Gmail filter, zero OAuth scope, no audit.

Microsoft Graph is V1 because app registration and publisher verification are free, no audit is required, and it indexes the highest-ARPU SME segment. Twenty paying V1 customers cover infrastructure five times over.

---

# Build status — the honest ledger

| Feature | Status | Blocker |
|---|---|---|
| Landing page (desktop) | ✅ SHIPPED | — |
| Admin auth (magic link) | ✅ SHIPPED | — |
| Upload UI | ✅ SHIPPED | — |
| Four-Pass matching engine | ✅ SHIPPED | Run not yet verified |
| Reconciliation dashboard | ✅ SHIPPED | Run not yet verified |
| Supabase keepalive + proof log | ✅ SHIPPED | — |
| Token logging infrastructure | ✅ SHIPPED | Never populated |
| Parse (`/api/bank/parse`) | ⚠️ BUILT, UNVERIFIED | Anthropic API credits |
| Fingerprint | 🔴 **DEFECTIVE** | Tiered fix not implemented |
| Exceptions | ⬜ DESIGNED | — |
| Replay | ⬜ DESIGNED | — |
| Chain / coverage timeline | ⬜ DESIGNED | No `statements` table |
| Mobile `/m` | ⏸ PARKED | Desk product; trigger *"Mobile audit time"* |

**Two verification steps outstanding from Session 6:** magic-link rate limit cleared → log in → run reconciliation → confirm the Rajesh Kumar UTR match lands as `AUTO_MATCHED`. And: API credits added → first real parse → first genuine unit-economics data point.

---

# Decisions locked — September 6, 2026

Three questions were open in v1. All three are now closed. Recorded here with rationale so the next session does not reopen them.

## 1. The PDF boundary — DEFERRED TO PHASE 2

**Previous state:** "PDF excluded forever" (Session 4). Challenged by evidence in the Statement Engine spec that PDF extraction is tractable when a validation layer exists.

**Decision:** PDF moves from *never* to *Phase 2*. Not Phase 1.

**Rationale, in Navin's framing:** Replay and Chain make a PDF parse *safer* — a dropped line gets caught rather than silently accepted. But safer is not the same as understood. Phase 1 exists to validate the deterministic path first: structured CSV/Excel input, where every failure has a clear cause. Only once that path is proven do we let users onto probabilistic input. Introducing PDF alongside Replay and Chain would mean debugging two unknowns at once — is the validation layer wrong, or is the PDF parse wrong? Sequencing removes that ambiguity.

**What this changes:**

| Item | Before | After |
|---|---|---|
| Format boundary table | PDF ❌ forever | PDF ✅ Phase 2, gated |
| Gate condition | — | Replay and Chain shipped and verified on CSV/Excel first |
| Landing page copy | "CSV/Excel only" | Unchanged for Phase 1 |
| Parked-ideas trigger | — | *"Ready for PDF parsing."* (re-activated) |

**The principle this locks:** validate deterministic input before admitting probabilistic input. Never test two uncertainties in the same phase.

## 2. Tenancy — INHERITED FROM UNITS

**Previous state:** ReconFlow has no tenancy model — one admin email — and the spec proposes SME-as-tenant, CA-as-delegated-user.

**Decision:** ReconFlow does not design its own tenancy. It inherits the UNITS tenancy model within the BasalOS platform.

**Consequences:**

- No tenancy work in ReconFlow Phase 1. Single-admin remains the correct state for a standalone micro-product being validated.
- The SME-as-tenant / CA-as-delegated-user / CA-cannot-delete positions in the spec are **UNITS decisions**, to be locked there, not here.
- The `receipts` table already mirrors UNITS field-for-field. The tenancy adapter arrives with the same plug-in, on the same trigger: *"Ready to plug into UNITS."*
- One guard for the interim: no ReconFlow table should acquire a `client_id` or `tenant_id` column ad hoc. When tenancy arrives, it arrives from UNITS in one migration, not from five improvised columns.

## 3. Where the specs belong — THE BOUNDARY IS THE LEDGER

**Previous state:** the two uploaded specs read as UNITS-scope, with a handful of mechanisms ported down to ReconFlow.

**Decision, in Navin's framing:** ReconFlow is designed to significantly enhance the back-office operations of real estate firms. Everything downstream of the ledger is what connects the dots between ReconFlow and UNITS.

**What that means structurally:**

```
ReconFlow owns:      INGEST → NORMALISE → VALIDATE → MATCH → EXCEPTIONS
                     (produces a provably complete, matched, audit-trailed ledger)

The ledger IS the handoff.

UNITS owns:          CLASSIFY → CATEGORISE → ACCOUNTING → TALLY EXPORT
                     (consumes the ledger; turns it into books)
```

ReconFlow's output artefact is the ledger. UNITS's input artefact is the ledger. That single shared object is the integration contract. It is why `receipts` mirrors the UNITS schema, why raw narration is never destroyed, and why every match carries `matched_by` and `matched_at` — UNITS needs to trust what it receives without re-verifying it.

**Ported into ReconFlow (confirmed):** Fingerprint, Replay, Chain, counterparty batching, value gating, the deterministic/probabilistic split.

**Stays in UNITS (confirmed):** double-entry journals, trial balance, P&L, chart of accounts, category taxonomy, credit-card liability treatment, period locking, tenancy, DPDP posture.

**Reframe for the launch narrative:** ReconFlow is not a small version of UNITS. It is the *front half* of UNITS, shipped standalone to a vertical where the pain is sharpest, so the ledger-quality thesis gets validated by real estate firms before the accounting layer is built on top of it.

---

# The keynote in six lines

1. Reconciliation is three days of manual work that produces no proof.
2. Every tool shows you what matched. None can prove the ledger was complete.
3. **Matching is commodity. Proof is the product.**
4. Four-Pass matches. Fingerprint dedupes honestly. Replay localises errors to a row.
5. **Chain finds the month you never knew was missing.**
6. You pay what it costs us, plus twenty percent.

---

*v1.1 · Consolidated from Sessions 1–6 · April 15 – September 6, 2026*
*Changes from v1: PDF deferred to Phase 2 (gated) · Tenancy inherited from UNITS · Ledger locked as the ReconFlow↔UNITS boundary*
*Sources: Session Master (Apr 18), Engineering OS, Statement Engine Spec v1, Categorisation Engine Spec v1, and the full project session history*
