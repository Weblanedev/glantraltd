'use client'

import { useCart } from '@/context/CartContext'
import type { StoreProduct } from '@/lib/store-types'
import { getUnitPrice, formatUsd } from '@/lib/pricing'

export function AddToCartButton({ product }: { product: StoreProduct }) {
  const { addFromProduct } = useCart()
  const price = getUnitPrice(product.salePrice, product.regularPrice)
  if (price <= 0) {
    return (
      <p className="text-sm text-amber-700">This item is not available to order.</p>
    )
  }
  return (
    <div>
      <p className="font-mono text-2xl text-slate-900">{formatUsd(price)}</p>
      <button
        type="button"
        onClick={() => addFromProduct(product, 1)}
        className="mt-4 w-full rounded-xl bg-amber-500 py-3 text-center font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
      >
        Add to cart
      </button>
    </div>
  )
}
