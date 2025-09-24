import { createTRPCReact } from "@trpc/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@rally/api"

// React hooks for client components
export const api = createTRPCReact<AppRouter>()

// Vanilla client for use in client-side code without React hooks
export const vanillaApi = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      // Cookies are automatically included in same-origin requests
    }),
  ],
})
