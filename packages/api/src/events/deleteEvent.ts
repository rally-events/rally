import { db, eq, eventsTable } from "@rally/db"
import { TRPCContext } from "../context"
import { deleteEventSchema } from "@rally/schemas"
import z from "zod"
import { TRPCError } from "@trpc/server"
import getUserInfo from "../user/getUserInfo"

export default async function deleteEvent(
  ctx: TRPCContext,
  input: z.infer<typeof deleteEventSchema>,
) {
  const { id } = input

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  const [user, dbEvent] = await Promise.all([
    getUserInfo(ctx),
    db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, id),
    }),
  ])
  if (!user || !user.organizationId) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }
  if (!dbEvent) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }
  if (dbEvent.organizationId !== user.organizationId) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }

  await db.delete(eventsTable).where(eq(eventsTable.id, id))

  return { success: true }
}
