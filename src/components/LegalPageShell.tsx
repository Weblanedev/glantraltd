import { PageHeader } from '@/components/PageHeader'
import { MarkdownArticle } from '@/components/MarkdownArticle'
import { siteDomain, siteName } from '@/lib/site'
import type { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  breadcrumbLabel: string
  content: string
  /** Extra below markdown (e.g. disclaimer) */
  children?: ReactNode
}

export function LegalPageShell({
  title,
  description,
  breadcrumbLabel,
  content,
  children,
}: Props) {
  const n = siteName()
  const domain = siteDomain()
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: breadcrumbLabel },
        ]}
      />
      <div className="mt-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm text-slate-500">
          {n} · {domain}
        </p>
        <div className="mt-6">
          <MarkdownArticle content={content} />
        </div>
        {children}
      </div>
    </div>
  )
}
