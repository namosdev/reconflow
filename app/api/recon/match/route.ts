import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type MatchStatus = 'AUTO_MATCHED' | 'MANUAL_MATCHED' | 'FLAGGED'

async function applyMatch(
  supabase: ReturnType<typeof createClient>,
  txnId: string,
  receiptId: string,
  receiptNo: string,
  status: MatchStatus
) {
  await supabase
    .from('bank_transactions_hub')
    .update({ recon_status: status, system_receipt_id: receiptNo })
    .eq('txn_id', txnId)

  await supabase
    .from('receipts')
    .update({
      recon_status: status,
      matched_txn_id: txnId,
      matched_at: new Date().toISOString(),
      matched_by: 'SYSTEM',
    })
    .eq('receipt_id', receiptId)
}

export async function POST(req: NextRequest) {
  let body: { bank_account_id?: string } | null = null
  try {
    body = await req.json()
  } catch {
    // body stays null
  }

  const bank_account_id = body?.bank_account_id

  if (!bank_account_id) {
    return NextResponse.json({ error: 'bank_account_id is required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: transactions, error: txnError } = await supabase
    .from('bank_transactions_hub')
    .select('txn_id, utr_ref, txn_date, amount')
    .eq('bank_account_id', bank_account_id)
    .eq('recon_status', 'UNMATCHED')

  if (txnError) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }

  if (!transactions || transactions.length === 0) {
    return NextResponse.json({
      message: 'No transactions to reconcile',
      total_transactions: 0,
      auto_matched: 0,
      manual_matched: 0,
      flagged: 0,
      unmatched: 0,
      run_at: new Date().toISOString(),
    })
  }

  let auto_matched = 0
  let manual_matched = 0
  let flagged = 0

  for (const txn of transactions) {
    try {
      // PASS 1 — UTR exact match (case-insensitive)
      if (txn.utr_ref) {
        const { data: receipt } = await supabase
          .from('receipts')
          .select('receipt_id, receipt_no')
          .filter('payment_reference', 'ilike', txn.utr_ref)
          .eq('recon_status', 'UNMATCHED')
          .eq('total_amount', txn.amount)
          .limit(1)
          .maybeSingle()

        if (receipt) {
          await applyMatch(supabase, txn.txn_id, receipt.receipt_id, receipt.receipt_no, 'AUTO_MATCHED')
          auto_matched++
          continue
        }
      }

      // PASS 2 — Amount + Date match (within 1 calendar day)
      const txnDate = new Date(txn.txn_date)
      const dayBefore = new Date(txnDate)
      dayBefore.setDate(dayBefore.getDate() - 1)
      const dayAfter = new Date(txnDate)
      dayAfter.setDate(dayAfter.getDate() + 1)

      const { data: receiptP2 } = await supabase
        .from('receipts')
        .select('receipt_id, receipt_no')
        .eq('total_amount', txn.amount)
        .gte('receipt_date', dayBefore.toISOString().split('T')[0])
        .lte('receipt_date', dayAfter.toISOString().split('T')[0])
        .eq('recon_status', 'UNMATCHED')
        .limit(1)
        .maybeSingle()

      if (receiptP2) {
        await applyMatch(supabase, txn.txn_id, receiptP2.receipt_id, receiptP2.receipt_no, 'MANUAL_MATCHED')
        manual_matched++
        continue
      }

      // PASS 3 — Amount only
      const { data: receiptP3 } = await supabase
        .from('receipts')
        .select('receipt_id, receipt_no')
        .eq('total_amount', txn.amount)
        .eq('recon_status', 'UNMATCHED')
        .limit(1)
        .maybeSingle()

      if (receiptP3) {
        await applyMatch(supabase, txn.txn_id, receiptP3.receipt_id, receiptP3.receipt_no, 'FLAGGED')
        flagged++
        continue
      }

      // PASS 4 — remains UNMATCHED

    } catch (err) {
      console.error('Match error for txn:', txn.txn_id, err)
    }
  }

  const unmatched = transactions.length - auto_matched - manual_matched - flagged

  return NextResponse.json({
    total_transactions: transactions.length,
    auto_matched,
    manual_matched,
    flagged,
    unmatched,
    run_at: new Date().toISOString(),
  })
}
