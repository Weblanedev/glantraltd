import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { getServerUser } from '@/lib/server-auth'

export default async function PartnerLayout({ children }: { children: ReactNode }) {
  const user = await getServerUser()
  if (!user) {
    redirect('/login?next=/partner')
  }
  return <>{children}</>
}
