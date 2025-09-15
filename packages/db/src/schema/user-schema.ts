// this is temp, just for scaffolding

import { pgTable, uuid, text, timestamp, pgSchema } from "drizzle-orm/pg-core"

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
})

export const emailOTPTable = pgTable("email_otp", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id),
  otp: text("otp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
