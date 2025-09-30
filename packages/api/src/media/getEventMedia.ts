import { TRPCError } from "@trpc/server"
import { generatePresignedDownloadUrl } from "../utils/r2-client"
import type { Context } from "../context"
import type { z } from "zod"
import type { getEventMediaSchema } from "@rally/schemas"
import { db, eventsTable, usersTable, mediaTable, eq, desc } from "@rally/db"

export default async function getEventMedia(
  ctx: Context,
  input: z.infer<typeof getEventMediaSchema>,
) {
  const { eventId } = input

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  // Get the user's organization
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, ctx.user.id),
  })

  if (!user || !user.organizationId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User must be part of an organization",
    })
  }

  // Verify the event exists and belongs to user's organization
  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, eventId),
  })

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    })
  }

  // Check if event belongs to user's organization
  if (event.organizationId !== user.organizationId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to view media for this event",
    })
  }

  // Fetch all media for the event
  const media = await db.query.mediaTable.findMany({
    where: eq(mediaTable.eventId, eventId),
    orderBy: [desc(mediaTable.createdAt)],
  })

  // Generate presigned download URLs for each media item
  const mediaWithUrls = await Promise.all(
    media.map(async (item) => ({
      ...item,
      downloadUrl: await generatePresignedDownloadUrl(item.r2FileKey, 3600), // 1 hour expiry
    })),
  )

  return mediaWithUrls
}
