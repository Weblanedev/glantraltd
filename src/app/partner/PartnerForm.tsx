'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

import { PageHeader } from '@/components/PageHeader'

export function PartnerForm() {
  const [done, setDone] = useState(false)
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="Partner with us"
        description="Brands and distributors: share what you sell and we’ll follow up. This step records your interest in-app for now."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partner' },
        ]}
      />
      {done ? (
        <p className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-cyan-900">
          Thanks. We&rsquo;ll be in touch.
        </p>
      ) : (
        <form
          className="mt-2 space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault()
            setDone(true)
            toast.success('Application sent. We’ll review and reply.')
          }}
        >
          <div>
            <label
              className="text-xs font-medium text-slate-600"
              htmlFor="company"
            >
              Company
            </label>
            <input
              id="company"
              name="company"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800"
            />
          </div>
          <div>
            <label
              className="text-xs font-medium text-slate-600"
              htmlFor="contact"
            >
              Contact email
            </label>
            <input
              id="contact"
              name="contact"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800"
            />
          </div>
          <div>
            <label
              className="text-xs font-medium text-slate-600"
              htmlFor="categories"
            >
              Categories
            </label>
            <textarea
              id="categories"
              name="categories"
              required
              rows={3}
              placeholder="Laptops, tablets, accessories…"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 py-3 font-medium text-slate-900 transition hover:bg-amber-400"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  )
}
