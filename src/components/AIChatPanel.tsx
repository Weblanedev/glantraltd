'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { useAuth } from '@/context/AuthContext'
import { useChatWidget } from '@/context/ChatWidgetContext'
import { siteName } from '@/lib/site'
import ReactMarkdown from 'react-markdown'

type Msg = { role: 'user' | 'assistant'; content: string }

export function AIChatPanel() {
  const { user } = useAuth()
  const { open, setOpen } = useChatWidget()
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      role: 'assistant',
      content: `Hi! I am the ${siteName()} assistant. Ask me about our laptops, tablets, categories, or how to find something in the store. I use our current catalog sample for context; for the latest price and availability, check the product page.`,
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) scrollToEnd()
  }, [open, messages, scrollToEnd])

  useEffect(() => {
    if (!user && open) {
      setOpen(false)
    }
  }, [user, open, setOpen])

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setErr(null)
    const next: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setSending(true)
    try {
      const r = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: next }),
      })
      const j = (await r.json()) as { reply?: string; error?: string }
      if (!r.ok) {
        setErr(j.error || 'Could not get a reply.')
        return
      }
      if (j.reply) {
        setMessages((m) => [...m, { role: 'assistant', content: j.reply! }])
      }
    } catch {
      setErr('Network error. Try again.')
    } finally {
      setSending(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-[5.5rem] right-4 z-[70] flex w-[min(100%,calc(100vw-2rem))] max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-24 sm:right-6"
          role="dialog"
          aria-label="Product assistant chat"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Product assistant</p>
              <p className="text-xs text-emerald-100">General questions about our catalog</p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/contact"
                className="rounded-lg px-2 py-1 text-xs text-white/90 transition hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white transition hover:bg-white/20"
                aria-label="Close chat"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
          </div>
          <div className="max-h-[min(60vh,420px)] min-h-[200px] space-y-3 overflow-y-auto p-4 text-sm text-slate-800">
            {err && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                {err}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={
                  m.role === 'user'
                    ? 'ml-6 rounded-xl bg-slate-100 px-3 py-2 text-slate-900'
                    : 'mr-4 rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2 text-slate-800'
                }
              >
                {m.role === 'assistant' ? (
                  <div className="text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-4">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                )}
              </div>
            ))}
            {sending && (
              <p className="text-xs text-slate-500" role="status">
                Thinking…
              </p>
            )}
            <div ref={endRef} />
          </div>
          <form
            className="border-t border-slate-200 p-3"
            onSubmit={(e) => {
              e.preventDefault()
              void send()
            }}
          >
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Ask about products…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                maxLength={2000}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
