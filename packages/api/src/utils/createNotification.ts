import { db, InferInsertModel, notificationsTable } from "@rally/db"

export default async function createNotification(
  data: InferInsertModel<typeof notificationsTable>,
) {
  return await db.insert(notificationsTable).values(data).returning()
}
