// this is temp, just for scaffolding

import { pgTable, uuid, text, timestamp, pgSchema } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

const authSchema = pgSchema("auth")
export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
})

export const usersTable = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  organizationId: uuid("organization_id").references(() => organizationsTable.id),
})

export const emailOTPTable = pgTable("email_otp", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id),
  otp: text("otp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const usersRelations = relations(usersTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [usersTable.organizationId],
    references: [organizationsTable.id],
  }),
  organizationMembership: one(organizationMembersTable, {
    fields: [usersTable.id],
    references: [organizationMembersTable.userId],
  }),
}))

// This import is placed here to avoid circular dependency issues
// It will be resolved when the schema is loaded
import { organizationMembersTable, organizationsTable } from "./organization-schema"
