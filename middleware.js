import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isCustomerRoute = createRouteMatcher(['/cart(.*)', '/orders(.*)'])
const isAdminRoute    = createRouteMatcher(['/admin(.*)'])
const isAdminLogin    = createRouteMatcher(['/admin/login'])

const ADMIN_COOKIE = 'admin_session'

// Verify admin session cookie using Web Crypto (Edge-compatible)
async function verifyAdminCookie(token) {
  if (!token) return false
  try {
    const SECRET = process.env.ADMIN_SECRET
    if (!SECRET) return false

    const dot = token.lastIndexOf('.')
    if (dot < 0) return false
    const data = token.slice(0, dot)
    const sig  = token.slice(dot + 1)

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const b64 = sig.replace(/-/g, '+').replace(/_/g, '/')
    const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0))

    const valid = await crypto.subtle.verify('HMAC', key, raw, new TextEncoder().encode(data))
    if (!valid) return false

    const payloadJson = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)
    return Math.floor(Date.now() / 1000) < payload.exp
  } catch {
    return false
  }
}

export default clerkMiddleware(async (auth, req) => {
  try {
    // ── Customer routes: require Clerk sign-in ──
    if (isCustomerRoute(req)) {
      await auth.protect()
      return
    }

    // ── Admin login page: redirect to /admin if already authenticated ──
    if (isAdminLogin(req)) {
      const token = req.cookies.get(ADMIN_COOKIE)?.value
      if (await verifyAdminCookie(token)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    // ── Admin routes: redirect to login if not authenticated ──
    if (isAdminRoute(req)) {
      const token = req.cookies.get(ADMIN_COOKIE)?.value
      if (!(await verifyAdminCookie(token))) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (err) {
    // Never crash the middleware — always let the request through
    // The page-level auth checks will handle security
    console.error('Middleware error:', err?.message)
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
