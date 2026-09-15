import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || 'late90sadmin';

    if (password === expectedPassword) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' });
      response.cookies.set('late90s_admin_auth', process.env.ADMIN_SECRET || 'late90s_authenticated_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const expectedToken = process.env.ADMIN_SECRET || 'late90s_authenticated_token';
  const isAuthenticated = cookie.includes(`late90s_admin_auth=${expectedToken}`);

  return NextResponse.json({ isAuthenticated });
}
