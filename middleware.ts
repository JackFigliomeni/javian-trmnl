import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const isClientPath = nextUrl.pathname.startsWith('/client')
  const isStaffPath = nextUrl.pathname.startsWith('/staff')

  if (!isLoggedIn && (isClientPath || isStaffPath)) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isLoggedIn) {
    const role = session?.user?.role

    if (isClientPath && role !== 'CLIENT') {
      if (role === 'STAFF') {
        return NextResponse.redirect(new URL('/staff', nextUrl))
      }
      return NextResponse.redirect(new URL('/login', nextUrl))
    }

    if (isStaffPath && role !== 'STAFF') {
      if (role === 'CLIENT') {
        return NextResponse.redirect(new URL('/client', nextUrl))
      }
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/client/:path*', '/staff/:path*'],
}
