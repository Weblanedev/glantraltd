'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { siteName } from '@/lib/site'

import { CartIcon } from './CartIcon'
import { GlantraLogo } from './GlantraLogo'

function navLinks(signedIn: boolean) {
  return [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    ...(signedIn ? ([{ href: '/partner', label: 'Partner' }] as const) : []),
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ] as const
}

function cx(active: boolean) {
  return active
    ? 'text-cyan-600 font-medium'
    : 'text-slate-600 hover:text-slate-900'
}

export function Navbar() {
  const { user, setUser, refresh } = useAuth()
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const name = siteName()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    await refresh()
  }

  const links = navLinks(!!user)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="transition hover:opacity-90"
          aria-label={`${name} home`}
        >
          <GlantraLogo
            size="md"
            showWordmark
            wordmarkClassName="!text-slate-900"
          />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cx(path === l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <CartIcon />
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {user ? (
              <>
                <span
                  className="hidden h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 lg:block"
                  title="Signed in"
                  aria-hidden
                />
                <Link
                  href="/dashboard"
                  className={`max-w-[100px] truncate text-sm text-slate-800 hover:text-cyan-600 lg:max-w-[140px] ${
                    path === '/dashboard' ? 'text-cyan-600 font-medium' : ''
                  }`}
                  title={user.email}
                >
                  Account
                </Link>
                <span className="max-w-[100px] truncate text-sm text-slate-500 lg:max-w-[120px]">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-amber-400"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-slate-50/95 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-slate-700"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="mt-2 space-y-2 border-t border-slate-200 pt-2">
              <Link
                href="/dashboard"
                className="block text-cyan-600"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  void logout()
                }}
                className="text-left text-slate-600"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
