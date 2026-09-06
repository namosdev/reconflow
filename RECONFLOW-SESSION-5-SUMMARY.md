# SESSION 5 SUMMARY — ReconFlow (MP-001)
### Cumulative learning to date · One chat thread = one session
### Session dates: April 25, 2026 (build) · September 6, 2026 (launch doc + decisions)
### Paste alongside RECONFLOW-SESSION-MASTER.md and NAVIN-OSWAL-ENGINEERING-OS.md

---

## Numbering note — read first

Navin's convention: **one chat thread = one session**, regardless of calendar days spent inside it.

The Session Master (Apr 18 version) numbers differently — it counts the bootstrap as Session 1 and calls the Business Architect chat "Session 5." Under chat-thread numbering, the project's sessions are:

| Chat # | Title | Session Master called it |
|---|---|---|
| 1 | Reconciliation tool pricing and market strategy | Session 2 |
| 2 | Executing the defined plan sequence | Session 3 |
| 3 | Session master and engineering OS reference | Session 4 |
| 4 | Automating bank statement uploads via email connectors | Session 5 |
| **5** | **This thread — keepalive fix, matching engine, spec alignment, launch doc** | "Session 6 (next)" |
| 6 | Scanning chat sessions (memory tooling explanation) | — |

**Action for next Session Master update:** renumber Build Status and Resource Log to chat-thread numbering. Bootstrap (Engineering OS + MP-001 bootstrap doc) becomes "Session 0" so nothing is lost.

---

## What this session set out to do

Opened with API credits blocked. Question: what can run in parallel?

Chosen path: receipt matching engine + reconciliation dashboard in one PR — pure database logic, zero AI dependency, and it is the wow-moment UI.

Detoured immediately into a keepalive failure, then returned. Later reopened (Sep 6) to consolidate everything into a launch document and close three open decisions.

---

## What shipped

### 1. Keepalive proof log — SHIPPED, VERIFIED

**Discovery:** Supabase project was paused despite a cron job being configured in Session 3.

**Diagnosis path:**
- Vercel logs for `/api/ping` showed nothing. Initially misread as "Hobby tier doesn't support cron" — **wrong**, Navin corrected: Hobby allows 2 crons/day.
- Real cause: Vercel free tier log window is capped at **Last hour**. A daily cron cannot be verified from logs that expire in 60 minutes. Verification method was itself broken.
- "Endpoint responds when called manually" was mistaken for "cron is firing on schedule." Two different facts.

**Fix:** `keepalive_log` table (id, pinged_at, status, notes) with RLS. `/api/ping` updated to insert a row on every call, `notes = 'cron_ping'`, insert failure never breaks the ping response.

**Verified:** two rows at 03:34 and 03:54 UTC, Apr 25. Weekly check habit: most recent `pinged_at` within 6 days.

**Out of ReconFlow scope, noted:** identical fix needed on navinoswal.com Supabase. Substack follow-up article context written (the principle: scheduled jobs must write their own proof of execution).

### 2. Four-Pass matching engine — SHIPPED

`POST /api/recon/match`, accepts `{ bank_account_id }`.

| Pass | Rule | Status set |
|---|---|---|
| 1 | `utr_ref` = `payment_reference` (case-insensitive) AND amounts equal | `AUTO_MATCHED` |
| 2 | Amount exact, `receipt_date` within ±1 day of `txn_date` | `MANUAL_MATCHED` |
| 3 | Amount exact only | `FLAGGED` |
| 4 | No candidate | `UNMATCHED` |

Bidirectional write: `bank_transactions_hub.recon_status` + `system_receipt_id`; `receipts.recon_status` + `matched_txn_id` + `matched_at` + `matched_by = 'SYSTEM'`. Per-transaction error isolation — one failure never aborts the run. Returns summary counts.

### 3. Reconciliation dashboard — SHIPPED

Four stat cards (Total / Auto Matched / Needs Review / Unmatched), Run Reconciliation button with loading state and inline result, last-20 transaction list with status badges. Dark, finance-grade, consistent with landing page system.

