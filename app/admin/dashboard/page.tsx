'use client'

import React, { useEffect, useState } from 'react'
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

type ReconStats = {
  total: number
  auto_matched: number
  needs_review: number
  unmatched: number
}

type ReconTransaction = {
  txn_id: string
  txn_date: string
  amount: number
  utr_ref: string
  raw_narration: string
  recon_status: string
}

type ReconRunResult = {
  total_transactions: number
  auto_matched: number
  manual_matched: number
  flagged: number
  unmatched: number
  run_at: string
  message?: string
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

function statusBadgeStyle(status: string): React.CSSProperties {
  const map: Record<string, { bg: string; border: string; color: string }> = {
    AUTO_MATCHED:   { bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.25)', color: '#6EE7B7' },
    MANUAL_MATCHED: { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  color: '#FBBF24' },
    FLAGGED:        { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)',  color: '#FBBF24' },
    UNMATCHED:      { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', color: '#F87171' },
  }
  const c = map[status] ?? map.UNMATCHED
  return {
    padding: '3px 10px',
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: '20px',
    color: c.color,
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  }
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

  const [bankAccountId, setBankAccountId] = useState<string | null>(null)
  const [reconStats, setReconStats] = useState<ReconStats | null>(null)
  const [recentTxns, setRecentTxns] = useState<ReconTransaction[]>([])
  const [reconRunning, setReconRunning] = useState(false)
  const [reconRunResult, setReconRunResult] = useState<ReconRunResult | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

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

  useEffect(() => {
    if (!session) return

    async function initRecon() {
      const { data: account } = await supabase
        .from('bank_accounts_master')
        .select('account_id')
        .limit(1)
        .maybeSingle()

      if (!account?.account_id) return

      setBankAccountId(account.account_id)
      await fetchReconData(account.account_id)
    }

    initRecon()
  }, [session]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchReconData(accountId: string) {
    setStatsLoading(true)

    const { data: allTxns } = await supabase
      .from('bank_transactions_hub')
      .select('recon_status')
      .eq('bank_account_id', accountId)

    if (allTxns) {
      const total = allTxns.length
      const auto_matched = allTxns.filter(t => t.recon_status === 'AUTO_MATCHED').length
      const needs_review = allTxns.filter(
        t => t.recon_status === 'MANUAL_MATCHED' || t.recon_status === 'FLAGGED'
      ).length
      const unmatched = allTxns.filter(t => t.recon_status === 'UNMATCHED').length
      setReconStats({ total, auto_matched, needs_review, unmatched })
    }

    const { data: recent } = await supabase
      .from('bank_transactions_hub')
      .select('txn_id, txn_date, amount, utr_ref, raw_narration, recon_status')
      .eq('bank_account_id', accountId)
      .order('txn_date', { ascending: false })
      .limit(20)

    if (recent) setRecentTxns(recent)
    setStatsLoading(false)
  }

  async function handleRunReconciliation() {
    if (!bankAccountId) return
    setReconRunning(true)
    setReconRunResult(null)

    try {
      const res = await fetch('/api/recon/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_account_id: bankAccountId }),
      })
      const data: ReconRunResult = await res.json()
      setReconRunResult(data)
      await fetchReconData(bankAccountId)
    } catch {
      // non-blocking — stats will refresh on next reload
    } finally {
      setReconRunning(false)
    }
  }

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
        if (bankAccountId) await fetchReconData(bankAccountId)
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

        {/* SECTION A — Reconciliation status panel */}
        {bankAccountId && (
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
              Reconciliation Status
            </h2>
            <p style={{ fontSize: '13px', color: '#8BA7C7', margin: '0 0 24px 0' }}>
              HDFC · Live account
            </p>

            {/* Row 1 — Stat cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              {/* Total */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontSize: '11px', color: '#8BA7C7', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Total
                </p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#F0F4F8', margin: 0, lineHeight: 1 }}>
                  {statsLoading ? '—' : (reconStats?.total ?? 0)}
                </p>
              </div>

              {/* Auto Matched */}
              <div
                style={{
                  background: 'rgba(110,231,183,0.04)',
                  border: '1px solid rgba(110,231,183,0.18)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontSize: '11px', color: '#8BA7C7', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Auto Matched
                </p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#6EE7B7', margin: 0, lineHeight: 1 }}>
                  {statsLoading ? '—' : (reconStats?.auto_matched ?? 0)}
                </p>
              </div>

              {/* Needs Review */}
              <div
                style={{
                  background: 'rgba(251,191,36,0.04)',
                  border: '1px solid rgba(251,191,36,0.18)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontSize: '11px', color: '#8BA7C7', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Needs Review
                </p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#FBBF24', margin: 0, lineHeight: 1 }}>
                  {statsLoading ? '—' : (reconStats?.needs_review ?? 0)}
                </p>
              </div>

              {/* Unmatched */}
              <div
                style={{
                  background: 'rgba(248,113,113,0.04)',
                  border: '1px solid rgba(248,113,113,0.18)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <p style={{ fontSize: '11px', color: '#8BA7C7', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Unmatched
                </p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#F87171', margin: 0, lineHeight: 1 }}>
                  {statsLoading ? '—' : (reconStats?.unmatched ?? 0)}
                </p>
              </div>
            </div>

            {/* Row 2 — Run reconciliation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: recentTxns.length > 0 ? '28px' : '0',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleRunReconciliation}
                disabled={reconRunning}
                style={{
                  padding: '12px 24px',
                  background: reconRunning ? 'rgba(196,98,45,0.4)' : '#C4622D',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: reconRunning ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {reconRunning ? 'Matching transactions…' : 'Run Reconciliation'}
              </button>

              {reconRunResult && !reconRunning && (
                <span style={{ fontSize: '14px', color: '#8BA7C7' }}>
                  {reconRunResult.message
                    ? reconRunResult.message
                    : `Auto matched ${reconRunResult.auto_matched} · ${reconRunResult.manual_matched + reconRunResult.flagged} need review · ${reconRunResult.unmatched} unmatched`}
                </span>
              )}
            </div>

            {/* Row 3 — Transaction list */}
            {recentTxns.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#8BA7C7',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: 600,
                  }}
                >
                  Last 20 Transactions
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {['Date', 'Amount', 'UTR', 'Narration', 'Status'].map(col => (
                          <th
                            key={col}
                            style={{
                              padding: '8px 12px',
                              textAlign: 'left',
                              color: '#8BA7C7',
                              fontWeight: 600,
                              fontSize: '11px',
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
                      {recentTxns.map((txn, i) => (
                        <tr
                          key={txn.txn_id}
                          style={{
                            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: '#D1E0EF' }}>
                            {formatDate(txn.txn_date)}
                          </td>
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                            <span style={{ color: txn.amount >= 0 ? '#6EE7B7' : '#F87171' }}>
                              {txn.amount < 0 ? '−' : ''}{formatIndianAmount(txn.amount)}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            {txn.utr_ref ? (
                              <span style={{ color: '#D1E0EF', fontFamily: 'monospace', fontSize: '12px' }}>
                                {txn.utr_ref}
                              </span>
                            ) : (
                              <span style={{ color: '#4A6583' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#D1E0EF', maxWidth: '260px' }}>
                            {truncate(txn.raw_narration, 40)}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={statusBadgeStyle(txn.recon_status)}>
                              {txn.recon_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!statsLoading && recentTxns.length === 0 && (
              <p style={{ fontSize: '14px', color: '#8BA7C7', margin: '4px 0 0 0' }}>
                No transactions yet. Upload a bank statement below to get started.
              </p>
            )}
          </div>
        )}

        {/* SECTION B — Upload form */}
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

        {/* SECTION C — Parse results table */}
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
