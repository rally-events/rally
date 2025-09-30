import { createServerClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"
import { SupabaseUserMetadata } from "./user/getUserInfo"

export interface CreateContextOptions {
  supabaseUrl: string
  supabaseKey: string
  getCookie: (name: string) => string | undefined
  setCookie: (name: string, value: string, options?: any) => void
  getAllCookies?: () => { name: string; value: string }[]
  request?: Request
}

export interface TRPCContext {
  user: (User & { user_metadata: SupabaseUserMetadata }) | null
  supabase: ReturnType<typeof createServerClient>
}

export async function createContext(opts: CreateContextOptions): Promise<TRPCContext> {
  const supabase = createServerClient(opts.supabaseUrl, opts.supabaseKey, {
    cookies: {
      getAll() {
        // If getAllCookies is provided (Next.js server components), use it
        if (opts.getAllCookies) {
          return opts.getAllCookies()
        }

        const cookies: { name: string; value: string }[] = []

        // If we have a request (from Next.js API routes or React Native), extract cookies from the Cookie header
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
    user: user as (User & { user_metadata: SupabaseUserMetadata }) | null,
    supabase,
  }
}

export type Context = TRPCContext