### 4. Test data — SEEDED

Via Claude Code browser: 4 bank transactions (Priya ₹75,000 · Rajesh ₹5,00,000 · Sunita ₹2,50,000 · Anil ₹1,25,000, all with HDFC UTRs in narration) and 3 receipts (REC-2041 Rajesh · REC-2042 Sunita · REC-2043 Anil).

**Data quality fix applied:** two receipts had the literal string `'EMPTY'` in `payment_reference`. Corrected to NULL via UPDATE. Without this, Pass 1 would have attempted to match the string "EMPTY" against UTRs.

**Expected result when run:** Rajesh Kumar → `AUTO_MATCHED` (UTR HDFC000123456789 present on both sides, amounts equal). Sunita and Anil → Pass 2 or 3 depending on date alignment. Priya → `UNMATCHED` (no receipt).

### 5. Launch document — v1.1 CREATED (Sep 6)

`RECONFLOW-LAUNCH-DOC-v1.1.md`. Apple-keynote structure: problem → inversion → seven named features → one more thing → pricing. Every feature carries honest build status. Thesis line: **"Matching is commodity. Proof is the product."** Stage line: **"Reconciliation software tells you what matched. ReconFlow tells you what's missing."**

Named features: Parse · Four-Pass · Exceptions · Fingerprint · Replay · Meter · Ledger · **Chain** (the one-more-thing).

---

## What did NOT ship — and why

| Item | Blocker | Status |
|---|---|---|
| First real HDFC parse | Anthropic API credits not added | Still pending |
| Reconciliation run verification | Supabase magic link limit — 3 emails/hour on free tier | `405` on GET `/api/recon/match` confirms route is live; run itself unverified |
| Tiered dedup fingerprint | Identified this session, not implemented | **Priority 1 next session** |

---

## Spec alignment — two uploaded documents

Navin uploaded `Statement_Engine_Spec_v1.md` and `Categorisation_Engine_Spec_v1.md` (derived from a real extraction exercise: 16 Axis/AU statements, ~1,000 transactions). Analysed using the standing framework: (1) live defects, (2) clean ports, (3) conflicts with locked decisions.

### Pile 1 — Live defect found

**`dedup_guard` fails when `utr_ref` is NULL.** Postgres treats NULL as distinct in unique indexes. The guard `(bank_account_id, txn_date, amount, utr_ref)` protects only when the UTR parsed cleanly — and stops protecting in exactly the case it exists for. Re-uploading a statement with no parseable UTRs duplicates every row.

**Fix (locked, not built):** tiered fingerprint using `running_balance` as discriminator:
```
1. utr_ref exists        → hash(bank_account_id, utr_ref)
2. running_balance exists → hash(bank_account_id, txn_date, amount, running_balance)
3. else                  → hash(bank_account_id, txn_date, amount, raw_narration, line_no)
```
Plus: never hard-reject. Mark `duplicate_of = txn_id`, exclude from aggregates.

### Pile 2 — Clean ports into ReconFlow

- **Deterministic before probabilistic.** `auto_categorise` (bank charge / GST / interest / TDS via AI) should be rule-based, no tokens. 25–35% of rows leave the AI workload. Correctness reason, cost benefit.
- **Statement chaining** — opening[n] = closing[n-1], period_start[n] = period_end[n-1] + 1. Produces a coverage timeline. **This is the answer to Breaking Risk 3** (no fast proof-of-value). Requires a `statements` table with control totals — does not exist yet.
- **Running-balance replay** — row-level `balance[i] = balance[i-1] − debit + credit`. Localises error to a line. Column exists, check does not.
- **Batch exceptions by customer name**, not by transaction.
- **Value-gated confidence** — any match above a client threshold always goes to review.

### Pile 3 — Conflicts, now resolved (see Decisions Locked)

---

## Decisions locked this session

