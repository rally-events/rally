import { TRPCError } from "@trpc/server"
import { TRPCContext } from "../context"
import { db, eventsTable } from "@rally/db"
import getUserInfo from "../user/getUserInfo"

export default async function createEvent(ctx: TRPCContext) {
  if (!ctx.user) {
    console.error("[API/createEvent] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (
    !ctx.user.user_metadata.organization_type ||
    ctx.user.user_metadata.organization_type !== "host"
  ) {
    console.error("[API/createEvent] User is not a host")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }

  const user = await getUserInfo(ctx, { withOrganization: true })
  if (!user) {
    console.error("[API/createEvent] User not found")
    throw new TRPCError({
      code: "NOT_FOUND",
    })
  }

  if (!user.organization || user.organization.type !== "host") {
    console.error("[API/createEvent] User is not a member of an organization")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }

  try {
    const [event] = await db
      .insert(eventsTable)
      .values({
        name: "New Event",
        organizationId: user.organization.id,
      })
      .returning({ id: eventsTable.id })
    return event.id
  } catch (error) {
    console.error("[API/createEvent] Error creating event", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    })
  }
}
