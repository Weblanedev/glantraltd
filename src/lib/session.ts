import crypto from 'crypto'

const ALGO = 'sha256'

function getSecret() {
  return process.env.SESSION_SECRET || 'dev-only-set-SESSION_SECRET'
}

export function createSessionToken(userId: string): string {
  const issued = Date.now()
  const toSign = `${userId}|${issued}`
  const sig = crypto.createHmac(ALGO, getSecret()).update(toSign).digest('base64url')
  const full = `${toSign}|${sig}`
  return Buffer.from(full, 'utf8').toString('base64url')
}

export function parseSessionToken(
  token: string | undefined
): { userId: string; issued: number } | null {
  if (!token) return null
  try {
    const full = Buffer.from(token, 'base64url').toString('utf8')
    const last = full.lastIndexOf('|')
    const secondLast = full.lastIndexOf('|', last - 1)
    if (secondLast === -1) return null
    const userId = full.slice(0, secondLast)
    const issued = Number(full.slice(secondLast + 1, last))
    const sig = full.slice(last + 1)
    const toSign = `${userId}|${issued}`
    const good = crypto.createHmac(ALGO, getSecret()).update(toSign).digest('base64url')
    if (sig !== good) return null
    if (Number.isNaN(issued)) return null
    const max = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - issued > max) return null
    return { userId, issued }
  } catch {
    return null
  }
}
