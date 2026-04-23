import Link from 'next/link'

import { AnimatedSection } from '@/components/AnimatedSection'
import { HeroCarousel, type HeroSlide } from '@/components/home/HeroCarousel'
import { Newsletter } from '@/components/Newsletter'
import { ProductCard } from '@/components/ProductCard'
import { getCategoryBySlug } from '@/lib/categories'
import { fetchDummyJsonProducts, pickImage, StoreApiError } from '@/lib/dummyjson'
import { getUnitPrice } from '@/lib/pricing'
import type { StoreProduct } from '@/lib/store-types'
import { siteName } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const n = siteName()
  let featured: StoreProduct[] = []
  let tabletSpot: StoreProduct | null = null
  let err: string | null = null
  try {
    const c = getCategoryBySlug('laptops-computers')
    if (c) {
      const d = await fetchDummyJsonProducts(1, 8, {
        categorySlug: c.slug,
      })
      featured = d.products
    }
    const t = await fetchDummyJsonProducts(1, 1, {
      categorySlug: 'accessories',
    })
    tabletSpot = t.products[0] ?? null
  } catch (e) {
    if (e instanceof StoreApiError) {
      err = e.message
    } else {
      err = 'Could not load products'
    }
  }

  const heroProduct = featured[0]
  const slides: HeroSlide[] = [
    {
      id: 'promo-1',
      kind: 'promo',
      title: 'Electronics for work and every day',
      description: `Browse laptops and tablets on ${n}. Use search and categories to find the right device, then check out in a few steps.`,
      cta: { href: '/products', label: 'Start shopping' },
      accent: 'cyan',
    },
    {
      id: 'cat-lap',
      kind: 'category',
      title: 'Laptops & computers',
      description:
        'Notebooks, ultrabooks, and portables for productivity and creative work.',
      href: '/products?category=laptops-computers',
      tag: 'Category',
    },
    {
      id: 'cat-tablet',
      kind: 'category',
      title: 'Tablets & accessories',
      description: 'Tablets, cases, and add-ons. Compare specs and pricing side by side.',
      href: '/products?category=accessories',
      tag: 'Category',
    },
  ]
  if (heroProduct) {
    const price = getUnitPrice(heroProduct.salePrice, heroProduct.regularPrice)
    slides.push({
      id: `p-${heroProduct.sku}`,
      kind: 'product',
      name: heroProduct.name,
      price,
      image: pickImage(heroProduct),
      href: `/products/${heroProduct.sku}`,
    })
  }
  if (tabletSpot && tabletSpot.sku !== heroProduct?.sku) {
    const price = getUnitPrice(tabletSpot.salePrice, tabletSpot.regularPrice)
    slides.push({
      id: `p-${tabletSpot.sku}-tab`,
      kind: 'product',
      name: tabletSpot.name,
      price,
      image: pickImage(tabletSpot),
      href: `/products/${tabletSpot.sku}`,
    })
  }

  return (
    <div className="flex flex-col gap-20 pb-8 sm:gap-24 sm:pb-12 lg:gap-28">
      <section className="min-h-[120px]">
        <HeroCarousel slides={slides} />
      </section>

      <section className="min-h-[200px] rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 to-cyan-50/40 p-8 shadow-sm sm:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
              Get set up this week
            </h2>
            <p className="mt-3 max-w-prose text-slate-600">
              We focus on a tight electronics catalog: laptops and tablets. Clear
              product pages, a persistent cart, and shipping added at checkout keep
              totals transparent.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-cyan-600" aria-hidden>
                  ✓
                </span>
                <span>Filter by category or search the whole tech catalog in one place.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-600" aria-hidden>
                  ✓
                </span>
                <span>Review ratings and list prices on every product card before you buy.</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products?category=accessories"
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400"
              >
                Shop tablets & accessories
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-cyan-300"
              >
                Get support
              </Link>
            </div>
          </div>
          <div className="grid gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-5 shadow-inner sm:gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Popular paths
            </p>
            <Link
              href="/products?category=laptops-computers"
              className="block rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 transition hover:border-cyan-200 hover:bg-cyan-50/50"
            >
              <span className="font-medium text-cyan-700">Laptops</span>
              <span className="ml-2 text-slate-500">· work &amp; play</span>
            </Link>
            <Link
              href="/products?category=accessories"
              className="block rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 transition hover:border-cyan-200 hover:bg-cyan-50/50"
            >
              <span className="font-medium text-cyan-700">Tablets</span>
              <span className="ml-2 text-slate-500">· cases &amp; more</span>
            </Link>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section className="min-h-[200px]">
          <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Shop by category
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Two curated categories, each with the same search and product detail
            experience.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              {
                href: '/products?category=laptops-computers',
                t: 'Laptops & computers',
                d: 'Notebooks, ultrabooks, and portable power',
              },
              {
                href: '/products?category=accessories',
                t: 'Tablets & accessories',
                d: 'Tablets, cases, and add-ons',
              },
            ].map((x) => (
              <Link
                key={x.href}
                href={x.href}
                className="group min-h-[140px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
              >
                <h3 className="font-display font-semibold text-cyan-700 group-hover:text-cyan-600">
                  {x.t}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{x.d}</p>
              </Link>
            ))}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <section className="min-h-[200px]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
                Featured picks
              </h2>
              <p className="mt-1 text-slate-600">
                Fresh laptops from this week&rsquo;s store sync. Add to cart in one tap.
              </p>
            </div>
            <Link
              href="/products"
              className="shrink-0 text-sm font-medium text-cyan-600 transition hover:underline"
            >
              View all products
            </Link>
          </div>
          {err && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
              {err}
            </p>
          )}
          <div className="mt-8 grid min-h-[120px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
          {!err && featured.length === 0 && (
            <p className="mt-4 text-slate-500">No featured products returned.</p>
          )}
        </section>
      </AnimatedSection>

      <section className="min-h-[120px] rounded-2xl border border-dashed border-slate-300/90 bg-slate-50/80 px-6 py-8 text-center sm:px-10 sm:py-10">
        <h2 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">
          Free shipping on qualifying orders
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Standard shipping is shown in your cart. Continue to checkout to review your
          full order total.
        </p>
      </section>

      <Newsletter />
    </div>
  )
}
