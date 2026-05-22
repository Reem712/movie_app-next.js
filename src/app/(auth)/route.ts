import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = NextResponse.json({ ok: true });

  response.cookies.set('auth-storage', JSON.stringify({
    state: {
      user:            body.user,
      isAuthenticated: true,
    },
    version: 0,
  }), {
    path:     '/',
    maxAge:   60 * 60 * 24 * 7,
    sameSite: 'lax',
    httpOnly: false,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('auth-storage', '', { path: '/', maxAge: 0 });
  return response;
}