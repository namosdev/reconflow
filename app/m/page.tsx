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
  height: '56px',
  padding: '0 16px',
  color: '#F0F4F8',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
}

export default function MobileLanding() {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showStickyCTA, setShowStickyCTA] = useState(true)

  useEffect(() => {
    const waitlist = document.getElementById('waitlist')
    if (!waitlist) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCTA(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(waitlist)
    return () => observer.disconnect()
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
    <main style={{ background: '#0D1B2A', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F0F4F8', paddingBottom: '80px' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(13,27,42,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#F0F4F8', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em' }}>
            ReconFlow
          </span>
          <button
            onClick={scrollToWaitlist}
            style={{
              background: '#C4622D',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              height: '32px',
              padding: '0 16px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Waitlist
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: '96px', paddingBottom: '64px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ textAlign: 'center' }}>

          {/* Eyebrow */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{
              color: '#6B9E9E',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'rgba(107,158,158,0.12)',
              border: '1px solid rgba(107,158,158,0.3)',
              borderRadius: '9999px',
              padding: '6px 14px',
              display: 'inline-block',
            }}>
              Built for Indian real estate back-offices
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            color: '#F0F4F8',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '20px',
          }}>
            Somewhere between the bank statement and Tally, ₹40 lakhs went missing for 11 days.
          </h1>

          {/* Subheadline */}
          <p style={{
            color: '#8BA7C7',
            fontSize: '15px',
            lineHeight: 1.65,
            marginBottom: '40px',
          }}>
            It wasn&apos;t fraud. It wasn&apos;t a mistake. It was a narration mismatch in an HDFC
            export that nobody caught because nobody had time to look.
            ReconFlow looks. Every time. In under 10 seconds.
          </p>

          {/* Stat blocks */}
          <div style={{ ...glass, marginBottom: '40px', textAlign: 'left' }}>
            {[
              '150 transactions. 10 seconds. Done.',
              'Bank · Receipt · Tally — one truth.',
              'No Excel. No WhatsApp. No waiting.',
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 20px',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : undefined,
                }}
              >
                <span style={{ color: '#F0F4F8', fontSize: '15px', fontWeight: 500 }}>{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE GAP ── */}
      <section style={{ paddingTop: '64px', paddingBottom: '40px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ color: '#F0F4F8', fontSize: '24px', fontWeight: 600, textAlign: 'center', marginBottom: '40px', lineHeight: 1.3 }}>
          Your bank knows. Your receipt register knows. Tally knows. None of them are talking.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ ...glass, padding: '24px' }}>
            <span style={{ color: '#6B9E9E', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              Bank Statement
            </span>
            <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Reality</h3>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              ₹3,75,000 credited. Narration: NEFT/AXISBNK/2024031/89234. Is that Suresh
              Patil&apos;s instalment? Rajan Shah&apos;s advance? A refund from the contractor?
              Your bank doesn&apos;t know. It just received money.
            </p>
          </div>

          <div style={{ ...glass, padding: '24px' }}>
            <span style={{ color: '#C4622D', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              Receipt Register
            </span>
            <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Intent</h3>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Receipt #REC-2041. Ramesh Mehta. ₹2,50,000. April 2nd. Your team generated
              it the moment he called and said &apos;done the transfer.&apos; The bank shows a credit
              on April 3rd. Same amount. Different date. Is it the same payment? Your
              accounts executive has to decide. Alone. In Excel.
            </p>
          </div>

          <div style={{ ...glass, padding: '24px' }}>
            <span style={{ color: '#8BA7C7', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              Tally
            </span>
            <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Record</h3>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Your Tally operator is not a detective. They post what they&apos;re given. If the
              receipt is wrong, the entry is wrong. If the entry is wrong, the books are
              wrong. Audit season doesn&apos;t care that it was a narration mismatch.
              It just sees a discrepancy.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '40px', color: '#C4622D', fontSize: '16px', fontWeight: 600 }}>
          ReconFlow is the first time all three sources agree.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ paddingTop: '64px', paddingBottom: '40px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ color: '#F0F4F8', fontSize: '24px', fontWeight: 600, textAlign: 'center', marginBottom: '48px' }}>
          Upload. Match. Done. That&apos;s the entire workflow.
        </h2>

        <div style={{ position: 'relative', paddingLeft: '28px' }}>
          {/* Vertical dotted line */}
          <div style={{
            position: 'absolute',
            left: '7px',
            top: '20px',
            bottom: '20px',
            width: '0',
            borderLeft: '2px dotted rgba(255,255,255,0.20)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Step 1 */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '22px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#6B9E9E',
              }} />
              <div style={{ ...glass, padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 22V10M16 10L11 15M16 10L21 15" stroke="#6B9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 26h18" stroke="#6B9E9E" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, margin: 0 }}>Upload</h3>
                </div>
                <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
                  Drag your bank statement in. CSV or Excel. HDFC, ICICI, SBI — whichever
                  format your bank exports. ReconFlow doesn&apos;t care about the format.
                  It figures it out.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '22px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#6B9E9E',
              }} />
              <div style={{ ...glass, padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="13" cy="16" r="7" stroke="#6B9E9E" strokeWidth="2"/>
                    <circle cx="19" cy="16" r="7" stroke="#6B9E9E" strokeWidth="2"/>
                  </svg>
                  <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, margin: 0 }}>Match</h3>
                </div>
                <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
                  ReconFlow reads every narration, pulls out the UTR, and matches it against
                  your receipt register. UTR first. If that fails — amount and date. If that
                  fails — it tells you exactly why, and shows you the closest candidate.
                  It never just gives up and shows you a red flag.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '22px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#C4622D',
              }} />
              <div style={{ ...glass, padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="11" stroke="#C4622D" strokeWidth="2"/>
                    <path d="M10 16l5 5 7-9" stroke="#C4622D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, margin: 0 }}>Reconciled</h3>
                </div>
                <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
                  127 matched. 23 open. Running balance verified. You&apos;re not building this in
                  Excel anymore. You&apos;re just reviewing exceptions — and ReconFlow has already
                  explained every single one.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── EDGE CASES ── */}
      <section style={{ paddingTop: '64px', paddingBottom: '40px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ color: '#F0F4F8', fontSize: '24px', fontWeight: 600, textAlign: 'center', marginBottom: '40px', lineHeight: 1.3 }}>
          The things that trip up every manual process. We&apos;ve already handled them.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ ...glass, padding: '24px' }}>
            <h3 style={{ color: '#F0F4F8', fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>De-duplication</h3>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Upload the same statement twice. ReconFlow rejects the duplicates silently
              using a composite key: account + date + amount + UTR.
              No double entries. Ever.
            </p>
          </div>

          <div style={{ ...glass, padding: '24px' }}>
            <h3 style={{ color: '#F0F4F8', fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Balance integrity check</h3>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Every upload verifies: opening balance + new credits − new debits = closing
              balance. If the maths don&apos;t match, the batch is held for review.
              No missing-middle transactions.
            </p>
          </div>

          <div style={{ ...glass, padding: '24px' }}>
            <h3 style={{ color: '#F0F4F8', fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Multi-bank normalisation</h3>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              HDFC, ICICI, and SBI each format their exports differently. ReconFlow maps
              all three to a single standard schema before touching a single transaction.
            </p>
          </div>

          <div style={{ ...glass, padding: '24px' }}>
            <h3 style={{ color: '#F0F4F8', fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>Exception explanation</h3>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Every unmatched transaction gets an explanation: what we looked for, what we
              found, the closest candidate, and why it didn&apos;t auto-match.
              Not just a red flag — a reason.
            </p>
          </div>

        </div>
      </section>

      {/* ── TALLY BOUNDARY ── */}
      <section style={{ paddingTop: '64px', paddingBottom: '40px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ ...glass, padding: '32px' }}>
            <h2 style={{ color: '#F0F4F8', fontSize: '24px', fontWeight: 600, marginBottom: '16px', lineHeight: 1.3 }}>
              What lands in Tally from ReconFlow.
            </h2>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Every transaction bank-verified, matched to a receipt,
              deduplicated, and audit-trailed. Your Tally operator posts a clean entry.
              Not a judgement call.
            </p>
          </div>

          <div style={{ ...glass, padding: '32px' }}>
            <h2 style={{ color: '#C4622D', fontSize: '24px', fontWeight: 600, marginBottom: '16px', lineHeight: 1.3 }}>
              What we don&apos;t do in Phase 1.
            </h2>
            <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
              Posting to Tally automatically — that&apos;s Phase 2. We get the
              data right first. Posting wrong data faster has a name: it&apos;s called
              compounding the problem.
            </p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <span style={{
            color: '#6B9E9E',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'rgba(107,158,158,0.12)',
            border: '1px solid rgba(107,158,158,0.3)',
            borderRadius: '9999px',
            padding: '8px 16px',
            display: 'inline-block',
          }}>
            Clean data first. Speed second. Always.
          </span>
        </div>

      </section>

      {/* ── PRICING ── */}
      <section style={{ paddingTop: '64px', paddingBottom: '40px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ color: '#F0F4F8', fontSize: '24px', fontWeight: 600, marginBottom: '20px', lineHeight: 1.3 }}>
          You can see exactly what you&apos;re paying for. Down to the token.
        </h2>
        <p style={{ color: '#F0F4F8', fontSize: '15px', lineHeight: 1.65, marginBottom: '16px' }}>
          Every AI call ReconFlow makes is logged. Every token is counted. You
          see the compute cost, the markup, and the total charge. We add 20% on top of
          our actual cost. That&apos;s our margin. We&apos;re not hiding it. Finance teams
          understand margins. We&apos;re just being honest about ours.
        </p>
        <p style={{ color: '#8BA7C7', fontSize: '14px', lineHeight: 1.65 }}>
          No subscription tiers designed to obscure your actual usage. No &apos;contact sales
          for pricing.&apos; Just cost × 1.20, visible in your dashboard.
        </p>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" style={{ paddingTop: '64px', paddingBottom: '40px', paddingLeft: '16px', paddingRight: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ ...glass, padding: '32px' }}>
          <h2 style={{ color: '#F0F4F8', fontSize: '24px', fontWeight: 600, textAlign: 'center', marginBottom: '16px' }}>
            Be the first team to stop doing this in Excel.
          </h2>
          <p style={{ color: '#8BA7C7', fontSize: '15px', lineHeight: 1.65, textAlign: 'center', marginBottom: '32px' }}>
            We&apos;re starting with 10 real estate developers in Pune
            and Mumbai. If your accounts team has a reconciliation problem, we want to
            talk to you before we talk to anyone else.
          </p>

          {formStatus === 'success' ? (
            <div style={{
              textAlign: 'center',
              color: '#6B9E9E',
              fontSize: '17px',
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
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
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
                  height: '56px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
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
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 16px', textAlign: 'center' }}>
        <p style={{ color: '#F0F4F8', fontSize: '16px', fontWeight: 600, marginBottom: '8px', margin: '0 0 8px' }}>ReconFlow</p>
        <p style={{ color: '#8BA7C7', fontSize: '15px', marginBottom: '8px', margin: '0 0 8px' }}>Collections in sync. Records in flow.</p>
        <p style={{ color: '#8BA7C7', fontSize: '14px', margin: 0 }}>Built in Pune, India.</p>
      </footer>

      {/* ── STICKY BOTTOM CTA ── */}
      {showStickyCTA && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '12px 16px',
          background: 'rgba(13,27,42,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <button
            onClick={scrollToWaitlist}
            style={{
              width: '100%',
              background: '#C4622D',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              height: '56px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Join the waitlist →
          </button>
        </div>
      )}

    </main>
  )
}
