import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { organizationsTable } from "./organization-schema"
import { relations } from "drizzle-orm"

export const eventsTable = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  organizationId: uuid("organization_id").references(() => organizationsTable.id),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const eventsRelations = relations(eventsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [eventsTable.organizationId],
    references: [organizationsTable.id],
  }),
}))
