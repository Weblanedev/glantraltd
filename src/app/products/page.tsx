import { PageHeader } from '@/components/PageHeader'
import { ProductsClient } from '@/components/ProductsClient'
import type { ProductCategorySlug } from '@/lib/categories'

export const metadata = { title: 'Products' }

const SLUGS: ProductCategorySlug[] = ['laptops-computers', 'accessories']

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const raw = typeof sp.category === 'string' ? sp.category : null
  const q = typeof sp.q === 'string' ? sp.q : ''
  const category =
    raw && (SLUGS as string[]).includes(raw)
      ? (raw as ProductCategorySlug)
      : null
  return (
    <div>
      <PageHeader
        title="Products"
        description="Browse electronics by category, search the catalog, and open any item for full details and images."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products' },
        ]}
      />
      <ProductsClient initialCategory={category} initialQ={q} />
    </div>
  )
}
