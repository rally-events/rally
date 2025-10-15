import {
  db,
  eq,
  eventsMediaTable,
  eventsTable,
  inArray,
  and,
  gte,
  lte,
  sql,
  SQL,
  asc,
  desc,
} from "@rally/db"
import { TRPCContext } from "../context"
import z from "zod"
import { searchEventsSchema } from "@rally/schemas"
import { EventInfo, MediaInfo } from "../types/trpc-types"
import { generatePresignedDownloadUrl } from "../utils/r2-client"

export default async function searchEvents(
  ctx: TRPCContext,
  input: z.infer<typeof searchEventsSchema>,
) {
  const {
    organizationId,
    startDateRange,
    endDateRange,
    format,
    expectedAttendeesMin,
    expectedAttendeesMax,
    eventNameQuery,
    sortBy,
    sortOrder,
  } = input

  // Build conditional filters
  const filters: SQL[] = []

  if (organizationId) {
    filters.push(eq(eventsTable.organizationId, organizationId))
  }

  // Date range filters
  if (startDateRange) {
    filters.push(gte(eventsTable.startDatetime, startDateRange))
  }
  if (endDateRange) {
    filters.push(lte(eventsTable.endDatetime, endDateRange))
  }

  // Format filter
  if (format && format.length > 0) {
    const includesUnspecified = format.includes("unspecified")
    const specifiedFormats = format.filter((f) => f !== "unspecified")

    if (includesUnspecified && specifiedFormats.length > 0) {
      // Include both specified formats AND null/undefined
      filters.push(
        sql`(${inArray(eventsTable.format, specifiedFormats)} OR ${eventsTable.format} IS NULL)`,
      )
    } else if (includesUnspecified) {
      // Only unspecified - show null/undefined only
      filters.push(sql`${eventsTable.format} IS NULL`)
    } else {
      // Only specified formats
      filters.push(inArray(eventsTable.format, specifiedFormats))
    }
  }

  // Expected attendees filters
  if (expectedAttendeesMin !== undefined) {
    filters.push(gte(eventsTable.expectedAttendeesMin, expectedAttendeesMin))
  }
  if (expectedAttendeesMax !== undefined) {
    filters.push(lte(eventsTable.expectedAttendeesMax, expectedAttendeesMax))
  }

  // Event name fuzzy search filter using pg_trgm
  if (eventNameQuery) {
    // Using pg_trgm similarity operator (%) for fuzzy matching with typo tolerance
    filters.push(sql`${eventsTable.name} % ${eventNameQuery}`)
  }

  // Build orderBy clause
  let orderByClause = undefined
  if (sortBy && sortOrder) {
    // Duration is a computed field, so we need to handle it specially
    if (sortBy === "duration") {
      orderByClause =
        sortOrder === "asc"
          ? asc(sql`${eventsTable.endDatetime} - ${eventsTable.startDatetime}`)
          : desc(sql`${eventsTable.endDatetime} - ${eventsTable.startDatetime}`)
    } else {
      const column = eventsTable[sortBy]
      orderByClause = sortOrder === "asc" ? asc(column) : desc(column)
    }
  }

  const [eventsRaw, totalCountResult] = await Promise.all([
    db.query.eventsTable.findMany({
      where: and(...filters),
      with: {
        organization: true,
      },
      limit: input.limit,
      offset: input.page * input.limit,
      orderBy: orderByClause,
    }),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(eventsTable)
      .where(and(...filters)),
  ])

  const events = eventsRaw as (EventInfo<{ withOrganization: true }> & {
    poster: MediaInfo | null
  })[]

  const totalCount = totalCountResult[0]?.count || 0

  const returnedEvents = await Promise.all(
    events.map(async (event) => {
      const eventMedia = (await db.query.eventsMediaTable.findMany({
        where: eq(eventsMediaTable.eventId, event.id),
        with: {
          media: true,
        },
      })) as MediaInfo[]
      const eventPoster = eventMedia.find((m) => m.media.mediaType === "poster")
      if (eventPoster) {
        eventPoster.downloadUrl = await generatePresignedDownloadUrl(
          eventPoster.media.r2FileKey,
          3600,
        )
      }
      return { ...event, poster: eventPoster }
    }),
  )

  return { events: returnedEvents, totalCount }
}
