import { NextResponse, type NextRequest } from 'next/server'

import { toPublicUser, verifyUser } from '@/lib/auth'
import { createSessionToken } from '@/lib/session'

const COOKIE = 'techvault_session'

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string }
  try {
    body = (await req.json()) as { email?: string; password?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const email = (body.email || '').trim()
  const password = body.password || ''
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  const u = await verifyUser(email, password)
  if (!u) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  const publicUser = toPublicUser(u)
  const token = createSessionToken(u.id)
  const res = NextResponse.json({ user: publicUser })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
