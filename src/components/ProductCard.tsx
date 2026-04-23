'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useCart } from '@/context/CartContext'
import { pickImage } from '@/lib/dummyjson'
import type { StoreProduct } from '@/lib/store-types'
import { getUnitPrice, formatUsd } from '@/lib/pricing'

export function ProductCard({ product }: { product: StoreProduct }) {
  const { addFromProduct } = useCart()
  const img = pickImage(product)
  const price = getUnitPrice(product.salePrice, product.regularPrice)
  const regular = product.regularPrice
  const sale = product.salePrice
  const onSale =
    sale != null && regular != null && sale < regular
  const stars = product.customerReviewAverage ?? 0
  const reviews = product.customerReviewCount ?? 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
      <Link
        href={`/products/${product.sku}`}
        className="relative block aspect-[4/3] bg-slate-50"
      >
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-contain p-3 transition duration-200 group-hover:scale-[1.02]"
            sizes="(max-width:640px) 100vw, (max-width:1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
        {onSale && (
          <span className="absolute left-2 top-2 rounded bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-900">
            On sale
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-1 text-xs text-slate-500">
          {product.manufacturer || 'N/A'}
        </p>
        <Link
          href={`/products/${product.sku}`}
          className="line-clamp-2 font-display text-sm font-medium text-slate-800 transition hover:text-cyan-600"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
          <span>★ {stars.toFixed(1)}</span>
          <span className="text-slate-500">({reviews})</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            {onSale && regular != null && (
              <p className="text-xs text-slate-500 line-through">
                {formatUsd(regular)}
              </p>
            )}
            <p className="font-mono text-lg text-slate-900">
              {formatUsd(price)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => addFromProduct(product, 1)}
          className="mt-3 rounded-lg bg-amber-500 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
