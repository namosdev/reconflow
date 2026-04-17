import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, company_name } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const startTime = Date.now()

    const { error: waitlistError } = await supabase
      .from('waitlist')
      .insert({
        email: email.trim().toLowerCase(),
        company_name: company_name ? String(company_name).trim() : null,
      })

    if (waitlistError) {
      // Duplicate email (unique constraint violation)
      if (waitlistError.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist.' },
          { status: 409 }
        )
      }
      console.error('Waitlist insert error:', waitlistError)
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime

    // Log submission to token_log — no AI call, but log the action per standing orders
    try {
      await supabase.from('token_log').insert({
        session_id: crypto.randomUUID(),
        user_id: null,
        model: 'none',
        input_tokens: 0,
        output_tokens: 0,
        feature: 'waitlist_signup',
        duration_ms: duration,
        notes: email.trim().toLowerCase(),
      })
    } catch (logError) {
      // Token log failure must not block the signup response
      console.error('Token log error:', logError)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
