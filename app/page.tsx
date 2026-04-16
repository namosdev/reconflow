'use client'

import { useState, useEffect } from 'react'

const glass = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '16px',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
} as React.CSSProperties

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '10px',
  padding: '14px 18px',
  color: '#F0F4F8',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
}

const steps = [
  {
    num: '01',
    title: 'Upload',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 24V12M18 12L13 17M18 12L23 17" stroke="#C4622D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 28h18" stroke="#C4622D" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    body: 'Drop your HDFC, ICICI, or SBI bank statement. CSV or Excel. ReconFlow normalises it automatically.',
  },
  {
    num: '02',
    title: 'Match',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="18" r="8" stroke="#C4622D" strokeWidth="2"/>
        <circle cx="21" cy="18" r="8" stroke="#C4622D" strokeWidth="2"/>
      </svg>
    ),
    body: 'AI parses narrations, extracts UTRs, and matches against your receipt register. UTR first. Amount + date as fallback.',
  },
  {
    num: '03',
    title: 'Reconciled',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="11" stroke="#C4622D" strokeWidth="2"/>
        <path d="M12 18l5 5 7-9" stroke="#C4622D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    body: 'See exactly which receipts are matched, which are open, and why. Running balance verified against your statement.',
  },
]

const edgeCases = [
  {
    title: 'De-duplication',
    body: 'Upload the same statement twice. ReconFlow rejects the duplicates silently using a composite key: account + date + amount + UTR. No double entries. Ever.',
  },
  {
    title: 'Balance integrity check',
    body: 'Every upload verifies: opening balance + new credits − new debits = closing balance. If the maths don\'t match, the batch is held for review. No missing-middle transactions.',
  },
  {
    title: 'Multi-bank normalisation',
    body: 'HDFC, ICICI, and SBI each format their exports differently. ReconFlow maps all three to a single standard schema before touching a single transaction.',
  },
  {
    title: 'Exception explanation',
    body: 'Every unmatched transaction gets an explanation: what we looked for, what we found, the closest candidate, and why it didn\'t auto-match. Not just a red flag — a reason.',
  },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

      {/* ── SECTION 1: NAVIGATION ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled ? {
          background: 'rgba(13,27,42,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        } as React.CSSProperties : undefined}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span style={{ color: '#F0F4F8', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em' }}>
            ReconFlow
          </span>
          <button
            onClick={scrollToWaitlist}
            className="transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
            style={{
              background: '#C4622D',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              height: '44px',
              padding: '0 24px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Join the waitlist
          </button>
        </div>
      </nav>

      {/* ── SECTION 2: HERO ── */}
      <section className="flex items-center justify-center min-h-screen px-6 pt-16">
        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow tag */}
          <div className="inline-flex items-center mb-6" style={{
            background: 'rgba(107,158,158,0.12)',
            border: '1px solid rgba(107,158,158,0.3)',
            borderRadius: '9999px',
            padding: '6px 16px',
          }}>
            <span style={{ color: '#6B9E9E', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Built for Indian real estate developers
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            color: '#F0F4F8',
            fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '24px',
          }}>
            Your accounts team spends 3 days<br />
            reconciling what should take 3 hours.
          </h1>

          {/* Subheadline */}
          <p style={{
            color: '#8BA7C7',
            fontSize: '16px',
            lineHeight: 1.6,
            maxWidth: '580px',
            margin: '0 auto 40px',
          }}>
            ReconFlow ingests your bank statements, matches them against your receipt register,
            and shows you exactly what&apos;s matched, what isn&apos;t, and why — in under 10 seconds.
          </p>

          {/* Stat blocks */}
          <div style={{ ...glass, marginBottom: '40px', overflow: 'hidden' }}>
            <div className="flex flex-col md:flex-row">
              {[
                '150 transactions parsed in <10 seconds',
                '3 matching sources unified',
                'Zero Excel. Zero guesswork.',
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex-1 py-5 px-6 text-center"
                  style={{
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : undefined,
                  }}
                >
                  <span className="hidden md:inline" style={{
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : undefined,
                  }} />
                  <span style={{ color: '#F0F4F8', fontSize: '14px', fontWeight: 500 }}>{stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToWaitlist}
            className="transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
            style={{
              background: '#C4622D',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              height: '56px',
              padding: '0 48px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Join the waitlist →
          </button>
        </div>
      </section>

      {/* ── SECTION 3: THE GAP ── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-12" style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600 }}>
            Three sources that never talk to each other.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div style={{ ...glass, padding: '32px' }}>
              <span style={{ color: '#6B9E9E', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                Bank Statement
              </span>
              <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Reality</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Credits land in your account. Narrations are garbled. UTRs are buried in strings. No one knows which receipt this belongs to.
              </p>
            </div>

            <div style={{ ...glass, padding: '32px' }}>
              <span style={{ color: '#C4622D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                Receipt Register
              </span>
              <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Intent</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Your team generated a receipt for ₹2,50,000 from Ramesh Mehta. The bank shows the credit. They may or may not be the same transaction.
              </p>
            </div>

            <div style={{ ...glass, padding: '32px' }}>
              <span style={{ color: '#8BA7C7', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                Tally
              </span>
              <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Record</h3>
              <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                Your accountant posts what they&apos;re told. If the match is wrong, the entry is wrong. The audit will find it. You won&apos;t — until then.
              </p>
            </div>
          </div>

          <p className="text-center mt-10" style={{ color: '#C4622D', fontSize: '18px', fontWeight: 500 }}>
            ReconFlow is the bridge between all three.
          </p>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-16" style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600 }}>
            Three steps. That&apos;s the whole workflow.
          </h2>

          <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
            {steps.flatMap((step, i) => {
              const card = (
                <div key={`step-${i}`} style={{ ...glass, padding: '32px', flex: 1 }}>
                  <div style={{ marginBottom: '20px' }}>{step.icon}</div>
                  <div style={{ color: '#C4622D', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Step {step.num}
                  </div>
                  <h3 style={{ color: '#F0F4F8', fontSize: '22px', fontWeight: 600, marginBottom: '12px' }}>{step.title}</h3>
                  <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>{step.body}</p>
                </div>
              )
              if (i < steps.length - 1) {
                return [
                  card,
                  <div key={`arrow-${i}`} className="hidden md:flex items-center justify-center flex-shrink-0" style={{ padding: '0 12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>,
                ]
              }
              return [card]
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: EDGE CASES ── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-12" style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600 }}>
            The details no one else bothers with.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {edgeCases.map((card, i) => (
              <div key={i} style={{ ...glass, padding: '32px' }}>
                <h3 style={{ color: '#F0F4F8', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>{card.title}</h3>
                <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TALLY BOUNDARY ── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ ...glass, padding: '48px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 style={{ color: '#F0F4F8', fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
                  What ReconFlow hands to Tally.
                </h2>
                <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                  Transactions that are bank-verified, matched to a receipt, deduplicated, and audit-trailed.
                  Your Tally operator posts a clean entry — not a guess.
                </p>
              </div>
              <div>
                <h2 style={{ color: '#C4622D', fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
                  What we don&apos;t do in Phase 1.
                </h2>
                <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6 }}>
                  Auto-post to Tally. That&apos;s Phase 2. We get the data right first.
                </p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '40px', paddingTop: '32px', textAlign: 'center' }}>
              <span style={{
                color: '#6B9E9E',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                background: 'rgba(107,158,158,0.12)',
                padding: '10px 24px',
                borderRadius: '9999px',
                border: '1px solid rgba(107,158,158,0.3)',
                display: 'inline-block',
              }}>
                Posting wrong data faster is not a feature.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: PRICING SIGNAL ── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600, marginBottom: '24px' }}>
            No black box pricing.
          </h2>
          <p style={{ color: '#F0F4F8', fontSize: '16px', lineHeight: 1.6, marginBottom: '16px' }}>
            You pay for exactly what it costs us, plus 20%.<br />
            Every AI call is logged. Every token is counted. You see the compute cost, the markup, and the total.<br />
            That&apos;s it. No surprises. No fixed fee guesswork.
          </p>
          <p style={{ color: '#8BA7C7', fontSize: '14px', lineHeight: 1.6 }}>
            Built for finance teams who know what a margin is.
          </p>
        </div>
      </section>

      {/* ── SECTION 8: WAITLIST FORM ── */}
      <section id="waitlist" className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-lg mx-auto">
          <div style={{ ...glass, padding: '48px' }}>
            <h2 style={{ color: '#F0F4F8', fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '12px' }}>
              Get early access.
            </h2>
            <p style={{ color: '#8BA7C7', fontSize: '16px', lineHeight: 1.6, textAlign: 'center', marginBottom: '36px' }}>
              We&apos;re onboarding a small group of real estate developers first. Tell us where to reach you.
            </p>

            {formStatus === 'success' ? (
              <div style={{
                textAlign: 'center',
                color: '#6B9E9E',
                fontSize: '18px',
                fontWeight: 500,
                padding: '24px',
                background: 'rgba(107,158,158,0.1)',
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
                    placeholder="Email address"
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
                  className="transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                  style={{
                    width: '100%',
                    background: formStatus === 'loading' ? 'rgba(196,98,45,0.6)' : '#C4622D',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '9999px',
                    height: '52px',
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
