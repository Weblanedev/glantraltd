import type { StoreListResponse, StoreProduct } from '@/lib/store-types'

import { getCategoryBySlug, PRODUCT_CATEGORIES } from '@/lib/categories'

/** https://dummyjson.com/docs/products */
export const DUMMYJSON_BASE = 'https://dummyjson.com'

export class StoreConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StoreConfigError'
  }
}

export class StoreApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'StoreApiError'
    this.status = status
  }
}

interface DummyProductRaw {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

function cleanCopy(s: string): string {
  return s
    .replace(/\bdemo[\s-]*only\b/gi, '')
    .replace(/\bdemo\b/gi, '')
    .replace(/\bplaceholder\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*[-–:]\s*/g, '')
    .trim()
}

function mapDummy(p: DummyProductRaw): StoreProduct {
  const disc = p.discountPercentage > 0 ? p.discountPercentage : 0
  const list = p.price
  const unit =
    disc > 0 ? Math.round(list * (100 - disc)) / 100 : list
  const name = cleanCopy(p.title) || p.title
  const desc = cleanCopy(p.description) || p.description
  const main = p.images[0] ?? p.thumbnail
  return {
    sku: p.id,
    name,
    salePrice: unit,
    regularPrice: disc > 0 ? list : undefined,
    image: main,
    largeFront: main,
    description: desc,
    longDescription: desc,
    manufacturer: p.brand,
    categoryPath: [
      { id: p.category, name: titleCase(p.category) },
    ],
    customerReviewAverage: p.rating,
    customerReviewCount: 8 + (p.id % 120),
  }
}

function titleCase(slug: string) {
  return slug
    .split(/[-\s]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

async function getJson(
  u: string,
  revalidate: number
): Promise<unknown> {
  const res = await fetch(u, { next: { revalidate } })
  if (!res.ok) {
    const t = await res.text()
    throw new StoreApiError(
      res.status,
      res.status === 404 ? 'Not found' : t.slice(0, 200)
    )
  }
  return res.json() as Promise<unknown>
}

/**
 * @param directDummyJsonCategory - raw DummyJSON category (e.g. `laptops`) for related products
 */
export async function fetchDummyJsonProducts(
  page: number,
  pageSize: number,
  opts: { categorySlug?: string; q?: string; directDummyJsonCategory?: string }
): Promise<StoreListResponse> {
  const q = opts.q?.trim() ?? ''
  const safeSize = Math.min(100, Math.max(1, pageSize))
  const currentPage = Math.max(1, page)

  if (q) {
    const u = new URL(`${DUMMYJSON_BASE}/products/search`)
    u.searchParams.set('q', q)
    u.searchParams.set('limit', '100')
    const j = (await getJson(u.toString(), 30)) as {
      products: DummyProductRaw[]
      total: number
    }
    let list = j.products.map(mapDummy)
    if (opts.categorySlug) {
      const c = getCategoryBySlug(opts.categorySlug)
      if (c) {
        list = list.filter(
          (p) => p.categoryPath?.[0]?.id === c.dummyjsonCategorySlug
        )
      }
    } else if (opts.directDummyJsonCategory) {
      list = list.filter(
        (p) => p.categoryPath?.[0]?.id === opts.directDummyJsonCategory
      )
    } else {
      const allow = new Set(
        PRODUCT_CATEGORIES.map((c) => c.dummyjsonCategorySlug)
      )
      list = list.filter(
        (p) => p.categoryPath?.[0] && allow.has(p.categoryPath[0].id)
      )
    }
    const total = list.length
    const totalPages = Math.max(1, Math.ceil(total / safeSize) || 1)
    const start = (currentPage - 1) * safeSize
    const pageRows = list.slice(start, start + safeSize)
    return {
      from: total === 0 ? 0 : start + 1,
      to: start + pageRows.length,
      total,
      currentPage,
      totalPages,
      products: pageRows,
    }
  }

  if (opts.directDummyJsonCategory) {
    const skip = (currentPage - 1) * safeSize
    const u = new URL(
      `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(opts.directDummyJsonCategory)}`
    )
    u.searchParams.set('limit', String(safeSize))
    u.searchParams.set('skip', String(skip))
    const j = (await getJson(u.toString(), 60)) as {
      products: DummyProductRaw[]
      total: number
    }
    const products = j.products.map(mapDummy)
    const total = j.total
    const totalPages = Math.max(1, Math.ceil(total / safeSize) || 1)
    return {
      from: total === 0 ? 0 : skip + 1,
      to: skip + products.length,
      total,
      currentPage,
      totalPages,
      products,
    }
  }

  if (opts.categorySlug) {
    const c = getCategoryBySlug(opts.categorySlug)
    if (!c) throw new StoreConfigError('Invalid category')
    return fetchDummyJsonProducts(page, pageSize, {
      directDummyJsonCategory: c.dummyjsonCategorySlug,
    })
  }

  const responses = await Promise.all(
    PRODUCT_CATEGORIES.map((c) =>
      getJson(
        `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(c.dummyjsonCategorySlug)}?limit=100&skip=0`,
        60
      )
    )
  )
  const byId = new Map<number, StoreProduct>()
  for (const raw of responses) {
    const j = raw as { products: DummyProductRaw[] }
    for (const p of j.products) {
      byId.set(p.id, mapDummy(p))
    }
  }
  const merged = Array.from(byId.values()).sort((a, b) => a.sku - b.sku)
  const total = merged.length
  const totalPages = Math.max(1, Math.ceil(total / safeSize) || 1)
  const start = (currentPage - 1) * safeSize
  const pageRows = merged.slice(start, start + safeSize)
  return {
    from: total === 0 ? 0 : start + 1,
    to: start + pageRows.length,
    total,
    currentPage,
    totalPages,
    products: pageRows,
  }
}

export async function getDummyJsonProductById(
  id: string
): Promise<StoreProduct | null> {
  const u = `${DUMMYJSON_BASE}/products/${encodeURIComponent(id)}`
  const res = await fetch(u, { next: { revalidate: 300 } })
  if (res.status === 404) return null
  if (!res.ok) {
    const t = await res.text()
    throw new StoreApiError(res.status, t.slice(0, 200))
  }
  const p = (await res.json()) as DummyProductRaw
  return mapDummy(p)
}

export function pickImage(p: {
  largeFront?: string
  image?: string
}): string | undefined {
  return p.largeFront || p.image
}
