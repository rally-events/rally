import { TRPCError } from "@trpc/server"
import { TRPCContext } from "../context"
import { z } from "zod"
import getUserInfo from "../user/getUserInfo"
import { createSponsorRequestSchema } from "@rally/schemas"
import { and, db, eq, eventsTable, inArray, sponsorRequestTable } from "@rally/db"
import createNotification from "../utils/createNotification"

export default async function createSponsorRequest(
  ctx: TRPCContext,
  input: z.infer<typeof createSponsorRequestSchema>,
) {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  const user = await getUserInfo(ctx, { withOrganization: true })
  if (!user || !user.organizationId || user.supabaseMetadata.organization_type !== "sponsor") {
    throw new TRPCError({ code: "NOT_FOUND" })
  }
  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, input.eventId),
  })
  if (!event) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  // make sure we haven't already requested to sponsor this event
  const existingRequest = await db.query.sponsorRequestTable.findFirst({
    where: and(
      eq(sponsorRequestTable.eventId, input.eventId),
      eq(sponsorRequestTable.sponsorOrganizationId, user.organizationId),
      inArray(sponsorRequestTable.status, ["pending", "revised"]),
    ),
  })

  if (existingRequest) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You have already requested to sponsor this event",
    })
  }

  const [newSponsorRequest] = await db
    .insert(sponsorRequestTable)
    .values({
      eventId: input.eventId,
      sponsorOrganizationId: user.organizationId,
      hostOrganizationId: event.organizationId,
      description: input.description,
      dollarAmount: input.dollarAmount?.toString() || null,
    })
    .returning({ id: sponsorRequestTable.id })

  await createNotification({
    data: {
      type: "sponsorship_request_new",
      sponsorshipRequestId: newSponsorRequest.id,
      eventId: event.id,
      eventName: event.name,
      sponsorOrganizationId: user.organizationId,
      sponsorOrganizationName: user.organization!.name || "",
    },
    organizationId: event.organizationId,
  })
}
