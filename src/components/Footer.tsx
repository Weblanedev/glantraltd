'use client'

import Link from 'next/link'

import { GlantraLogo } from '@/components/GlantraLogo'
import { useAuth } from '@/context/AuthContext'
import { siteDomain, siteLegalName, siteName, siteTagline } from '@/lib/site'

export function Footer() {
  const y = new Date().getFullYear()
  const name = siteName()
  const legal = siteLegalName()
  const domain = siteDomain()
  const { user } = useAuth()
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-200/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <GlantraLogo size="sm" showWordmark wordmarkClassName="!text-slate-900" />
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {siteTagline()} Browse, compare, and check out.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-800">Shop</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li>
              <Link
                className="transition hover:text-cyan-600 hover:underline"
                href="/products"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className="transition hover:text-cyan-600 hover:underline"
                href="/cart"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                className="transition hover:text-cyan-600 hover:underline"
                href="/dashboard"
              >
                Your account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-800">Company</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            {user && (
              <li>
                <Link
                  className="transition hover:text-cyan-600 hover:underline"
                  href="/partner"
                >
                  Partners
                </Link>
              </li>
            )}
            <li>
              <Link
                className="transition hover:text-cyan-600 hover:underline"
                href="/about"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="transition hover:text-cyan-600 hover:underline"
                href="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-800">Policies</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
            <li>
              <Link
                className="transition hover:text-cyan-600 hover:underline"
                href="/privacy"
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                className="transition hover:text-cyan-600 hover:underline"
                href="/returns"
              >
                Return policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        © {y} {legal}. <span className="text-slate-400">{name}</span> ·{' '}
        <span className="text-slate-400">{domain}</span>
      </div>
    </footer>
  )
}
