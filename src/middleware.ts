import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Initialize the bulletproof Supabase client
  const supabase = createServerClient(
    'https://pwkmfcyfinqsalwwblcx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3a21mY3lmaW5xc2Fsd3dibGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjUyMDAsImV4cCI6MjA5ODU0MTIwMH0.KQdCnmGCqSjEQRb6LaY8rJqVwA5pCmfkoXzu4E4WUDQ',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verify if a user is actively logged in
  const { data: { user } } = await supabase.auth.getUser()

  // THE CONTROL FLOW LOGIC
  // If they are trying to access ANY /admin route (except the login page)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // And they are NOT logged in
    if (!user) {
      // Redirect them instantly to the login screen
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // If they are already logged in and try to visit the login page, push them to the dashboard
  if (request.nextUrl.pathname === '/admin/login' && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// Tell Next.js which paths the middleware should scan (ignores static files and images to keep the site fast)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}