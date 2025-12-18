import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const userId = req.cookies.get('userId')?.value;

  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