### D1 — PDF boundary: DEFERRED TO PHASE 2, GATED
Previously "excluded forever." Now Phase 2, gated behind Replay + Chain being shipped and verified on CSV/Excel first. **Rationale:** validate deterministic input before admitting probabilistic input. Never test two uncertainties in one phase. Trigger *"Ready for PDF parsing"* re-activated.

### D2 — Tenancy: INHERITED FROM UNITS
ReconFlow builds no tenancy model. Single admin remains correct for a standalone micro-product. SME-as-tenant / CA-as-delegated-user are UNITS decisions within BasalOS. **Interim guard:** no `client_id` / `tenant_id` columns added ad hoc to any ReconFlow table.

### D3 — Spec boundary: THE LEDGER IS THE HANDOFF
```
ReconFlow:  INGEST → NORMALISE → VALIDATE → MATCH → EXCEPTIONS  → [ledger]
UNITS:      [ledger] → CLASSIFY → CATEGORISE → ACCOUNTING → TALLY
```
ReconFlow is the **front half of UNITS**, shipped standalone to real estate where pain is sharpest. Everything downstream of the ledger connects to UNITS.

---

## Diagnostic answers — recorded for next session

**Q1 (double upload, two ₹2,50,000 cheques, no UTR):** 4 rows in `bank_transactions_hub`. Two `MANUAL_MATCHED`, two `UNMATCHED`. CFO sees ₹5,00,000 of phantom unidentified credits. Tiered fingerprint catches it because the re-uploaded copies land at identical `running_balance` values.

**Q2 (classification vs categorisation):** Classification has a verifiable ground truth in data already held; categorisation does not. Test: would everyone in the company give the same answer? "Is this our own account?" — yes, lookup. "Is this fuel a business expense?" — no, judgement. Deterministic means *determined by data*, not *simple code*.

**Q3 (which proof-of-value moment):** Chain, for the buyer. Parse, for the daily user. Demo runs both in sequence. Chain's objections dissolve with design: onboarding asks for 3 months history so Chain has data on day one; the green "provably complete" bar is a printable audit artefact; gaps are phrased as questions, not alarms.

---

## Cumulative learnings — additions (11 onward)

**Learning 11 — Scheduled jobs must write their own proof of execution.**
Vercel free-tier logs expire in an hour. A daily cron cannot be verified from them. The job writes a row to your own database on every run. That row is the only reliable signal.

**Learning 12 — "Endpoint responds" ≠ "cron is firing."**
Manual call proves the route exists. Nothing more. Never confuse the two again.

**Learning 13 — NULL is distinct in Postgres unique indexes.**
Any dedup index that includes a nullable column provides zero protection when that column is NULL. Design fingerprints with a NULL-free fallback tier.

**Learning 14 — Never seed placeholder strings into nullable columns.**
`'EMPTY'` in `payment_reference` is not empty — it is a string that will be matched against. Use NULL.

**Learning 15 — Supabase magic link: 3 emails per hour on free tier.**
Plan verification steps so login happens once, early. Don't burn links on test cycles.

**Learning 16 — Deterministic before probabilistic. Fact before judgement.**
If the answer can be looked up, never ask a model to guess it. Wrong facts corrupt totals silently; wrong judgements only mislead charts. They cannot share an accuracy budget.

**Learning 17 — Validate deterministic input before admitting probabilistic input.**
The PDF principle, generalised. Never introduce two uncertainties in the same phase; you will not know which one broke.

**Learning 18 — Analyse incoming specs in three piles.**
(1) Live defects in the current build. (2) Clean ports into scope. (3) Conflicts with locked decisions requiring explicit resolution. Reading a spec any other way produces drift.

**Learning 19 — The ledger is the contract.**
ReconFlow's output artefact and UNITS's input artefact are the same object. Every schema decision in ReconFlow (raw narration retained, `matched_by`, receipts mirroring UNITS) exists so UNITS can trust the handoff without re-verifying.

---

## New parked ideas — with triggers

