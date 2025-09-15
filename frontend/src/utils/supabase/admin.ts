import "server-only"
import getPrivateEnv from "../getPrivateEnv"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_ANON = getPrivateEnv("SUPABASE_SERVICE_ROLE_KEY")

if (!SUPABASE_ANON) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
}

export default function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, SUPABASE_ANON!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
