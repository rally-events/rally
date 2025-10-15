import { decimal, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { eventsTable } from "./events-schema"
import { relations } from "drizzle-orm"
import { organizationsTable } from "./organizations-schema"

export const sponsorRequestStatusEnum = pgEnum("sponsor_request_status", [
  "pending",
  "approved",
  "revised",
  "rejected",
])

export const sponsorRequestTable = pgTable("sponsorship_requests", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  eventId: uuid("event_id")
    .references(() => eventsTable.id, { onDelete: "cascade" })
    .notNull(),
  status: sponsorRequestStatusEnum("status").notNull().default("pending"),
  sponsorOrganizationId: uuid("sponsor_organization_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  hostOrganizationId: uuid("host_organization_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  revisionCount: integer("revision_count").notNull().default(0),
  description: text("description"),
  dollarAmount: decimal("dollar_amount"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const sponsorRequestRelations = relations(sponsorRequestTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [sponsorRequestTable.eventId],
    references: [eventsTable.id],
  }),
  sponsorOrganization: one(organizationsTable, {
    fields: [sponsorRequestTable.sponsorOrganizationId],
    references: [organizationsTable.id],
  }),
  hostOrganization: one(organizationsTable, {
    fields: [sponsorRequestTable.hostOrganizationId],
    references: [organizationsTable.id],
  }),
}))
