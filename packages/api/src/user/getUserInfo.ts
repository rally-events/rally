import { db, eq, usersTable } from "@rally/db"
import { TRPCContext } from "../context"
import { TRPCError } from "@trpc/server"
import { getUserInfoSchema } from "@rally/schemas"
import { z } from "zod"

export type SupabaseUserMetadata = {
  sub: string
  email: string
  first_name: string
  last_name: string
  is_admin: boolean
  organization_type: "host" | "sponsor" | undefined
  is_phone_verified: boolean
  is_email_verified: boolean
}

export default async function getUserInfo(
  ctx: TRPCContext,
  input: z.infer<typeof getUserInfoSchema> = {},
) {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, ctx.user.id),
  })

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  let returnedUser = {
    ...user,
    supabaseMetadata: ctx.user.user_metadata as SupabaseUserMetadata,
  }

  return returnedUser
}
