'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { formatUsd } from '@/lib/pricing'

const SHIP = 9.99

export function CartView() {
  const { user } = useAuth()
  const { lines, setQty, remove, subtotal } = useCart()
  const total = subtotal + (lines.length > 0 ? SHIP : 0)

  if (lines.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
        <p>Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-cyan-600 transition hover:underline"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {lines.map((line) => (
          <div
            key={line.sku}
            className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
              {line.imageUrl ? (
                <Image
                  src={line.imageUrl}
                  alt={line.name}
                  fill
                  className="object-contain p-1"
                  sizes="96px"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${line.sku}`}
                className="line-clamp-2 font-medium text-slate-800 transition hover:text-cyan-600"
              >
                {line.name}
              </Link>
              <p className="mt-1 font-mono text-sm text-slate-700">
                {formatUsd(line.unitPrice)} each
              </p>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-slate-500" htmlFor={`q-${line.sku}`}>
                  Qty
                </label>
                <input
                  id={`q-${line.sku}`}
                  type="number"
                  min={1}
                  value={line.qty}
                  onChange={(e) => setQty(line.sku, Number(e.target.value) || 1)}
                  className="w-16 rounded border border-slate-200 bg-white px-2 py-1 text-base"
                />
                <button
                  type="button"
                  onClick={() => remove(line.sku)}
                  className="text-sm text-amber-700/90 transition hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 font-mono text-slate-800">
              {formatUsd(line.unitPrice * line.qty)}
            </p>
          </div>
        ))}
      </div>
      <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-medium text-slate-900">Summary</h2>
        <div className="mt-3 space-y-1 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-slate-800">{formatUsd(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-mono text-slate-800">{formatUsd(SHIP)}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 font-medium text-slate-900">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-mono">{formatUsd(total)}</span>
            </div>
          </div>
        </div>
        <Link
          href={user ? '/checkout' : '/login?next=/checkout'}
          className="mt-4 block w-full rounded-xl bg-amber-500 py-3 text-center font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
        >
          {user ? 'Checkout' : 'Log in to checkout'}
        </Link>
        <p className="mt-2 text-center text-xs text-slate-500">
          {user ? 'Taxes may apply at checkout.' : 'You need an account to complete checkout.'}
        </p>
      </div>
    </div>
  )
}
