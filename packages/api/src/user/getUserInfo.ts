import { db, eq, usersTable } from "@rally/db"
import { TRPCContext } from "../context"
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
    console.warn("[API/getUserInfo] Not signed in")
    return null
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, ctx.user.id),
    with: {
      organization: input.withOrganization ? true : undefined,
      organizationMembership: input.withOrganizationMembership ? true : undefined,
    },
  })

  if (!user) {
    console.error("[API/getUserInfo] User not found")
    return null
  }

  let returnedUser = {
    ...user,
    supabaseMetadata: ctx.user.user_metadata as SupabaseUserMetadata,
  }

  return returnedUser
}
