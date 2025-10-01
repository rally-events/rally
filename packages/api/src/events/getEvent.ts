import { TRPCContext } from "../context"
import {
  db,
  eventsMediaTable,
  eventsTable,
  mediaTable,
  organizationsTable,
  usersTable,
} from "@rally/db"
import { eq, inArray, InferSelectModel } from "drizzle-orm"
import { getEventSchema } from "@rally/schemas"
import z from "zod"
import { TRPCError } from "@trpc/server"
import { generatePresignedDownloadUrl } from "../utils/r2-client"
import { EventInfo, MediaInfo } from "../types/trpc-types"

export default async function getEvent(ctx: TRPCContext, input: z.infer<typeof getEventSchema>) {
  if (!ctx.user) {
    console.error("[API/getEvent] User not found")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }
  if (!ctx.user.user_metadata.organization_type) {
    console.error("[API/getEvent] User is not a host")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }

  let event = (await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, input.id),
    with: {
      organization: input.withOrganization ? true : undefined,
      updatedByUser: input.withUpdatedByUser ? true : undefined,
    },
  })) as InferSelectModel<typeof eventsTable> & {
    organization: InferSelectModel<typeof organizationsTable> | null
    updatedByUser: InferSelectModel<typeof usersTable> | null
    media: MediaInfo[]
  }

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    })
  }

  if (input.withMedia) {
    let media = await db.query.eventsMediaTable.findMany({
      where: eq(eventsMediaTable.eventId, event.id),
      with: {
        media: true,
      },
    })
    media = await Promise.all(
      media.map(async (item) => ({
        ...item,
        downloadUrl: await generatePresignedDownloadUrl(item.media.r2FileKey, 3600),
      })),
    )
    event.media = media as MediaInfo[]
  }

  return event
}
