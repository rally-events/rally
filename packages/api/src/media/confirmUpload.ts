import { TRPCError } from "@trpc/server"
import type { Context } from "../context"
import type { z } from "zod"
import type { confirmUploadSchema } from "@rally/schemas"
import { db, eventsTable, usersTable, mediaTable, eq, eventsMediaTable } from "@rally/db"

export default async function confirmUpload(
  ctx: Context,
  input: z.infer<typeof confirmUploadSchema>,
) {
  const { eventId, fileKey, fileSize, mimeType, mediaType, fileName, blurhash, aspectRatio } =
    input

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

  const [mediaRecord] = await db
    .insert(mediaTable)
    .values({
      organizationId: event.organizationId!,
      r2FileKey: fileKey,
      fileSize,
      mimeType,
      fileName,
      mediaType,
      uploadedBy: ctx.user.id,
      blurhash: blurhash || null,
      aspectRatio: aspectRatio || null,
    })
    .returning()

  await db.insert(eventsMediaTable).values({
    eventId: eventId,
    mediaId: mediaRecord.id,
  })

  return mediaRecord
}
