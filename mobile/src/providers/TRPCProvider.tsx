import React, { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { api, trpcClient } from "../lib/api"

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Good defaults for mobile apps
            staleTime: 30 * 1000, // 30 seconds
            retry: 2,
          },
        },
      }),
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}
