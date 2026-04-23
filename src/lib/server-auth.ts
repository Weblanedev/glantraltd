import { cookies } from 'next/headers'

import { getUserById, toPublicUser } from '@/lib/auth'
import { parseSessionToken } from '@/lib/session'
import type { PublicUser } from '@/types/user'

const COOKIE = 'techvault_session'

/** Session user for server components / layouts (e.g. auth gates). */
export async function getServerUser(): Promise<PublicUser | null> {
  const token = (await cookies()).get(COOKIE)?.value
  const s = parseSessionToken(token)
  if (!s) return null
  const u = await getUserById(s.userId)
  if (!u) return null
  return toPublicUser(u)
}
