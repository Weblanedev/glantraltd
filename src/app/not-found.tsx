import Link from 'next/link'

import { PageHeader } from '@/components/PageHeader'

export default function NotFound() {
  return (
    <div>
      <PageHeader
        title="Page not found"
        description="The page you were looking for doesn’t exist or may have been moved."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: '404' }]}
      />
      <p className="text-slate-600">
        <Link
          href="/"
          className="font-medium text-cyan-600 hover:underline"
        >
          Return home
        </Link>
      </p>
    </div>
  )
}
