import { db, eq, usersTable } from "@rally/db"
import { router, protectedProcedure } from "../trpc"

export type SupabaseUserMetadata = {
  email: string
  full_name: string
  onboard_complete: boolean
  pending_access: number
  phone_verified: boolean
  stripe_customer_id: string
  sub: string
  we_verified_email: boolean
}

export const userRouter = router({
  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    // Get user from Supabase context (guaranteed to exist due to protectedProcedure)
    const supabaseUser = ctx.user

    // Query the database for the user's profile data
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, supabaseUser.id),
    })

    if (!user) {
      throw new Error("User profile not found")
    }

    // Return combined user data with type safety
    return {
      ...user,
      supabaseMetadata: supabaseUser.user_metadata as SupabaseUserMetadata,
    }
  }),
})
