import { NextResponse } from 'next/server'
import { createAdminToken, verifyPassword, COOKIE } from '@/lib/adminAuth'

// POST /api/admin/auth  →  login
export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!verifyPassword(password)) {
      // Same response for wrong password and missing password (no enumeration)
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token    = createAdminToken()
    const response = NextResponse.json({ success: true })

    // No maxAge → session cookie (deleted when browser closes)
    // Token itself expires after 4 hours as a hard limit
    response.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path:     '/',
    })

    return response
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/auth  →  logout
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE, '', { maxAge: 0, path: '/' })
  return response
}
