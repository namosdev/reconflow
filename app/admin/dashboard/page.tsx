'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''

type ParsedTransaction = {
  txn_date: string
  amount: number
  raw_narration: string
  utr_ref: string
  closing_balance: number | null
}

type ParseResult = {
  success: boolean
  total_parsed: number
  saved: number
  skipped_duplicates: number
  input_tokens: number
  output_tokens: number
  transactions: ParsedTransaction[]
}

function formatIndianAmount(amount: number): string {
  const abs = Math.abs(amount)
  return `₹ ${abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const [file, setFile] = useState<File | null>(null)
  const [accountNo, setAccountNo] = useState('')
  const [closingBalance, setClosingBalance] = useState('')
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [result, setResult] = useState<ParseResult | null>(null)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setStatus('loading')
    setStatusMsg('Sending to AI for parsing...')
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('account_no', accountNo)
    formData.append('closing_balance', closingBalance)
    formData.append('session_id', Date.now().toString())

    try {
      const res = await fetch('/api/bank/parse', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setStatusMsg(data.error ?? 'Something went wrong.')
      } else {
        setStatus('success')
        setStatusMsg(
          `✓ ${data.saved} transactions saved. ${data.skipped_duplicates} duplicates skipped. Tokens used: ${data.input_tokens} in / ${data.output_tokens} out`
        )
        setResult(data)
      }
    } catch {
      setStatus('error')
      setStatusMsg('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#0D1B2A' }} />
  }

  const displayedTransactions = result?.transactions.slice(0, 50) ?? []

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', fontFamily: 'Inter, sans-serif', color: '#F0F4F8' }}>

      {/* Top bar */}
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
          <span style={{ fontSize: '14px', color: '#8BA7C7' }}>{session?.user.email}</span>
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

      {/* Main content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>

        {/* SECTION A — Upload form */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0' }}>
            Upload Bank Statement
          </h2>
          <p style={{ fontSize: '13px', color: '#8BA7C7', margin: '0 0 28px 0' }}>
            HDFC CSV format · Phase 1
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* File input */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#8BA7C7', marginBottom: '8px' }}>
                Bank Statement (CSV)
              </label>
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <label
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Choose file
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <span style={{ fontSize: '13px', color: file ? '#F0F4F8' : '#8BA7C7' }}>
                  {file ? file.name : 'No file selected'}
                </span>
              </div>
            </div>

            {/* Account last 4 digits */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#8BA7C7', marginBottom: '8px' }}>
                Account (last 4 digits)
              </label>
              <input
                type="text"
                placeholder="e.g. 4821"
                maxLength={4}
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#F0F4F8',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            {/* Closing balance */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#8BA7C7', marginBottom: '8px' }}>
                Statement Closing Balance (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 1250000"
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#F0F4F8',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading || !file}
              style={{
                width: '100%',
                padding: '14px',
                background: uploading || !file ? 'rgba(196,98,45,0.4)' : '#C4622D',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                cursor: uploading || !file ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? 'Parsing...' : 'Parse Statement'}
            </button>

            {/* Status message */}
            {status !== 'idle' && (
              <p
                style={{
                  fontSize: '14px',
                  color: status === 'error' ? '#F87171' : status === 'success' ? '#6EE7B7' : '#8BA7C7',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                {statusMsg}
              </p>
            )}
          </form>
        </div>

        {/* SECTION B — Results table */}
        {result && result.transactions.length > 0 && (
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '16px',
              padding: '32px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 24px 0' }}>
              Parsed Transactions ({result.total_parsed} total)
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                    {['Date', 'Narration', 'UTR / Ref', 'Amount', 'Status'].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: '10px 14px',
                          textAlign: 'left',
                          color: '#8BA7C7',
                          fontWeight: 600,
                          fontSize: '12px',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedTransactions.map((txn, i) => (
                    <tr
                      key={i}
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', color: '#D1E0EF' }}>
                        {formatDate(txn.txn_date)}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#D1E0EF', maxWidth: '300px' }}>
                        {truncate(txn.raw_narration, 45)}
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        {txn.utr_ref ? (
                          <span style={{ color: '#D1E0EF', fontFamily: 'monospace', fontSize: '13px' }}>
                            {txn.utr_ref}
                          </span>
                        ) : (
                          <span style={{ color: '#4A6583' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        <span style={{ color: txn.amount >= 0 ? '#6EE7B7' : '#F87171' }}>
                          {txn.amount < 0 ? '−' : ''}{formatIndianAmount(txn.amount)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            background: 'rgba(251,146,60,0.15)',
                            border: '1px solid rgba(251,146,60,0.3)',
                            borderRadius: '20px',
                            color: '#FB923C',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        >
                          UNMATCHED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.total_parsed > 50 && (
              <p style={{ fontSize: '13px', color: '#8BA7C7', margin: '16px 0 0 0' }}>
                Showing 50 of {result.total_parsed} transactions.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
