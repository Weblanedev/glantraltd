import fs from 'node:fs/promises'
import path from 'node:path'

import { LegalPageShell } from '@/components/LegalPageShell'

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How Glantra Limited collects, uses, and protects your information on glantrastore.com.',
}

export default async function PrivacyPolicyPage() {
  const content = await fs.readFile(
    path.join(process.cwd(), 'src/content/legal/privacy-policy.md'),
    'utf8'
  )
  return (
    <LegalPageShell
      title="Privacy policy"
      description="How we handle personal data when you use glantrastore.com."
      breadcrumbLabel="Privacy"
      content={content}
    />
  )
}
