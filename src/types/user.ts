export type UserPlan = 'free' | 'starter' | 'pro'

export interface UserProfile {
  phone?: string
  address1?: string
  city?: string
  state?: string
  zip?: string
}

export interface UserRecord {
  id: string
  email: string
  name: string
  plan: UserPlan
  passwordHash: string
  profile?: UserProfile
}

export type PublicUser = Omit<UserRecord, 'passwordHash'>
