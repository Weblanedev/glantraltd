'use client'

import Link from 'next/link'

import { useCart } from '@/context/CartContext'

export function CartIcon() {
  const { itemCount } = useCart()
  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-300 hover:shadow"
      aria-label="Cart"
    >
      <span className="text-lg" aria-hidden>
        🛒
      </span>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-cyan-500 px-1 text-xs font-bold text-slate-900">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}
