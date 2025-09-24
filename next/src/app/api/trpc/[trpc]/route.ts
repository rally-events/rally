import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter, createContext } from "@rally/api"
import { cookies } from "next/headers"

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const cookieStore = await cookies()

      return createContext({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        getCookie: (name: string) => cookieStore.get(name)?.value,
        setCookie: (name: string, value: string, options?: any) => {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Setting cookies from a Server Component can be ignored
            // as the middleware will handle session refreshing
          }
        },
        request: req,
      })
    },
    onError: ({ error, path, input }) => {
      console.error(`tRPC Error on ${path}:`, error)
    },
  })
}

export { handler as GET, handler as POST }
