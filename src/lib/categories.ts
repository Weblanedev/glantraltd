export type ProductCategorySlug = 'laptops-computers' | 'accessories'

/**
 * UI sections mapped to DummyJSON `products/category/{slug}`.
 * @see https://dummyjson.com/docs/products#products-category
 */
export const PRODUCT_CATEGORIES: {
  slug: ProductCategorySlug
  label: string
  description: string
  /** DummyJSON category slug (electronics / devices) */
  dummyjsonCategorySlug: string
}[] = [
  {
    slug: 'laptops-computers',
    label: 'Laptops & computers',
    description: 'Portable and desktop-class machines, ultrabooks, and notebooks',
    dummyjsonCategorySlug: 'laptops',
  },
  {
    slug: 'accessories',
    label: 'Tablets & accessories',
    description: 'Tablets, cases, and add-ons',
    dummyjsonCategorySlug: 'tablets',
  },
]

export function getCategoryBySlug(
  slug: string | null | undefined
): (typeof PRODUCT_CATEGORIES)[0] | undefined {
  if (!slug) return undefined
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug)
}
