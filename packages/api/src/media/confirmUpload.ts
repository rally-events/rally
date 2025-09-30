import { TRPCError } from "@trpc/server"
import type { Context } from "../context"
import type { z } from "zod"
import type { confirmUploadSchema } from "@rally/schemas"
import { db, eventsTable, usersTable, mediaTable, eq } from "@rally/db"

export default async function confirmUpload(
  ctx: Context,
  input: z.infer<typeof confirmUploadSchema>,
) {
  const { eventId, fileKey, fileSize, mimeType, width, height, duration, mediaType } = input

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

  // Validate dimensions if provided (not needed for PDFs)
  const isPDF = mimeType === "application/pdf"
  const isVideo = mimeType.startsWith("video/")
  const isPoster = mediaType === "poster"

  if (!isPDF && width !== undefined && height !== undefined) {
    // Different validation for posters vs regular images/videos
    if (isPoster) {
      if (width < 500 || width > 12000 || height < 500 || height > 12000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid poster dimensions. Must be between 500px and 12000px on both dimensions.",
        })
      }

      // Validate poster aspect ratio
      const aspectRatio = width / height
      const POSTER_ASPECT_RATIOS = [
        { ratio: 11 / 17, name: "11:17" },
        { ratio: 4 / 5, name: "4:5" },
        { ratio: 9 / 16, name: "9:16" },
        { ratio: 8.5 / 11, name: "8.5:11" },
      ]
      const ASPECT_RATIO_TOLERANCE = 0.02

      const matchingRatio = POSTER_ASPECT_RATIOS.find(
        ({ ratio }) => Math.abs(aspectRatio - ratio) <= ASPECT_RATIO_TOLERANCE,
      )

      if (!matchingRatio) {
        const ratioNames = POSTER_ASPECT_RATIOS.map((r) => r.name).join(", ")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Poster must have one of these aspect ratios: ${ratioNames}. Current aspect ratio: ${aspectRatio.toFixed(3)}`,
        })
      }
    } else {
      // Regular images and videos
      if (width < 250 || width > 8000 || height < 250 || height > 8000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid media dimensions. Must be between 250px and 8000px on both dimensions.",
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

  // Insert media record into database
  const [mediaRecord] = await db
    .insert(mediaTable)
    .values({
      eventId,
      organizationId: event.organizationId!,
      r2FileKey: fileKey,
      fileSize,
      mimeType,
      uploadedBy: ctx.user.id,
    })
    .returning()

  return mediaRecord
}