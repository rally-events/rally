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
  const { eventId, mimeType, fileSize, mediaType, width, height, duration } = input

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  const [user, event] = await Promise.all([
    db.query.usersTable.findFirst({
      where: eq(usersTable.id, ctx.user.id),
    }),
    db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, eventId),
    }),
  ])

  if (!user || !user.organizationId || !event) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User must be part of an organization and event must exist",
    })
  }

  if (event.organizationId !== user.organizationId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to upload media to this event",
    })
  }

  const isPDF = mimeType === "application/pdf"
  const isVideo = mimeType.startsWith("video/")
  const isPoster = mediaType === "poster"

  let maxSize: number
  if (isVideo) {
    maxSize = 100 * 1024 * 1024 // 100MB for videos
  } else if (isPDF) {
    maxSize = 10 * 1024 * 1024 // 10MB for PDFs
  } else {
    maxSize = 20 * 1024 * 1024 // 20MB for images and posters
  }

  if (!isPDF && width !== undefined && height !== undefined) {
    // Different validation for posters vs regular images/videos
    if (isPoster) {
      if (width < 500 || width > 12000 || height < 500 || height > 12000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid poster dimensions. Must be between 500px and 12000px on both dimensions.",
        })
      }

      // Note: Aspect ratio validation is handled on the frontend with cropping modal
      // Backend only validates dimension ranges
    } else if (mediaType === "image") {
      // Regular images
      if (width < 250 || width > 8000 || height < 250 || height > 8000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid image dimensions. Must be between 250px and 8000px on both dimensions.",
        })
      }

      // Note: Aspect ratio validation (1:1, 4:5, or 5:4) is handled on the frontend with cropping modal
      // Backend only validates dimension ranges
    } else if (isVideo) {
      // Videos - no aspect ratio restriction
      if (width < 250 || width > 8000 || height < 250 || height > 8000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid video dimensions. Must be between 250px and 8000px on both dimensions.",
        })
      }
    }
  }

  // Validate video duration if provided
  if (isVideo && duration !== undefined) {
    if (duration < 2 || duration > 120) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Video duration must be between 2 seconds and 2 minutes (120 seconds).",
      })
    }
  }

  if (fileSize > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    })
  }

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

  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  let fileExtension = mimeType.split("/")[1]

  if (fileExtension === "quicktime") fileExtension = "mov"

  const fileKey = `organizations/${user.organizationId}/event-media/${timestamp}-${randomString}.${fileExtension}`

  const uploadUrl = await generatePresignedUploadUrl(fileKey, mimeType, 3600)

  return {
    uploadUrl,
    fileKey,
    expiresIn: 3600,
  }
}
