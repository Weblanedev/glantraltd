'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

import { PageHeader } from '@/components/PageHeader'
import {
  GLANTRA_ADDRESS,
  GLANTRA_EMAIL_PAYMENTS,
  GLANTRA_PHONE,
} from '@/lib/contact-info'

function IconPin({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21c3.5-3.2 6-6.4 6-9.5a6 6 0 1 0-12 0c0 3.1 2.5 6.3 6 9.5Z"
        className="fill-brand-100 stroke-brand-600"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" className="fill-brand-600" />
    </svg>
  )
}

function IconPhone({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4h3l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2L20 15v3a2 2 0 0 1-2.2 2C9.6 19 5 9.4 5 6a2 2 0 0 1 0-2Z"
        className="fill-brand-100 stroke-brand-600"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconChat({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        className="fill-brand-100 stroke-brand-600"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIllustration() {
  return (
    <div
      className="relative flex items-end justify-center gap-3 py-4"
      aria-hidden
    >
      <div className="rounded-2xl border-2 border-brand-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-2xl text-brand-500">?</span>
      </div>
      <div className="translate-y-2 rounded-2xl border-2 border-brand-300 bg-brand-50 px-4 py-3 shadow-sm">
        <span className="text-2xl text-brand-600">✓</span>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  return (
    <div>
      <PageHeader
        title="Contact us"
        description="We’re here for orders, product questions, and partnership conversations. Reach us by address, phone, or email, or send a message and we’ll follow up."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {[
          {
            icon: <IconPin />,
            title: 'Our address',
            body: GLANTRA_ADDRESS,
          },
          {
            icon: <IconPhone />,
            title: 'Contact info',
            body: (
              <>
                Open a chat or give us a call at{' '}
                <a
                  className="font-medium text-brand-700 hover:underline"
                  href={`tel:${GLANTRA_PHONE}`}
                >
                  {GLANTRA_PHONE}
                </a>
              </>
            ),
          },
          {
            icon: <IconChat />,
            title: '24/7 support',
            body: (
              <>
                Send us a message:{' '}
                <a
                  className="font-medium break-all text-brand-700 hover:underline"
                  href={`mailto:${GLANTRA_EMAIL_PAYMENTS}`}
                >
                  {GLANTRA_EMAIL_PAYMENTS}
                </a>
              </>
            ),
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex flex-col items-center rounded-2xl border border-slate-200/90 bg-white px-4 py-8 text-center shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              {card.icon}
            </div>
            <h2 className="mt-4 font-display text-sm font-semibold text-brand-800 sm:text-base">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100/80 shadow-sm">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center border-b border-slate-200/80 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <h2 className="font-display text-2xl font-bold leading-tight text-brand-800 sm:text-3xl">
              Have inquiries?
              <br />
              <span className="text-brand-600">Reach out via message</span>
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Tell us who you are and what you need. We&rsquo;ll get back to you as
              soon as we can.
            </p>
            <ChatIllustration />
          </div>
          <div className="bg-white p-6 sm:p-8 lg:p-10">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSending(true)
                setTimeout(() => {
                  setSending(false)
                  toast.success('Message received. We’ll get back to you soon.')
                  ;(e.target as HTMLFormElement).reset()
                }, 500)
              }}
            >
              <div>
                <label
                  className="text-xs font-medium text-slate-600"
                  htmlFor="name"
                >
                  Name <span className="text-amber-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Your name*"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label
                  className="text-xs font-medium text-slate-600"
                  htmlFor="email"
                >
                  Email <span className="text-amber-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address*"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label
                  className="text-xs font-medium text-slate-600"
                  htmlFor="message"
                >
                  Your message <span className="text-amber-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
