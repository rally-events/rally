import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { usersTable } from "./user-schema"

// Enums
export const organizationTypeEnum = pgEnum("organization_type", ["host", "sponsor"])
export const memberRoleEnum = pgEnum("member_role", ["owner", "member"])

// Main organizations table
export const organizationsTable = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: organizationTypeEnum("type").notNull(),

  // Contact & Social
  instagram: text("instagram"),
  tiktok: text("tiktok"),
  website: text("website"),
  contactEmail: text("contact_email").notNull(),

  // Address
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),

  // Agreements
  agreeToTerms: boolean("agree_to_terms").notNull().default(false),
  isUsBasedOrganization: boolean("is_us_based_organization").notNull().default(false),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Host-specific organization data
export const hostOrganizationsTable = pgTable("host_organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .unique(),
  hostOrganizationType: text("host_organization_type").notNull(),
  eventsPerYear: integer("events_per_year").notNull(),
})

// Sponsor-specific organization data
export const sponsorOrganizationsTable = pgTable("sponsor_organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .unique(),
  industry: text("industry").notNull(),
  employeeSize: text("employee_size").notNull(),
})

// Organization members junction table
export const organizationMembersTable = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  role: memberRoleEnum("role").notNull().default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
})

// Relations
export const organizationsRelations = relations(organizationsTable, ({ one, many }) => ({
  hostOrganization: one(hostOrganizationsTable, {
    fields: [organizationsTable.id],
    references: [hostOrganizationsTable.organizationId],
  }),
  sponsorOrganization: one(sponsorOrganizationsTable, {
    fields: [organizationsTable.id],
    references: [sponsorOrganizationsTable.organizationId],
  }),
  members: many(organizationMembersTable),
}))

export const hostOrganizationsRelations = relations(hostOrganizationsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [hostOrganizationsTable.organizationId],
    references: [organizationsTable.id],
  }),
}))

export const sponsorOrganizationsRelations = relations(sponsorOrganizationsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [sponsorOrganizationsTable.organizationId],
    references: [organizationsTable.id],
  }),
}))

export const organizationMembersRelations = relations(organizationMembersTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [organizationMembersTable.organizationId],
    references: [organizationsTable.id],
  }),
  user: one(usersTable, {
    fields: [organizationMembersTable.userId],
    references: [usersTable.id],
  }),
}))