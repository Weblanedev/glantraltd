import { NextResponse, type NextRequest } from 'next/server'

import { getCategoryBySlug } from '@/lib/categories'
import { fetchDummyJsonProducts, StoreApiError, StoreConfigError } from '@/lib/dummyjson'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page') || 1) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 24) || 24))
  const q = (searchParams.get('q') || '').trim()
  const categorySlug = searchParams.get('category') || undefined

  try {
    if (categorySlug) {
      const c = getCategoryBySlug(categorySlug)
      if (!c) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    }
    const data = await fetchDummyJsonProducts(page, pageSize, {
      categorySlug: categorySlug || undefined,
      q: q || undefined,
    })
    return NextResponse.json(data)
  } catch (e) {
    if (e instanceof StoreConfigError) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    if (e instanceof StoreApiError) {
      return NextResponse.json(
        { error: e.message },
        { status: e.status >= 500 ? 502 : 400 }
      )
    }
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}
