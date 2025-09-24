import { createReactApiClient } from "@rally/api-client"
import { supabase } from "./auth"

// Get the API URL - in development this should point to your local Next.js server
const getApiUrl = () => {
  if (__DEV__) {
    // For development - replace with your local machine's IP address
    // You can find it by running `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
    return "http://localhost:3000/api/trpc"
  }

  // For production - replace with your deployed Next.js app URL
  return "https://your-app.vercel.app/api/trpc"
}

// Create tRPC client with authentication headers
export const { client: api, trpcClient } = createReactApiClient({
  url: getApiUrl(),
  headers: async () => {
    // Get the current session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`,
        // Pass session cookies as headers for server-side auth
        Cookie: `sb-access-token=${session.access_token}; sb-refresh-token=${session.refresh_token}`,
      }
    }

    return {}
  },
})

export { supabase } from "./auth"
