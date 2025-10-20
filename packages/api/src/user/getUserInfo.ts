import { db, eq, notificationsTable, or, usersTable } from "@rally/db"
import { TRPCContext } from "../context"
import { getUserInfoSchema } from "@rally/schemas"
import { z } from "zod"
import { NotificationInfo } from "../types/trpc-types"

export type SupabaseUserMetadata = {
  sub: string
  email: string
  phone_number?: string
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
      phoneChallenge: input.withChallenges ? true : undefined,
    },
  })

  if (!user) {
    console.error("[API/getUserInfo] User not found")
    return null
  }

  let notifications: NotificationInfo[] = []
  if (input.withNotifications) {
    notifications = await db.query.notificationsTable.findMany({
      where: or(
        eq(notificationsTable.userId, user.id),
        eq(notificationsTable.organizationId, user.organizationId || ""),
      ),
    })
  }

  let returnedUser = {
    ...user,
    supabaseMetadata: ctx.user.user_metadata as SupabaseUserMetadata,
    notifications,
  }

  return returnedUser
}
