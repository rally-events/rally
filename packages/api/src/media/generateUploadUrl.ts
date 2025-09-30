import { TRPCError } from "@trpc/server"
import { generatePresignedUploadUrl } from "../utils/r2-client"
import type { Context } from "../context"
import type { z } from "zod"
import type { generateUploadUrlSchema } from "@rally/schemas"
import { db, eventsTable, usersTable, eq } from "@rally/db"

export default async function generateUploadUrl(
  ctx: Context,
  input: z.infer<typeof generateUploadUrlSchema>,
) {
  const { eventId, mimeType, fileSize, mediaType } = input

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
      message: "You do not have permission to upload media to this event",
    })
  }

  // Validate file size based on media type
  const isVideo = mimeType.startsWith("video/")
  const isPDF = mimeType === "application/pdf"
  const isPoster = mediaType === "poster"

  let maxSize: number
  if (isVideo) {
    maxSize = 100 * 1024 * 1024 // 100MB for videos
  } else if (isPDF) {
    maxSize = 10 * 1024 * 1024 // 10MB for PDFs
  } else {
    maxSize = 20 * 1024 * 1024 // 20MB for images and posters
  }

  if (fileSize > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
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
    "application/pdf",
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
  let fileExtension = mimeType.split("/")[1]

  // Handle special cases
  if (fileExtension === "quicktime") fileExtension = "mov"

  const fileKey = `events/${eventId}/${timestamp}-${randomString}.${fileExtension}`

  // Generate presigned URL (expires in 1 hour)
  const uploadUrl = await generatePresignedUploadUrl(fileKey, mimeType, 3600)

  return {
    uploadUrl,
    fileKey,
    expiresIn: 3600,
  }
}