| Idea | Trigger phrase |
|---|---|
| Tiered dedup fingerprint + `duplicate_of` marker | *"Fix the dedup fingerprint."* |
| `statements` table with control totals + chaining + coverage timeline | *"Build the chain."* |
| Row-level running-balance replay | *"Build replay."* |
| Exceptions UI — batched by customer, value-gated, AI explanation | *"Build the exceptions UI."* |
| Deterministic rules replacing `auto_categorise` | *"Build smart rules."* (existing trigger, scope now sharpened) |
| PDF ingestion — Phase 2, gated behind Replay + Chain | *"Ready for PDF parsing."* (re-activated) |
| External cut of the launch doc (strip status + internal notes) | *"Cut the external launch doc."* |
| Substack follow-up on cron proof-of-execution | Out of ReconFlow scope — navinoswal.com project |

---

## Build status — delta from Session Master (Apr 18)

```
Session 5 (this thread)                          ✅ MOSTLY COMPLETE
  → keepalive_log table + /api/ping proof insert ✅ verified, 2 rows
  → POST /api/recon/match — Four-Pass engine     ✅ merged
  → /admin/dashboard — recon summary panel       ✅ merged
  → Test data seeded (4 txns, 3 receipts)        ✅
  → payment_reference 'EMPTY' → NULL fix         ✅
  → Two specs analysed, three piles              ✅
  → Live dedup defect identified                 ✅ (fix not built)
  → Launch doc v1 → v1.1                         ✅
  → Three open decisions locked (PDF/tenancy/ledger) ✅
  → Diagnostic questions answered                ✅
  → Reconciliation run verified                  ⚠️ blocked — magic link limit
  → First real parse                             ⚠️ blocked — API credits
```

---

## SESSION RESOURCE LOG — row to add

| # | Date | Model | Duration | What shipped |
|---|---|---|---|---|
| 5 | Apr 25 + Sep 6, 2026 | Claude (Fable 5.1 by Sep 6) | ~5 hrs est. | Keepalive proof log · Four-Pass matching engine · Recon dashboard · Test data · Spec alignment (3 piles) · Dedup defect found · Launch doc v1.1 · PDF/tenancy/ledger decisions locked |

---

## Next Session — Opening Brief

**Session 6: Verify · Fix · Prove**

Priority order, non-negotiable:

**6A — Verify (do first, 15 minutes)**
Log in once (magic link budget: 3/hour). Click Run Reconciliation. Confirm Rajesh Kumar → `AUTO_MATCHED`. Screenshot `bank_transactions_hub` and `receipts` with `recon_status` visible. Update Session Master.

**6B — Fix the dedup fingerprint**
Replace `dedup_guard` unique index with tiered fingerprint column + `duplicate_of` marker. SQL migration as standalone block. Claude Code prompt for the insert path in `/api/bank/parse`. Test: upload same seed twice, confirm 4 rows with 2 marked duplicate, dashboard counts 2.

**6C — First real parse (only if credits added)**
Upload real HDFC CSV. Read `token_log`. Record first unit-economics data point.

**6D — Build the chain (if time permits)**
`statements` table: statement_id, bank_account_id, period_start, period_end, opening_balance, closing_balance, file_sha256, validation_status. Parse writes one row per upload. Chaining check on insert. Coverage timeline is a later PR.

**Opening line for Session 6:**
> "Session 6. Verify the recon run first — one login, one click, screenshots. Then fix the dedup fingerprint. Start there."

**Before Session 6 (Navin):**
- [ ] Add Anthropic API credits (console.anthropic.com → Billing)
- [ ] Commit `RECONFLOW-LAUNCH-DOC-v1.1.md` and this summary to the repo
- [ ] Renumber Session Master to chat-thread convention
- [ ] Have one real HDFC CSV ready

---

*Session 5 summary · Built by Navin Oswal × Claude (Anthropic)*
*Cumulative: 5 sessions · ~18 hrs tracked · reconflow-zeta.vercel.app*
