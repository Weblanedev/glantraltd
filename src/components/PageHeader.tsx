import Link from 'next/link'
import type { ReactNode } from 'react'

export type Breadcrumb = { label: string; href?: string }

type Props = {
  title: string
  /** Show under the title (short line of supporting copy) */
  description?: string
  breadcrumbs?: Breadcrumb[]
  /** Optional decorative right slot (illustration, icon cluster) */
  children?: ReactNode
}

export function PageHeader({ title, description, breadcrumbs, children }: Props) {
  return (
    <header className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/95 to-cyan-50/30 px-6 py-10 shadow-sm sm:px-10 sm:py-12 md:py-14">
      <div
        className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-amber-400/15 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="mb-3 text-xs font-medium text-slate-500 sm:text-sm"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              {breadcrumbs.map((c, i) => (
                <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-400" aria-hidden>/</span>}
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="text-cyan-600 transition hover:text-cyan-500 hover:underline"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-slate-600">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  )
}
