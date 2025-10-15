import { protectedProcedure, router } from "../trpc"
import { createSponsorRequestSchema, getSponsorRequestsSchema } from "@rally/schemas"
import createSponsorRequest from "../sponsorship/createSponsorRequest"
import getSponsorRequests from "../sponsorship/getSponsorRequests"

export const sponsorshipRouter = router({
  createSponsorRequest: protectedProcedure
    .input(createSponsorRequestSchema)
    .mutation(async ({ ctx, input }) => await createSponsorRequest(ctx, input)),
  getSponsorRequests: protectedProcedure
    .input(getSponsorRequestsSchema)
    .query(async ({ ctx, input }) => await getSponsorRequests(ctx, input)),
})
