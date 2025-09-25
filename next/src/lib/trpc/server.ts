import { cache } from "react"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { appRouter, createContext } from "@rally/api"
import type { AppRouter } from "@rally/api"
import { cookies } from "next/headers"
import "server-only"

// Create a server-side tRPC caller for use in server components
export const api = cache(async () => {
  const cookieStore = await cookies()

  // Create context similar to the API route
  const ctx = await createContext({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    getCookie: (name: string) => cookieStore.get(name)?.value,
    setCookie: (name: string, value: string, options?: any) => {
      // Server components can't set cookies, but this maintains compatibility
    },
  })

  return appRouter.createCaller(ctx)
})

// Also export a direct HTTP client for server-side use if needed
export const httpApi = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
      async headers() {
        const cookieStore = await cookies()
        const cookieString = cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${value}`)
          .join("; ")

        return {
          cookie: cookieString,
        }
      },
    }),
  ],
})
