'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reconflow-zeta.vercel.app'

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'restricted'

const statusMessages: Record<Status, string> = {
  idle: '',
  sending: 'Sending...',
  sent: 'Check your email.',
  error: 'Something went wrong.',
  restricted: 'Access restricted.',
}

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '16px',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setStatus('restricted')
      return
    }

    setStatus('sending')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: SITE_URL + '/admin/dashboard',
      },
    })

    setStatus(error ? 'error' : 'sent')
  }

  const isError = status === 'error' || status === 'restricted'
  const isDisabled = status === 'sending' || status === 'sent'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D1B2A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        padding: '24px',
      }}
    >
      <div style={{ ...glass, width: '100%', maxWidth: '420px', padding: '48px 40px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#F0F4F8', letterSpacing: '-0.5px' }}>
            Recon<span style={{ color: '#C4622D' }}>Flow</span>
          </span>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#F0F4F8',
            margin: '0 0 8px',
            textAlign: 'center',
          }}
        >
          Admin Access
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#8BA7C7',
            margin: '0 0 32px',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Magic link sent to your email. No password required.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="namos.dev@gmail.com"
            required
            disabled={isDisabled}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              marginBottom: '16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: '#F0F4F8',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
              opacity: isDisabled ? 0.6 : 1,
            }}
          />

          <button
            type="submit"
            disabled={isDisabled}
            style={{
              display: 'block',
              width: '100%',
              height: '48px',
              background: isDisabled ? 'rgba(196,98,45,0.5)' : '#C4622D',
              color: '#F0F4F8',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transition: 'background 200ms ease',
            }}
          >
            Send Magic Link
          </button>
        </form>

        {status !== 'idle' && (
          <p
            style={{
              margin: '16px 0 0',
              fontSize: '13px',
              textAlign: 'center',
              color: isError ? '#e87070' : '#8BA7C7',
            }}
          >
            {statusMessages[status]}
          </p>
        )}
      </div>
    </div>
  )
}
