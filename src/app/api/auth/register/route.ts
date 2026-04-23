import { NextResponse, type NextRequest } from 'next/server'

import { createUser, getUserByEmail, toPublicUser } from '@/lib/auth'
import { createSessionToken } from '@/lib/session'

import type { PublicUser, UserProfile } from '@/types/user'

const COOKIE = 'techvault_session'

export async function POST(req: NextRequest) {
  let body: {
    email?: string
    password?: string
    name?: string
    profile?: UserProfile
  }
  try {
    body = (await req.json()) as {
      email?: string
      password?: string
      name?: string
      profile?: UserProfile
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const email = (body.email || '').trim()
  const password = body.password || ''
  const name = (body.name || '').trim() || 'Account'
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }
  const existing = await getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }
  try {
    const u = await createUser({
      email,
      password,
      name,
      profile: body.profile,
    })
    const publicUser: PublicUser = toPublicUser(u)
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Registration failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
