import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Initialize the admin-specific Supabase client using our isolated cookie name
  const adminAuthClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: 'sb-admin-auth-token',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAdminLoginRoute = request.nextUrl.pathname.startsWith('/admin/login');

  // Verify if a user is actively logged in to the ADMIN portal
  let user = null;
  if (isAdminRoute) {
    const { data } = await adminAuthClient.auth.getUser()
    user = data.user;
  }
  
  console.log("Middleware Check - Admin User ID:", user?.id);

  let isAdmin = false;
  if (user) {
    // We use the Service Role Key to bypass RLS and prevent "infinite recursion" policy errors
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );
    
    const { data: profile } = await adminSupabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (profile?.is_admin) {
      isAdmin = true;
    }
  }
  console.log("Middleware Check - isAdmin:", isAdmin);

  console.log("Middleware Check - isAdmin:", isAdmin);

  if (isAdminRoute && !isAdminLoginRoute) {
    // 1. Not logged in -> Go to admin login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    
    // 2. Logged in, but NOT an admin -> Go to home page
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // If they are already logged in AND are an admin, keep them away from login page
  if (isAdminLoginRoute && user && isAdmin) {
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