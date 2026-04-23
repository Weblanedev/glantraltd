import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AddToCartButton } from '@/components/AddToCartButton'
import { PageHeader } from '@/components/PageHeader'
import { ProductCard } from '@/components/ProductCard'
import {
  fetchDummyJsonProducts,
  getDummyJsonProductById,
  pickImage,
} from '@/lib/dummyjson'
import type { StoreProduct } from '@/lib/store-types'
import { formatUsd } from '@/lib/pricing'
import { siteName } from '@/lib/site'
import { stripHtml } from '@/lib/safe-html'
import type { Metadata } from 'next'

type PageProps = { params: Promise<{ sku: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sku } = await params
  try {
    const p = await getDummyJsonProductById(sku)
    if (!p) return { title: 'Not found' }
    return {
      title: p.name,
      description: stripHtml(p.longDescription || p.description).slice(0, 160),
    }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { sku } = await params
  const product = await getDummyJsonProductById(sku)
  if (!product) notFound()

  const main = pickImage(product)
  const catId = product.categoryPath?.[0]?.id
  let related: StoreProduct[] = []
  if (catId) {
    try {
      const res = await fetchDummyJsonProducts(1, 12, {
        directDummyJsonCategory: String(catId),
      })
      related = res.products.filter((p) => String(p.sku) !== String(sku))
    } catch {
      // ignore
    }
  }

  const desc = stripHtml(product.longDescription || product.description)
  const sub = [
    product.manufacturer,
    product.customerReviewCount != null
      ? `${product.customerReviewCount} reviews`
      : null,
    `SKU ${product.sku}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div>
      <PageHeader
        title={product.name}
        description={sub}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Product' },
        ]}
      />
      <div className="mt-2 grid min-h-[280px] gap-8 lg:grid-cols-2">
        <div className="relative flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {main ? (
            <Image
              src={main}
              alt={product.name}
              width={640}
              height={480}
              className="max-h-[480px] w-auto object-contain"
            />
          ) : (
            <span className="text-slate-500">No image</span>
          )}
        </div>
        <div>
          <p className="text-sm text-slate-500">{product.manufacturer}</p>
          <p className="mt-2 text-sm text-amber-600">
            ★ {product.customerReviewAverage?.toFixed(1) ?? 'n/a'} (
            {product.customerReviewCount ?? 0} reviews)
          </p>
          {product.salePrice != null &&
            product.regularPrice != null &&
            product.salePrice < product.regularPrice && (
              <p className="mt-1 text-sm text-slate-500 line-through">
                List {formatUsd(product.regularPrice)}
              </p>
            )}
          <div className="mt-4">
            <AddToCartButton product={product} />
          </div>
          {desc && (
            <div className="mt-8 max-w-none text-sm leading-relaxed text-slate-600">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Overview
              </h2>
              <p className="mt-2 whitespace-pre-line">{desc}</p>
            </div>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16 min-h-[120px]">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            More in this category
          </h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {related.slice(0, 6).map((p) => (
              <div key={p.sku} className="w-[220px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
      <p className="mt-12 text-center text-xs text-slate-500">
        {siteName()}. Shipping and taxes are shown at checkout when available.
      </p>
    </div>
  )
}
