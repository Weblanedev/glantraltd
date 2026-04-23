import { NextResponse, type NextRequest } from 'next/server'

import { getUserById, updateUserById, toPublicUser } from '@/lib/auth'
import { parseSessionToken } from '@/lib/session'

import type { PublicUser, UserProfile } from '@/types/user'

const COOKIE = 'techvault_session'

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  const s = parseSessionToken(token)
  if (!s) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const existing = await getUserById(s.userId)
  if (!existing) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: { name?: string; profile?: Partial<UserProfile> }
  try {
    body = (await req.json()) as { name?: string; profile?: Partial<UserProfile> }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const name = (body.name ?? '').trim() || undefined
  const u = await updateUserById(s.userId, {
    ...(name ? { name } : {}),
    profile: body.profile,
  })
  if (!u) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
  const publicUser: PublicUser = toPublicUser(u)
  return NextResponse.json({ user: publicUser })
}
