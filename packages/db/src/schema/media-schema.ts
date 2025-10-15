import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { eventsMediaTable } from "./events-schema"
import { organizationsTable } from "./organizations-schema"
import { usersTable } from "./users-schema"
import { relations } from "drizzle-orm"

export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "poster", "pdf"])
export const aspectRatioEnum = pgEnum("aspect_ratio", ["1:1", "4:5", "5:4"])

export const mediaTable = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizationsTable.id)
    .notNull(),
  r2FileKey: text("r2_file_key").notNull(),
  fileSize: integer("file_size").notNull(),
  blurhash: text("blurhash"),
  mimeType: text("mime_type").notNull(),
  fileName: text("file_name").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  aspectRatio: aspectRatioEnum("aspect_ratio"),
  uploadedBy: uuid("uploaded_by")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const mediaRelations = relations(mediaTable, ({ one, many }) => ({
  events: many(eventsMediaTable),
  organization: one(organizationsTable, {
    fields: [mediaTable.organizationId],
    references: [organizationsTable.id],
  }),
  user: one(usersTable, {
    fields: [mediaTable.uploadedBy],
    references: [usersTable.id],
  }),
}))
