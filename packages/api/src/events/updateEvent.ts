import z from "zod"
import { TRPCContext } from "../context"
import { eventEditOptionalSchema } from "@rally/schemas"
import { TRPCError } from "@trpc/server"
import { db, eventsTable } from "@rally/db"
import { eq } from "drizzle-orm"
import getUserInfo from "../user/getUserInfo"

export default async function updateEvent(
  ctx: TRPCContext,
  input: z.infer<typeof eventEditOptionalSchema>,
) {
  if (!ctx.user) {
    console.error("[API/updateEvent] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  if (
    !ctx.user.user_metadata.organization_type ||
    ctx.user.user_metadata.organization_type !== "host"
  ) {
    console.error("[API/updateEvent] User is not a host")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }

  const user = await getUserInfo(ctx, { withOrganization: true })
  if (!user || !user.organization) {
    console.error("[API/updateEvent] User organization not found")
    throw new TRPCError({
      code: "NOT_FOUND",
    })
  }

  // Verify the event belongs to the user's organization
  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, input.id),
  })

  if (!event) {
    console.error("[API/updateEvent] Event not found")
    throw new TRPCError({
      code: "NOT_FOUND",
    })
  }

  if (event.organizationId !== user.organization.id) {
    console.error("[API/updateEvent] User does not have permission to update this event")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }

  // Prepare update values - only include fields that are present in input
  const updateValues: Partial<typeof eventsTable.$inferInsert> = {
    updatedBy: ctx.user.id,
    updatedAt: new Date(),
  }

  if (input.name !== undefined) updateValues.name = input.name
  if (input.description !== undefined) updateValues.description = input.description
  if (input.eventType !== undefined) updateValues.eventType = input.eventType
  if (input.format !== undefined) updateValues.format = input.format
  if (input.usingOrganizationAddress !== undefined)
    updateValues.usingOrganizationAddress = input.usingOrganizationAddress
  if (input.streetAddress !== undefined) updateValues.streetAddress = input.streetAddress
  if (input.city !== undefined) updateValues.city = input.city
  if (input.state !== undefined) updateValues.state = input.state
  if (input.country !== undefined) updateValues.country = input.country
  if (input.zipCode !== undefined) updateValues.zipCode = input.zipCode
  if (input.startDatetime !== undefined) updateValues.startDatetime = input.startDatetime
  if (input.endDatetime !== undefined) updateValues.endDatetime = input.endDatetime
  if (input.themes !== undefined) updateValues.themes = input.themes
  if (input.audienceAge !== undefined) updateValues.audienceAge = input.audienceAge
  if (input.communitySegments !== undefined)
    updateValues.communitySegments = input.communitySegments
  if (input.audienceInterests !== undefined)
    updateValues.audienceInterests = input.audienceInterests
  if (input.hasFamousPeople !== undefined) updateValues.hasFamousPeople = input.hasFamousPeople
  if (input.famousPeople !== undefined) {
    updateValues.famousPeople = input.famousPeople as Array<{
      name: string
      title: string
      profession: string
      instagram?: string
      website?: string
    }>
  }
  if (input.isTicketed !== undefined) updateValues.isTicketed = input.isTicketed
  if (input.ticketCost !== undefined) updateValues.ticketCost = String(input.ticketCost)

  if (input.expectedAttendees !== undefined) {
    updateValues.expectedAttendeesMin = input.expectedAttendees.min
    updateValues.expectedAttendeesMax = input.expectedAttendees.max
  }

  try {
    const [updatedEvent] = await db
      .update(eventsTable)
      .set(updateValues)
      .where(eq(eventsTable.id, input.id))
      .returning()

    return updatedEvent
  } catch (error) {
    console.error("[API/updateEvent] Error updating event", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update event",
    })
  }
}
