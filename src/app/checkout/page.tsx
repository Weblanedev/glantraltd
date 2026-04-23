'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

import { PageHeader } from '@/components/PageHeader'
import { PaymentModal } from '@/components/PaymentModal'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import type { PublicUser } from '@/types/user'
import { formatUsd } from '@/lib/pricing'

const SHIP = 9.99

const checkoutSchema = yup.object({
  fullName: yup.string().required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  phone: yup.string().required('Required'),
  address1: yup.string().required('Required'),
  city: yup.string().required('Required'),
  state: yup.string().required('Required'),
  zip: yup.string().required('Required'),
})

type Form = yup.InferType<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading, setUser, refresh } = useAuth()
  const { lines, subtotal } = useCart()
  const total = subtotal + (lines.length > 0 ? SHIP : 0)
  const [modal, setModal] = useState(false)

  const resolver = useMemo(() => yupResolver(checkoutSchema), [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
    },
  })

  const applyUser = useCallback(
    (u: PublicUser) => {
      reset({
        fullName: u.name,
        email: u.email,
        phone: u.profile?.phone ?? '',
        address1: u.profile?.address1 ?? '',
        city: u.profile?.city ?? '',
        state: u.profile?.state ?? '',
        zip: u.profile?.zip ?? '',
      })
    },
    [reset]
  )

  useEffect(() => {
    if (user) applyUser(user)
  }, [user, applyUser])

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/checkout')
    }
  }, [authLoading, user, router])

  if (authLoading) {
    return (
      <p className="text-slate-600" role="status">
        Loading…
      </p>
    )
  }

  if (!user) {
    return null
  }

  if (lines.length === 0) {
    return (
      <div>
        <PageHeader
          title="Checkout"
          description="Your cart is empty. Add a few products before you continue."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />
        <p className="text-slate-600">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="text-cyan-600 underline transition hover:text-cyan-500"
          >
            Continue shopping
          </button>
        </p>
      </div>
    )
  }

  async function onSubmit(data: Form) {
    if (!user) return
    try {
      const r = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.fullName,
          profile: {
            phone: data.phone,
            address1: data.address1,
            city: data.city,
            state: data.state,
            zip: data.zip,
          },
        }),
      })
      const j = (await r.json()) as { user?: PublicUser; error?: string }
      if (!r.ok) {
        toast.error(j.error || 'Could not update profile')
        return
      }
      if (j.user) {
        setUser(j.user)
        await refresh()
      }
      toast.success('Shipping details saved to your account')
      setModal(true)
    } catch {
      toast.error('Something went wrong. Try again.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Checkout"
        description="You’re signed in. Enter or confirm shipping and contact details, then continue to payment."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        Signed in as <strong className="text-slate-800">{user.email}</strong>. We filled
        the form with your saved details when we have them.
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          {(['fullName', 'email', 'phone'] as const).map((f) => (
            <div key={f}>
              <label
                className="text-xs font-medium text-slate-600"
                htmlFor={f}
              >
                {f === 'fullName' ? 'Full name' : f}
              </label>
              <input
                id={f}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 shadow-sm read-only:bg-slate-50"
                readOnly={f === 'email'}
                autoComplete={f === 'email' ? 'email' : f === 'fullName' ? 'name' : 'tel'}
                {...register(f)}
              />
              {errors[f] && (
                <p className="text-xs text-amber-700">{errors[f]?.message}</p>
              )}
            </div>
          ))}
          {(['address1', 'city', 'state', 'zip'] as const).map((f) => (
            <div key={f}>
              <label
                className="text-xs font-medium text-slate-600"
                htmlFor={f}
              >
                {f === 'address1' ? 'Address' : f}
              </label>
              <input
                id={f}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 shadow-sm"
                autoComplete={
                  f === 'address1' ? 'street-address' : f === 'zip' ? 'postal-code' : 'address-line2'
                }
                {...register(f)}
              />
              {errors[f] && (
                <p className="text-xs text-amber-700">{errors[f]?.message}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 py-3 font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
          >
            Continue to payment
          </button>
        </form>
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-slate-900">Order summary</h2>
          <ul className="mt-4 space-y-2">
            {lines.map((l) => (
              <li key={l.sku} className="flex justify-between gap-2">
                <span className="line-clamp-1 pr-2">
                  {l.name} × {l.qty}
                </span>
                <span className="shrink-0 font-mono text-slate-800">
                  {formatUsd(l.unitPrice * l.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-slate-200 pt-3 font-medium text-slate-900">
            Total {formatUsd(total)}
          </div>
        </div>
      </div>
      <PaymentModal
        open={modal}
        totalUsd={total}
        onClose={() => setModal(false)}
      />
    </div>
  )
}
