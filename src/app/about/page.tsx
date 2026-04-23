import Link from 'next/link'

import { PageHeader } from '@/components/PageHeader'
import {
  GLANTRA_ADDRESS,
  GLANTRA_EMAIL_PAYMENTS,
  GLANTRA_LEGAL_NAME,
  GLANTRA_PHONE,
} from '@/lib/contact-info'
import { siteDomain, siteName, siteTagline } from '@/lib/site'

export const metadata = {
  title: 'About us',
  description:
    'Glantra Limited: general merchandise and sales of computers. Based in Ikorodu, Lagos, Nigeria.',
}

export default function AboutPage() {
  const n = siteName()
  return (
    <div>
      <PageHeader
        title="About Glantra"
        description="General merchandise and sales of computers, with a clear online store, cart, and support you can reach."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />

      <div className="mt-2 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="font-display text-xl font-semibold text-brand-800 sm:text-2xl">
              Who we are
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              <strong className="text-slate-800">{GLANTRA_LEGAL_NAME}</strong> (
              {siteTagline()}) trades under the name <strong className="text-slate-800">
                {n}
              </strong>
              . Our online store at <strong>{siteDomain()}</strong> is built for laptops,
              tablets, and related products. We source product data and imagery from
              trusted feeds so you can compare devices, read clear descriptions, and use a
              cart that follows you across the site.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We are based at <strong className="text-slate-800">Ikorodu, Lagos State</strong>
              . We&rsquo;re focused on making discovery simple: search and category filters,
              product detail pages with ratings, and a checkout you complete while signed
              in, with saved shipping details on your account.
            </p>
            <h2 className="mt-10 font-display text-xl font-semibold text-brand-800 sm:text-2xl">
              What you can expect
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600">
              <li>Electronics-first catalog: laptops, tablets, and related accessories</li>
              <li>One journey from browse to cart to checkout</li>
              <li>Support via phone, email, and our contact form</li>
              <li>Policies for privacy and returns, published on this site</li>
            </ul>
            <p className="mt-6">
              <Link
                href="/contact"
                className="inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Contact us
              </Link>
            </p>
          </section>
        </div>

        <aside className="h-fit space-y-4">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/80 p-6">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-brand-800">
              Visit &amp; call
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {GLANTRA_ADDRESS}
            </p>
            <a
              href={`tel:${GLANTRA_PHONE}`}
              className="mt-2 block text-sm font-medium text-brand-700 hover:underline"
            >
              {GLANTRA_PHONE}
            </a>
            <a
              href={`mailto:${GLANTRA_EMAIL_PAYMENTS}`}
              className="mt-1 block break-all text-sm text-brand-700 hover:underline"
            >
              {GLANTRA_EMAIL_PAYMENTS}
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-600">
            <h3 className="font-medium text-slate-800">Policies</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/privacy" className="text-brand-600 hover:underline">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-brand-600 hover:underline">
                  Return &amp; refund policy
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
