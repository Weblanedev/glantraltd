'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  return (
    <section className="min-h-[120px] rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-sm md:p-8">
      <h2 className="font-display text-xl font-semibold text-white">
        Weekly deals in your inbox
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Enter your email for launch announcements and product highlights (in-app only).
      </p>
      <form
        className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          if (!email.trim()) return
          toast.success('Thanks! You’re on the list.')
          setEmail('')
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-lg border border-slate-600/80 bg-white/10 px-3 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
        >
          Join
        </button>
      </form>
    </section>
  )
}
