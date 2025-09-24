import { createServerClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"

export interface CreateContextOptions {
  supabaseUrl: string
  supabaseKey: string
  getCookie: (name: string) => string | undefined
  setCookie: (name: string, value: string, options?: any) => void
  request?: Request
}

export interface TRPCContext {
  user: User | null
  supabase: ReturnType<typeof createServerClient>
}

export async function createContext(opts: CreateContextOptions): Promise<TRPCContext> {
  const supabase = createServerClient(opts.supabaseUrl, opts.supabaseKey, {
    cookies: {
      getAll() {
        const cookies: { name: string; value: string }[] = []

        // If we have a request (from React Native), extract cookies from the Cookie header
        if (opts.request) {
          const cookieHeader = opts.request.headers.get("cookie")
          if (cookieHeader) {
            cookieHeader.split(";").forEach((cookie) => {
              const [name, value] = cookie.trim().split("=")
              if (name && value) {
                cookies.push({ name, value })
              }
            })
          }
        }

        return cookies
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          opts.setCookie(name, value, options)
        })
      },
    },
  })

  // Get the current user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return {
    user,
    supabase,
  }
}

export type Context = TRPCContext
