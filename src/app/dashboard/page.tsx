'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useChatWidget } from '@/context/ChatWidgetContext'
import { GLANTRA_PHONE } from '@/lib/contact-info'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { setOpen } = useChatWidget()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login?next=/dashboard')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <p className="text-slate-600" role="status">
        Loading your account…
      </p>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <PageHeader
        title="Your account"
        description="You’re signed in. Manage your profile from checkout, or keep shopping the catalog."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Account' },
        ]}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm sm:col-span-2">
          <h2 className="font-display text-lg font-semibold text-slate-900">Chat with us</h2>
          <p className="mt-2 text-sm text-slate-600">
            For general questions about our catalog, use the <strong>product assistant</strong>{' '}
            (green chat button, bottom right). For orders, deliveries, or account issues, use
            the contact form or call us. We reply during business hours.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              Open product assistant
            </button>
            <a
              href={`tel:${GLANTRA_PHONE.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-cyan-300"
            >
              Call {GLANTRA_PHONE}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-cyan-300"
            >
              Contact form
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-slate-900">Profile</h2>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">Name</dt>
              <dd className="text-slate-800">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">Email</dt>
              <dd className="text-slate-800">{user.email}</dd>
            </div>
            {(user.profile?.address1 || user.profile?.city) && (
              <div>
                <dt className="text-xs font-medium uppercase text-slate-500">Shipping</dt>
                <dd className="text-slate-800">
                  {[user.profile?.address1, user.profile?.city, user.profile?.state, user.profile?.zip]
                    .filter(Boolean)
                    .join(', ')}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-6 shadow-sm">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">Shopping</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your cart and order totals stay the same on every page while you&rsquo;re
              signed in.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
            >
              Browse products
            </Link>
            <Link
              href="/checkout"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-800 transition hover:border-cyan-300"
            >
              Go to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
