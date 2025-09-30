import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { eventsTable } from "./events-schema"
import { organizationsTable } from "./organization-schema"
import { usersTable } from "./user-schema"
import { relations } from "drizzle-orm"

export const mediaTable = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  eventId: uuid("event_id").references(() => eventsTable.id),
  organizationId: uuid("organization_id")
    .references(() => organizationsTable.id)
    .notNull(),
  r2FileKey: text("r2_file_key").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedBy: uuid("uploaded_by")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const mediaRelations = relations(mediaTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [mediaTable.eventId],
    references: [eventsTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [mediaTable.organizationId],
    references: [organizationsTable.id],
  }),
  user: one(usersTable, {
    fields: [mediaTable.uploadedBy],
    references: [usersTable.id],
  }),
}))
