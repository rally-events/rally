import { createClient } from "@/utils/supabase/server"
import { db, eq, usersTable } from "@rally/db"

export type SupabaseUserMetadata = {
  // will figure this out
}

export default async function getUserInfo(optionalProperties: {} = {}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return { data: null, error: "Not logged in" }
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, data.user.id),
  })

  if (!user) {
    return { data: null, error: "User not found" }
  }

  let returnedUser = {
    ...user,
    supabaseMetadata: data.user.user_metadata as SupabaseUserMetadata,
  }

  return { data: returnedUser, error: null }
}
