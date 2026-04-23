import fs from 'fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'path'
import bcrypt from 'bcryptjs'

import type { PublicUser, UserProfile, UserRecord } from '@/types/user'

const DATA = path.join(process.cwd(), 'src', 'data', 'users.json')

export function toPublicUser(u: UserRecord): PublicUser {
  const { passwordHash: _h, ...rest } = u
  void _h
  return rest
}

export async function readUsers(): Promise<UserRecord[]> {
  const raw = await fs.readFile(DATA, 'utf8')
  const j = JSON.parse(raw) as UserRecord[]
  return j
}

export async function writeUsers(users: UserRecord[]) {
  await fs.writeFile(DATA, JSON.stringify(users, null, 2), 'utf8')
}

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const users = await readUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export async function getUserById(id: string): Promise<UserRecord | undefined> {
  const users = await readUsers()
  return users.find((u) => u.id === id)
}

export async function createUser(input: {
  email: string
  password: string
  name: string
  profile?: UserProfile
}): Promise<UserRecord> {
  const users = await readUsers()
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('Email already registered')
  }
  const passwordHash = await bcrypt.hash(input.password, 10)
  const id = randomUUID()
  const user: UserRecord = {
    id,
    email: input.email,
    name: input.name,
    plan: 'free',
    passwordHash,
    ...(input.profile && Object.keys(input.profile).length > 0
      ? { profile: input.profile }
      : {}),
  }
  users.push(user)
  await writeUsers(users)
  return user
}

export async function updateUserById(
  id: string,
  patch: { name?: string; profile?: Partial<UserProfile> }
): Promise<UserRecord | undefined> {
  const users = await readUsers()
  const i = users.findIndex((u) => u.id === id)
  if (i < 0) return undefined
  const cur = users[i]!
  const user: UserRecord = {
    ...cur,
    ...(patch.name != null && patch.name !== '' ? { name: patch.name } : {}),
    ...(patch.profile
      ? { profile: { ...cur.profile, ...patch.profile } as UserProfile }
      : {}),
  }
  users[i] = user
  await writeUsers(users)
  return user
}

export async function verifyUser(
  email: string,
  password: string
): Promise<UserRecord | null> {
  const u = await getUserByEmail(email)
  if (!u) return null
  const ok = await bcrypt.compare(password, u.passwordHash)
  if (!ok) return null
  return u
}
