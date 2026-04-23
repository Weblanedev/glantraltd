import { NextResponse, type NextRequest } from 'next/server'

import { getUserById, toPublicUser } from '@/lib/auth'
import { parseSessionToken } from '@/lib/session'

import type { PublicUser } from '@/types/user'

const COOKIE = 'techvault_session'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  const s = parseSessionToken(token)
  if (!s) {
    return NextResponse.json({ user: null as PublicUser | null })
  }
  const u = await getUserById(s.userId)
  if (!u) {
    return NextResponse.json({ user: null as PublicUser | null })
  }
  const publicUser: PublicUser = toPublicUser(u)
  return NextResponse.json({ user: publicUser })
}
