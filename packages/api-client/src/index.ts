import { createTRPCReact, httpBatchLink } from "@trpc/react-query"
import { createTRPCClient as createVanillaTRPCClient } from "@trpc/client"
import type { AppRouter } from "@rally/api"

// Re-export types for convenience
export type { AppRouter } from "@rally/api"

// React hooks client
export const api = createTRPCReact<AppRouter>()

// Create a vanilla client factory for different environments
export function createApiClient(config: {
  url: string
  headers?: () => Record<string, string> | Promise<Record<string, string>>
}) {
  return createVanillaTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: config.url,
        headers: config.headers,
      }),
    ],
  })
}

// Create React client factory
export function createReactApiClient(config: {
  url: string
  headers?: () => Record<string, string> | Promise<Record<string, string>>
}) {
  const client = createTRPCReact<AppRouter>()

  const trpcClient = client.createClient({
    links: [
      httpBatchLink({
        url: config.url,
        headers: config.headers,
      }),
    ],
  })

  return { client, trpcClient }
}

// Type inference utilities from tRPC
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
