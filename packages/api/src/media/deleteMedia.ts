import { TRPCError } from "@trpc/server"
import { deleteFile } from "../utils/r2-client"
import type { Context } from "../context"
import type { z } from "zod"
import type { deleteMediaSchema } from "@rally/schemas"
import { db } from "@rally/db"
import { eq, and } from "drizzle-orm"
import { mediaTable } from "@rally/db/schema"

export default async function deleteMedia(
  ctx: Context,
  input: z.infer<typeof deleteMediaSchema>,
) {
  const { mediaId } = input

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  // Get the media record
  const media = await db.query.mediaTable.findFirst({
    where: eq(mediaTable.id, mediaId),
    with: {
      organization: {
        with: {
          users: true,
        },
      },
    },
  })

  if (!media) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Media not found",
    })
  }

  // Check if user is part of the organization
  const userInOrg = media.organization.users.some((user) => user.userId === ctx.user?.id)

  if (!userInOrg) {
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