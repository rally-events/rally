// this is temp, just for scaffolding

import {
  pgTable,
  uuid,
  varchar,
  boolean,
  jsonb,
  text,
} from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  profileData: jsonb("profile_data"),
  newCol: text("new_col"),
  newCol2: text("new_col2"),
})
