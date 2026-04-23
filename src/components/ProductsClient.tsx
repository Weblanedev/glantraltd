'use client'

import { useCallback, useEffect, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { PRODUCT_CATEGORIES, type ProductCategorySlug } from '@/lib/categories'
import type { StoreProduct } from '@/lib/store-types'

type Props = { initialCategory: ProductCategorySlug | null; initialQ: string }

export function ProductsClient({ initialCategory, initialQ }: Props) {
  const [category, setCategory] = useState<ProductCategorySlug | null>(initialCategory)
  const [q, setQ] = useState(initialQ)
  const [debounced, setDebounced] = useState(initialQ)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [rows, setRows] = useState<StoreProduct[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 400)
    return () => clearTimeout(t)
  }, [q])

  const load = useCallback(async (p: number) => {
    setLoading(true)
    setErrMsg(null)
    const sp = new URLSearchParams()
    sp.set('page', String(p))
    sp.set('pageSize', '24')
    if (debounced) sp.set('q', debounced)
    if (category) sp.set('category', category)
    try {
      const r = await fetch(`/api/bestbuy/products?${sp.toString()}`)
      const j = (await r.json()) as
        | { products: StoreProduct[]; total: number; totalPages: number; error?: string }
        | { error: string }
      if (!r.ok) {
        setErrMsg('error' in j ? j.error ?? 'Failed to load' : 'Failed to load')
        setRows([])
        return
      }
      if ('error' in j && j.error) {
        setErrMsg(j.error)
        setRows([])
        return
      }
      setRows((j as { products: StoreProduct[] }).products || [])
      setTotal((j as { total: number }).total)
      setTotalPages((j as { totalPages: number }).totalPages)
    } catch {
      setErrMsg('Network error')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [debounced, category])

  useEffect(() => {
    setPage(1)
  }, [debounced, category])

  useEffect(() => {
    void load(page)
  }, [load, page])

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-sm text-slate-600 sm:max-w-md">
          Laptops and tablets. Filter by category or search the catalog.
        </p>
        <div className="w-full sm:max-w-xs">
          <label className="text-xs font-medium text-slate-500" htmlFor="q">
            Search
          </label>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. MacBook, iPad, Surface"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 shadow-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            category === null
              ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          All
        </button>
        {PRODUCT_CATEGORIES.map((c) => (
          <button
            type="button"
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              category === c.slug
                ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
            title={c.description}
          >
            {c.label}
          </button>
        ))}
      </div>
      {errMsg && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
          {errMsg}
        </p>
      )}
      {loading && (
        <p className="mt-8 text-slate-500" aria-live="polite">
          Loading…
        </p>
      )}
      {!loading && !errMsg && rows.length === 0 && (
        <p className="mt-8 text-slate-500">No products match. Try another search.</p>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages} ({total} items)
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
