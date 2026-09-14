import { NextResponse } from 'next/server'

const ADMIN_COOKIE = 'admin_session'

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

    const payload = JSON.parse(atob(data.replace(/-/g, '+').replace(/_/g, '/')))
    return Math.floor(Date.now() / 1000) < payload.exp
  } catch {
    return false
  }
}

export default async function middleware(req) {
  try {
    const { pathname } = req.nextUrl

    // Allow static files, api routes, and Next.js internal assets
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Admin login page — redirect to /admin if already logged in
    if (pathname === '/admin/login') {
      const token = req.cookies.get(ADMIN_COOKIE)?.value
      if (await verifyAdminCookie(token)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    // All /admin routes — require cookie
    if (pathname.startsWith('/admin')) {
      const token = req.cookies.get(ADMIN_COOKIE)?.value
      if (!(await verifyAdminCookie(token))) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
      return NextResponse.next()
    }

    // Maintenance Mode: Rewrite all other public routes (like /products, /about, /cart) to /
    if (pathname !== '/') {
      return NextResponse.rewrite(new URL('/', req.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
