import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { organizationsTable } from "./organization-schema"
import { relations } from "drizzle-orm"
import { mediaTable } from "./media-schema"

export const eventsTable = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: uuid("organization_id").references(() => organizationsTable.id),
  eventType: text("event_type").notNull(),
  format: text("format").notNull(),
  usingOrganizationAddress: boolean("using_organization_address").default(false),
  streetAddress: text("street_address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipCode: text("zip_code"),
  startDatetime: timestamp("start_datetime").notNull(),
  endDatetime: timestamp("end_datetime").notNull(),
  expectedAttendeesMin: integer("expected_attendees_min").notNull(),
  expectedAttendeesMax: integer("expected_attendees_max").notNull(),
  themes: jsonb("themes").notNull().$type<string[]>(),
  audienceAge: jsonb("audience_age").notNull().$type<string[]>(),
  communitySegments: jsonb("community_segments").$type<string[]>(),
  audienceInterests: jsonb("audience_interests").$type<string[]>(),
  hasFamousPeople: boolean("has_famous_people").default(false),
  famousPeople: jsonb("famous_people").$type<
    Array<{
      name: string
      title: string
      profession: string
      instagram?: string
      website?: string
    }>
  >(),
  isTicketed: boolean("is_ticketed").default(false),
  ticketCost: text("ticket_cost"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const eventsRelations = relations(eventsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [eventsTable.organizationId],
    references: [organizationsTable.id],
  }),
  media: many(mediaTable),
}))
