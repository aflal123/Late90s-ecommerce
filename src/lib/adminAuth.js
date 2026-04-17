import crypto from 'crypto'

const COOKIE   = 'admin_session'
const MAX_AGE  = 60 * 60 * 4   // 4 hours — token hard-expiry

function getSecret() {
  return process.env.ADMIN_SECRET || 'fallback-secret-change-in-env'
}

// Build a signed token:  base64url(payload).base64url(hmac)
export function createAdminToken() {
  const payload = { role: 'admin', exp: Math.floor(Date.now() / 1000) + MAX_AGE }
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig  = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

// Returns payload if valid, null otherwise
export function verifyAdminToken(token) {
  try {
    const dot = token.lastIndexOf('.')
    if (dot < 0) return null
    const data     = token.slice(0, dot)
    const sig      = token.slice(dot + 1)
    const expected = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url')
    // Constant-time compare
    if (sig.length !== expected.length) return null
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (Math.floor(Date.now() / 1000) > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

// Verify the incoming password against ADMIN_PASSWORD env var
export function verifyPassword(input) {
  const stored = process.env.ADMIN_PASSWORD
  if (!input || !stored) return false
  // Constant-time compare (same length requirement)
  try {
    const a = Buffer.from(crypto.createHash('sha256').update(input).digest('hex'))
    const b = Buffer.from(crypto.createHash('sha256').update(stored).digest('hex'))
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export { COOKIE, MAX_AGE }
