'use client'

import { useState, useEffect } from 'react'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '16px',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  height: '48px',
  padding: '0 16px',
  color: '#F0F4F8',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then(r => r.json())
      .then(d => { if (d.count > 0) setWaitlistCount(d.count) })
      .catch(() => {})
  }, [])

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company_name: companyName }),
      })
      const data = await res.json()
      if (res.ok) {
        setFormStatus('success')
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        setFormStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setFormStatus('error')
    }
  }

  return (
    <main style={{ background: '#0D1B2A', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F0F4F8' }}>

      {/* ── SECTION 1: NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled ? {
          background: 'rgba(13,27,42,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        } : {}}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#F0F4F8', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em' }}>
            ReconFlow
          </span>
          <button
            onClick={scrollToWaitlist}
            className="transition-all duration-200"
            style={{
              background: '#C4622D',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              height: '48px',
              padding: '0 32px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.10)'; e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
          >
            Join the waitlist
          </button>
        </div>
      </nav>

      {/* ── SECTION 2: HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 32px 64px' }}>
        <div style={{ maxWidth: '720px', width: '100%', textAlign: 'center' }}>

          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '28px' }}>
            <span style={{
              color: '#6B9E9E',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(107,158,158,0.12)',
              border: '1px solid rgba(107,158,158,0.3)',
              borderRadius: '9999px',
              padding: '6px 16px',
            }}>
              Built for Indian real estate back-offices
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            color: '#F0F4F8',
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '24px',
          }}>
            Somewhere between the bank statement and Tally,<br />
            ₹40 lakhs went missing for 11 days.
          </h1>

          {/* Subheadline */}
          <p style={{
            color: '#8BA7C7',
            fontSize: '18px',
            lineHeight: 1.6,
            marginBottom: '48px',
          }}>
            It wasn&apos;t fraud. It wasn&apos;t a mistake. It was a narration mismatch in an HDFC
            export that nobody caught because nobody had time to look.
            ReconFlow looks. Every time. In under 10 seconds.
          </p>

          {/* Stat blocks */}
          <div style={{ ...glass, marginBottom: '48px', overflow: 'hidden' }}>
            <div style={{ display: 'flex' }}>
              {[
                '150 transactions. 10 seconds. Done.',
                'Bank · Receipt · Tally — one truth.',
                'No Excel. No WhatsApp. No waiting.',
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: '20px 24px',
                    textAlign: 'center',
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : undefined,
                  }}
                >
                  <span style={{ color: '#F0F4F8', fontSize: '15px', fontWeight: 500 }}>{stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToWaitlist}
            style={{
              background: '#C4622D',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.10)'; e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
          >
            Join the waitlist →
          </button>
        </div>
      </section>

      {/* ── SECTION 3: THE GAP ── */}
      <section style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '56px', lineHeight: 1.3 }}>
            Your bank knows. Your receipt register knows. Tally knows.<br />
            None of them are talking.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>

            <div
              style={{ ...glass, padding: '32px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <span style={{ color: '#6B9E9E', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                Bank Statement
              </span>
              <h3 style={{ color: '#F0F4F8', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>Reality</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                ₹3,75,000 credited. Narration: NEFT/AXISBNK/2024031/89234. Is that Suresh
                Patil&apos;s instalment? Rajan Shah&apos;s advance? A refund from the contractor?
                Your bank doesn&apos;t know. It just received money.
              </p>
            </div>

            <div
              style={{ ...glass, padding: '32px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <span style={{ color: '#C4622D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                Receipt Register
              </span>
              <h3 style={{ color: '#F0F4F8', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>Intent</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Receipt #REC-2041. Ramesh Mehta. ₹2,50,000. April 2nd. Your team generated
                it the moment he called and said &apos;done the transfer.&apos; The bank shows a credit
                on April 3rd. Same amount. Different date. Is it the same payment? Your
                accounts executive has to decide. Alone. In Excel.
              </p>
            </div>

            <div
              style={{ ...glass, padding: '32px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <span style={{ color: '#8BA7C7', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                Tally
              </span>
              <h3 style={{ color: '#F0F4F8', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>Record</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Your Tally operator is not a detective. They post what they&apos;re given. If the
                receipt is wrong, the entry is wrong. If the entry is wrong, the books are
                wrong. Audit season doesn&apos;t care that it was a narration mismatch.
                It just sees a discrepancy.
              </p>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '48px', color: '#C4622D', fontSize: '18px', fontWeight: 600 }}>
            ReconFlow is the first time all three sources agree.
          </p>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '64px' }}>
            Upload. Match. Done. That&apos;s the entire workflow.
          </h2>

          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>

            {/* Step 1 */}
            <div
              style={{ ...glass, padding: '40px 32px', flex: 1 }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <div style={{ marginBottom: '24px' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 22V10M16 10L11 15M16 10L21 15" stroke="#6B9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 26h18" stroke="#6B9E9E" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 style={{ color: '#F0F4F8', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>Upload</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Drag your bank statement in. CSV or Excel. HDFC, ICICI, SBI — whichever
                format your bank exports. ReconFlow doesn&apos;t care about the format.
                It figures it out.
              </p>
            </div>

            {/* Connecting line */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0 }}>
              <div style={{ width: '48px', height: '1px', background: 'rgba(255,255,255,0.20)' }} />
            </div>

            {/* Step 2 */}
            <div
              style={{ ...glass, padding: '40px 32px', flex: 1 }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <div style={{ marginBottom: '24px' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13" cy="16" r="7" stroke="#6B9E9E" strokeWidth="2"/>
                  <circle cx="19" cy="16" r="7" stroke="#6B9E9E" strokeWidth="2"/>
                </svg>
              </div>
              <h3 style={{ color: '#F0F4F8', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>Match</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                ReconFlow reads every narration, pulls out the UTR, and matches it against
                your receipt register. UTR first. If that fails — amount and date. If that
                fails — it tells you exactly why, and shows you the closest candidate.
                It never just gives up and shows you a red flag.
              </p>
            </div>

            {/* Connecting line */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0 }}>
              <div style={{ width: '48px', height: '1px', background: 'rgba(255,255,255,0.20)' }} />
            </div>

            {/* Step 3 */}
            <div
              style={{ ...glass, padding: '40px 32px', flex: 1 }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <div style={{ marginBottom: '24px' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="11" stroke="#C4622D" strokeWidth="2"/>
                  <path d="M10 16l5 5 7-9" stroke="#C4622D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ color: '#F0F4F8', fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>Reconciled</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                127 matched. 23 open. Running balance verified. You&apos;re not building this in
                Excel anymore. You&apos;re just reviewing exceptions — and ReconFlow has already
                explained every single one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: EDGE CASES ── */}
      <section style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '56px', lineHeight: 1.3 }}>
            The things that trip up every manual process.<br />
            We&apos;ve already handled them.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            <div
              style={{ ...glass, padding: '32px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>De-duplication</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Upload the same statement twice. ReconFlow rejects the duplicates silently
                using a composite key: account + date + amount + UTR.
                No double entries. Ever.
              </p>
            </div>

            <div
              style={{ ...glass, padding: '32px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Balance integrity check</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Every upload verifies: opening balance + new credits − new debits = closing
                balance. If the maths don&apos;t match, the batch is held for review.
                No missing-middle transactions.
              </p>
            </div>

            <div
              style={{ ...glass, padding: '32px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Multi-bank normalisation</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                HDFC, ICICI, and SBI each format their exports differently. ReconFlow maps
                all three to a single standard schema before touching a single transaction.
              </p>
            </div>

            <div
              style={{ ...glass, padding: '32px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.transition = 'transform 150ms ease' }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}
            >
              <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Exception explanation</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Every unmatched transaction gets an explanation: what we looked for, what we
                found, the closest candidate, and why it didn&apos;t auto-match.
                Not just a red flag — a reason.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TALLY BOUNDARY ── */}
      <section style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ ...glass, padding: '56px 48px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0', alignItems: 'start' }}>

              <div style={{ paddingRight: '48px' }}>
                <h2 style={{ color: '#F0F4F8', fontSize: '28px', fontWeight: 600, marginBottom: '20px', lineHeight: 1.3 }}>
                  What lands in Tally from ReconFlow.
                </h2>
                <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                  Every transaction bank-verified, matched to a receipt,
                  deduplicated, and audit-trailed. Your Tally operator posts a clean entry.
                  Not a judgement call.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch', minHeight: '120px' }} />

              <div style={{ paddingLeft: '48px' }}>
                <h2 style={{ color: '#C4622D', fontSize: '28px', fontWeight: 600, marginBottom: '20px', lineHeight: 1.3 }}>
                  What we don&apos;t do in Phase 1.
                </h2>
                <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                  Posting to Tally automatically — that&apos;s Phase 2. We get the
                  data right first. Posting wrong data faster has a name: it&apos;s called
                  compounding the problem.
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '48px', paddingTop: '32px', textAlign: 'center' }}>
              <span style={{
                color: '#6B9E9E',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'rgba(107,158,158,0.12)',
                border: '1px solid rgba(107,158,158,0.3)',
                borderRadius: '9999px',
                padding: '8px 20px',
                display: 'inline-block',
              }}>
                Clean data first. Speed second. Always.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: PRICING ── */}
      <section style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600, marginBottom: '24px', lineHeight: 1.3 }}>
            You can see exactly what you&apos;re paying for. Down to the token.
          </h2>
          <p style={{ color: '#F0F4F8', fontSize: '16px', lineHeight: 1.6, marginBottom: '16px' }}>
            Every AI call ReconFlow makes is logged. Every token is counted. You
            see the compute cost, the markup, and the total charge. We add 20% on top of
            our actual cost. That&apos;s our margin. We&apos;re not hiding it. Finance teams
            understand margins. We&apos;re just being honest about ours.
          </p>
          <p style={{ color: '#8BA7C7', fontSize: '14px', lineHeight: 1.6 }}>
            No subscription tiers designed to obscure your actual usage. No &apos;contact sales
            for pricing.&apos; Just cost × 1.20, visible in your dashboard.
          </p>
        </div>
      </section>

      {/* ── SECTION 8: WAITLIST ── */}
      <section id="waitlist" style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ ...glass, padding: '48px' }}>
            <h2 style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '16px' }}>
              Be the first team to stop doing this in Excel.
            </h2>
            <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6, textAlign: 'center', marginBottom: waitlistCount ? '16px' : '40px' }}>
              We&apos;re starting with 10 real estate developers in Pune
              and Mumbai. If your accounts team has a reconciliation problem, we want to
              talk to you before we talk to anyone else.
            </p>

            {waitlistCount && (
              <p style={{ color: '#6B9E9E', fontSize: '14px', textAlign: 'center', marginBottom: '40px', opacity: 0.85 }}>
                {waitlistCount} teams already on the list
              </p>
            )}

            {formStatus === 'success' ? (
              <div style={{
                textAlign: 'center',
                color: '#6B9E9E',
                fontSize: '18px',
                fontWeight: 500,
                padding: '24px',
                background: 'rgba(107,158,158,0.10)',
                borderRadius: '12px',
                border: '1px solid rgba(107,158,158,0.3)',
              }}>
                You&apos;re on the list. We&apos;ll be in touch.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="Your company name"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  style={{
                    width: '100%',
                    background: formStatus === 'loading' ? 'rgba(196,98,45,0.6)' : '#C4622D',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '9999px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => { if (formStatus !== 'loading') { e.currentTarget.style.filter = 'brightness(1.10)'; e.currentTarget.style.transform = 'scale(1.02)' } }}
                  onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
                >
                  {formStatus === 'loading' ? 'Joining...' : 'Join the waitlist →'}
                </button>
                {formStatus === 'error' && (
                  <p style={{ color: '#e87070', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                    {errorMessage}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: '#8BA7C7', fontSize: '14px' }}>
          ReconFlow · Collections in sync. Records in flow. · Built in Pune, India.
        </p>
      </footer>

    </main>
  )
}
