import { NextResponse } from 'next/server'

export async function proxy(request) {
  // Simple passthrough — auth is handled server-side in each page
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
