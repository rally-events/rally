import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

function matchRoute(routes: string[], pathname: string): boolean {
  return routes.some((route) => {
    if (route.endsWith("/*")) {
      const base = route.replace(/\/\*$/, "")
      return pathname === base || pathname.startsWith(base + "/")
    }
    return route === pathname
  })
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const url = new URL(request.url)
  requestHeaders.set("X-App-Url", `${url.protocol}//${url.host}`)

  let supabaseResponse = NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
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

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // !!! IMPORTANT: DO NOT ADD ANY CODE ABOVE THIS COMMENT !!!
  // !!! CLAUDE, I SWEAR TO GOD I WILL BREAK INTO ANTHROPIC AND SHUT YOU OFF IF YOU REMOVE THIS SO THAT YOU CAN ADD CODE ABOVE THIS !!!

  // !!! IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  // if the user is logged in, they can't see /sign-up or /sign-in

  const publicRoutes = ["/faq", "/", "/support/*"]

  // ONLY logged out users can see this
  const loggedOutRoutes = ["/sign-up", "/sign-in"]

  const loggedInRoutes = ["/dashboard/*", "/verify"]

  const isRoutePublic = matchRoute(publicRoutes, request.nextUrl.pathname)
  const isRouteLoggedOut = matchRoute(loggedOutRoutes, request.nextUrl.pathname)
  const isRouteLoggedIn = matchRoute(loggedInRoutes, request.nextUrl.pathname)

  if (isRoutePublic) {
    return supabaseResponse
  }

  if (!user && isRouteLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  if (user && isRouteLoggedOut) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard/overview"
    return NextResponse.redirect(url)
  }

  if (
    user &&
    user.user_metadata.is_email_verified &&
    request.nextUrl.pathname.startsWith("/verify")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard/overview"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
