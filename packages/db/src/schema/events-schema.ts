import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { organizationsTable } from "./organizations-schema"
import { relations } from "drizzle-orm"
import { mediaTable } from "./media-schema"
import { usersTable } from "./users-schema"
import { ageOptions, formatOptions } from "@rally/schemas"

export const formatEnum = pgEnum("format_enum", formatOptions as [string, ...string[]])
export const audienceAgeEnum = pgEnum("audience_age_enum", ageOptions as [string, ...string[]])

export const eventsTable = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: uuid("organization_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  eventType: text("event_type"),
  format: formatEnum("format"),
  usingOrganizationAddress: boolean("using_organization_address").default(false),
  streetAddress: text("street_address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipCode: text("zip_code"),
  venueDetails: text("venue_details"),
  startDatetime: timestamp("start_datetime"),
  endDatetime: timestamp("end_datetime"),
  expectedAttendeesMin: integer("expected_attendees_min"),
  expectedAttendeesMax: integer("expected_attendees_max"),
  themes: text("themes").array(),
  audienceAge: audienceAgeEnum("audience_age").array(),
  communitySegments: text("community_segments").array(),
  audienceInterests: text("audience_interests").array(),
  hasFamousPeople: boolean("has_famous_people").default(false),
  eventWebsite: text("event_website"),
  famousPeople: jsonb("famous_people").array().$type<
    {
      name: string
      title: string
      profession: string
      instagram?: string
      website?: string
    }[]
  >(),
  isTicketed: boolean("is_ticketed").default(false),
  ticketCost: decimal("ticket_cost"),

  updatedBy: uuid("updated_by").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const eventsMediaTable = pgTable(
  "events_media",
  {
    eventId: uuid("event_id")
      .references(() => eventsTable.id, { onDelete: "cascade" })
      .notNull(),
    mediaId: uuid("media_id")
      .references(() => mediaTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.mediaId] })],
)

export const eventsMediaRelations = relations(eventsMediaTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [eventsMediaTable.eventId],
    references: [eventsTable.id],
  }),
  media: one(mediaTable, {
    fields: [eventsMediaTable.mediaId],
    references: [mediaTable.id],
  }),
}))

export const eventsRelations = relations(eventsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [eventsTable.organizationId],
    references: [organizationsTable.id],
  }),
  updatedByUser: one(usersTable, {
    fields: [eventsTable.updatedBy],
    references: [usersTable.id],
  }),
  media: many(eventsMediaTable),
}))
