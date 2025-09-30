import { protectedProcedure, router } from "../trpc"
import createEvent from "../events/createEvent"
import { getEventSchema } from "@rally/schemas"
import getEvent from "../events/getEvent"

export const eventRouter = router({
  createEvent: protectedProcedure.mutation(async ({ ctx }) => await createEvent(ctx)),
  getEvent: protectedProcedure
    .input(getEventSchema)
    .query(async ({ ctx, input }) => await getEvent(ctx, input)),
})
