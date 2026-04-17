'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''

export default function AdminDashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.replace('/admin/login')
        return
      }

      setSession(session)
      setLoading(false)
    }

    checkSession()
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#0D1B2A' }} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D1B2A',
        fontFamily: 'Inter, sans-serif',
        color: '#F0F4F8',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          background: 'rgba(13,27,42,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
          Recon<span style={{ color: '#C4622D' }}>Flow</span>{' '}
          <span style={{ color: '#8BA7C7', fontWeight: 400 }}>Admin</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#8BA7C7' }}>
            {session?.user.email}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: '#F0F4F8',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 65px)',
        }}
      >
        <p style={{ fontSize: '16px', color: '#8BA7C7' }}>
          Dashboard ready. Upload feature coming next.
        </p>
      </div>
    </div>
  )
}
