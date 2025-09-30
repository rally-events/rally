import { TRPCError } from "@trpc/server"
import { deleteFile } from "../utils/r2-client"
import type { Context } from "../context"
import type { z } from "zod"
import type { deleteMediaSchema } from "@rally/schemas"
import { db, mediaTable, usersTable, eq } from "@rally/db"

export default async function deleteMedia(
  ctx: Context,
  input: z.infer<typeof deleteMediaSchema>,
) {
  const { mediaId } = input

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

  // Get the media record
  const media = await db.query.mediaTable.findFirst({
    where: eq(mediaTable.id, mediaId),
  })

  if (!media) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Media not found",
    })
  }

  // Check if media belongs to user's organization
  if (media.organizationId !== user.organizationId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to delete this media",
    })
  }

  // Delete from R2
  await deleteFile(media.r2FileKey)

  // Delete from database
  await db.delete(mediaTable).where(eq(mediaTable.id, mediaId))

  return {
    success: true,
  }
}