import { TRPCError } from "@trpc/server"
import { TRPCContext } from "../context"
import getUserInfo from "../user/getUserInfo"
import { db, eventsTable, eq, sql } from "@rally/db"

export default async function getEventStats(ctx: TRPCContext) {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  const user = await getUserInfo(ctx)
  if (!user || !user.organizationId || user.supabaseMetadata.organization_type !== "host") {
    throw new TRPCError({ code: "FORBIDDEN" })
  }

  const now = new Date()

  const [totalCountResult, upcomingCountResult] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(eventsTable)
      .where(eq(eventsTable.organizationId, user.organizationId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(eventsTable)
      .where(
        sql`${eventsTable.organizationId} = ${user.organizationId} AND ${eventsTable.startDatetime} > ${now.toISOString()}`,
      ),
  ])

  return {
    totalCount: totalCountResult[0]?.count ?? 0,
    upcomingCount: upcomingCountResult[0]?.count ?? 0,
  }
}
