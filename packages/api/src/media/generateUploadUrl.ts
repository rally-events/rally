import { TRPCError } from "@trpc/server"
import { generatePresignedUploadUrl } from "../utils/r2-client"
import type { Context } from "../context"
import type { z } from "zod"
import type { generateUploadUrlSchema } from "@rally/schemas"
import { db } from "@rally/db"
import { eq } from "drizzle-orm"
import { eventsTable } from "@rally/db/schema"

export default async function generateUploadUrl(
  ctx: Context,
  input: z.infer<typeof generateUploadUrlSchema>,
) {
  const { eventId, mimeType, fileSize } = input

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  // Verify the event exists and user has access to it
  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, eventId),
    with: {
      organization: {
        with: {
          users: true,
        },
      },
    },
  })

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    })
  }

  // Check if user is part of the organization
  const userInOrg = event.organization.users.some((user) => user.userId === ctx.user?.id)

  if (!userInOrg) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to upload media to this event",
    })
  }

  // Validate file size (10MB for images, 100MB for videos)
  const isVideo = mimeType.startsWith("video/")
  const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024

  if (fileSize > maxSize) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File size exceeds maximum allowed size of ${isVideo ? "100MB" : "10MB"}`,
    })
  }

  // Validate MIME type
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ]

  if (!allowedMimeTypes.includes(mimeType)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid file type",
    })
  }

  // Generate unique file key
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = mimeType.split("/")[1]
  const fileKey = `events/${eventId}/${timestamp}-${randomString}.${fileExtension}`

  // Generate presigned URL (expires in 1 hour)
  const uploadUrl = await generatePresignedUploadUrl(fileKey, mimeType, 3600)

  return {
    uploadUrl,
    fileKey,
    expiresIn: 3600,
  }
}