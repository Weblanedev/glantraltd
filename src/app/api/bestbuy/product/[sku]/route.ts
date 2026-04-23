import { NextResponse, type NextRequest } from 'next/server'

import { getDummyJsonProductById, StoreApiError } from '@/lib/dummyjson'

type Params = { params: Promise<{ sku: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { sku } = await params
  if (!sku) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  try {
    const p = await getDummyJsonProductById(sku)
    if (!p) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(p)
  } catch (e) {
    if (e instanceof StoreApiError) {
      return NextResponse.json(
        { error: e.message },
        { status: e.status >= 500 ? 502 : 400 }
      )
    }
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}
