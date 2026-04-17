import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const session_id = formData.get('session_id') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // STEP 1 — Read the CSV
    const csvText = await file.text()
    const csvContent = csvText.slice(0, 8000)

    // STEP 2 — Find bank account
    const { data: bankAccount } = await supabase
      .from('bank_accounts_master')
      .select('account_id')
      .eq('bank_name', 'HDFC')
      .limit(1)
      .maybeSingle()

    if (!bankAccount) {
      return NextResponse.json(
        { error: 'No HDFC bank account found in system.' },
        { status: 400 }
      )
    }

    const accountId = bankAccount.account_id

    // STEP 3 — Call Claude API
    const startTime = Date.now()

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system:
          'You are a bank statement parser. You parse Indian bank statement CSV data and return structured JSON. Return ONLY valid JSON — no explanation, no markdown, no code blocks. Just the raw JSON array.',
        messages: [
          {
            role: 'user',
            content: `Parse this HDFC bank statement CSV and extract all transactions.
For each transaction return exactly this JSON structure:
{
  txn_date: string (YYYY-MM-DD format),
  amount: number (positive for credits, negative for debits),
  raw_narration: string (full narration as-is),
  utr_ref: string (extract UTR/reference number from narration or Chq/Ref field — if none found, return empty string ''),
  closing_balance: number (closing balance for that row if available, else null)
}
Return a JSON array of all transactions. Skip header rows.
Skip rows that have no amount (neither credit nor debit).

CSV DATA:
${csvContent}`,
          },
        ],
      }),
    })

    if (!anthropicResponse.ok) {
      return NextResponse.json(
        { error: 'AI service error. Please try again.' },
        { status: 502 }
      )
    }

    const anthropicData = await anthropicResponse.json()
    const duration = Date.now() - startTime

    // STEP 4 — Log tokens (non-blocking)
    try {
      await supabase.from('token_log').insert({
        session_id: session_id ?? crypto.randomUUID(),
        user_id: 'admin',
        model: 'claude-sonnet-4-6',
        input_tokens: anthropicData.usage?.input_tokens ?? 0,
        output_tokens: anthropicData.usage?.output_tokens ?? 0,
        feature: 'bank_parse',
        duration_ms: duration,
        notes: 'HDFC CSV upload',
      })
    } catch (logError) {
      console.error('Token log error:', logError)
    }

    // STEP 5 — Parse Claude's response
    type ParsedTransaction = {
      txn_date: string
      amount: number
      raw_narration: string
      utr_ref: string
      closing_balance: number | null
    }

    let transactions: ParsedTransaction[]

    try {
      const rawText: string = anthropicData.content?.[0]?.text ?? ''
      transactions = JSON.parse(rawText)
    } catch {
      return NextResponse.json(
        { error: 'AI could not parse this file.' },
        { status: 422 }
      )
    }

    // STEP 6 — Save to bank_transactions_hub
    let saved_count = 0
    let skipped_count = 0
    const filename = file.name

    for (const txn of transactions) {
      try {
        const { error } = await supabase.from('bank_transactions_hub').insert({
          bank_account_id: accountId,
          utr_ref: txn.utr_ref || '',
          txn_date: txn.txn_date,
          amount: txn.amount,
          raw_narration: txn.raw_narration,
          source_type: 'MANUAL_UPLOAD',
          source_ref_doc: filename,
          recon_status: 'UNMATCHED',
          running_balance: txn.closing_balance ?? null,
        })

        if (error) {
          if (error.code === '23505') {
            skipped_count++
          } else {
            console.error('Insert error:', error)
          }
        } else {
          saved_count++
        }
      } catch {
        console.error('Unexpected insert error for txn:', txn)
      }
    }

    // STEP 7 — Return response
    return NextResponse.json({
      success: true,
      total_parsed: transactions.length,
      saved: saved_count,
      skipped_duplicates: skipped_count,
      input_tokens: anthropicData.usage?.input_tokens ?? 0,
      output_tokens: anthropicData.usage?.output_tokens ?? 0,
      transactions,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
