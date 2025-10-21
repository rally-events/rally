// this is temp, just for scaffolding
import { organizationMembersTable, organizationsTable } from "./organizations-schema"
import { pgTable, uuid, text, timestamp, pgSchema } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { notificationsTable } from "./notifications-schema"

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

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [usersTable.organizationId],
    references: [organizationsTable.id],
  }),
  organizationMembership: one(organizationMembersTable, {
    fields: [usersTable.id],
    references: [organizationMembersTable.userId],
  }),
  notifications: many(notificationsTable),
  phoneChallenge: one(phoneChallengeTable, {
    fields: [usersTable.id],
    references: [phoneChallengeTable.userId],
  }),
  authenticatorChallenge: one(authenticatorChallengeTable, {
    fields: [usersTable.id],
    references: [authenticatorChallengeTable.userId],
  }),
}))

export const phoneChallengeTable = pgTable("phone_challenge", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  factorId: text("factor_id").notNull(),
  challengeId: text("challenge_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
})

export const phoneChallengeRelations = relations(phoneChallengeTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [phoneChallengeTable.userId],
    references: [usersTable.id],
  }),
}))

export const authenticatorChallengeTable = pgTable("authenticator_challenge", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  factorId: text("factor_id").notNull(),
  qrCode: text("qr_code").notNull(),
  secret: text("secret").notNull(),
  uri: text("uri").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
})

export const authenticatorChallengeRelations = relations(authenticatorChallengeTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [authenticatorChallengeTable.userId],
    references: [usersTable.id],
  }),
}))
