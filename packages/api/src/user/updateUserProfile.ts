import z from "zod"
import { TRPCContext } from "../context"
import { TRPCError } from "@trpc/server"
import { updateUserProfileSchema } from "@rally/schemas"
import getUserInfo from "./getUserInfo"
import { db, usersTable, eq } from "@rally/db"

export default async function updateUserProfile(
  ctx: TRPCContext,
  input: z.infer<typeof updateUserProfileSchema>,
) {
  if (!ctx.user) {
    console.error("[API/updateUserProfile] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  const user = await getUserInfo(ctx)
  if (!user) {
    console.error("[API/updateUserProfile] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (input.firstName || input.lastName) {
    await ctx.supabase.auth.updateUser({
      data: {
        first_name: input.firstName || user.supabaseMetadata.first_name,
        last_name: input.lastName || user.supabaseMetadata.last_name,
      },
    })
    await db
      .update(usersTable)
      .set({
        firstName: input.firstName || user.supabaseMetadata.first_name,
        lastName: input.lastName || user.supabaseMetadata.last_name,
      })
      .where(eq(usersTable.id, user.id))
  }
}
