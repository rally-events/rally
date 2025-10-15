import { pgTable, uuid, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core"
import { usersTable } from "./users-schema"
import { organizationsTable } from "./organizations-schema"

export const notificationLevelEnum = pgEnum("notification_level", ["info", "warning", "error"])

export type NewSponsorshipRequestData = {
  type: "sponsorship_request_new"
  sponsorshipRequestId: string
  eventId: string
  eventName: string
  sponsorOrganizationId: string
  sponsorOrganizationName: string
}

export type UpdatedSponsorshipRequestData = {
  type: "sponsorship_request_updated"
  sponsorshipRequestId: string
  eventId: string
  eventName: string
  sponsorOrganizationId: string
  sponsorOrganizationName: string
}

export type NotificationData = NewSponsorshipRequestData | UpdatedSponsorshipRequestData

export const notificationsTable = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id),
  organizationId: uuid("organization_id").references(() => organizationsTable.id),
  data: jsonb("data").$type<NotificationData>().notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
