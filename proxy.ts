import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/auth/login", "/auth/register"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow all other routes without checking session
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)"],
}
