import { db, eq, eventsMediaTable, eventsTable, inArray } from "@rally/db"
import { TRPCContext } from "../context"
import z from "zod"
import { searchEventsSchema } from "@rally/schemas"
import { EventInfo, MediaInfo } from "../types/trpc-types"
import { generatePresignedDownloadUrl } from "../utils/r2-client"

export default async function searchEvents(
  ctx: TRPCContext,
  input: z.infer<typeof searchEventsSchema>,
) {
  const { organizationId } = input
  const events = (await db.query.eventsTable.findMany({
    where: eq(eventsTable.organizationId, organizationId),
    with: {
      organization: true,
    },
    limit: input.limit,
    offset: input.page * input.limit,
  })) as (EventInfo<{ withOrganization: true }> & { poster: MediaInfo | null })[]

  await Promise.all(
    events.map(async (event) => {
      const eventPoster = (await db.query.eventsMediaTable.findFirst({
        where: eq(eventsMediaTable.eventId, event.id),
        with: {
          media: true,
        },
      })) as MediaInfo
      if (eventPoster) {
        eventPoster.downloadUrl = await generatePresignedDownloadUrl(
          eventPoster.media.r2FileKey,
          3600,
        )
      }
      return { ...event, poster: eventPoster }
    }),
  )

  return events
}
