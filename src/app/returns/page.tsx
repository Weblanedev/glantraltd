import fs from 'node:fs/promises'
import path from 'node:path'

import { LegalPageShell } from '@/components/LegalPageShell'

export const metadata = {
  title: 'Return policy',
  description:
    'Glantra Limited return windows, eligibility, and how to request a refund or exchange.',
}

export default async function ReturnPolicyPage() {
  const content = await fs.readFile(
    path.join(process.cwd(), 'src/content/legal/return-policy.md'),
    'utf8'
  )
  return (
    <LegalPageShell
      title="Return & refund policy"
      description="Eligibility, timeframes, and how we process refunds and exchanges for orders placed on glantrastore.com."
      breadcrumbLabel="Returns"
      content={content}
    />
  )
}
