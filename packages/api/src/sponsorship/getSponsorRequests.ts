import { and, db, eq, sponsorRequestTable, SQLWrapper } from "@rally/db"
import { TRPCContext } from "../context"
import { z } from "zod"
import { getSponsorRequestsSchema } from "@rally/schemas"
import { TRPCError } from "@trpc/server"
import getUserInfo from "../user/getUserInfo"

export default async function getSponsorRequests(
  ctx: TRPCContext,
  input: z.infer<typeof getSponsorRequestsSchema>,
) {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  const { eventId } = input
  const user = await getUserInfo(ctx)
  if (!user || !user.organizationId || user.supabaseMetadata.organization_type !== "sponsor") {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  const andClauses: SQLWrapper[] = []
  if (eventId) {
    andClauses.push(eq(sponsorRequestTable.eventId, eventId))
  }
  if (user.organizationId) {
    andClauses.push(eq(sponsorRequestTable.sponsorOrganizationId, user.organizationId))
  }

  const sponsorRequest = await db.query.sponsorRequestTable.findMany({
    where: and(...andClauses),
  })
  return sponsorRequest
}
