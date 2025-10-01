import { protectedProcedure, router } from "../trpc"
import createEvent from "../events/createEvent"
import { eventEditOptionalSchema, getEventSchema } from "@rally/schemas"
import getEvent from "../events/getEvent"
import updateEvent from "../events/updateEvent"

export const eventRouter = router({
  createEvent: protectedProcedure.mutation(async ({ ctx }) => await createEvent(ctx)),
  getEvent: protectedProcedure
    .input(getEventSchema)
    .query(async ({ ctx, input }) => await getEvent(ctx, input)),
  updateEvent: protectedProcedure
    .input(eventEditOptionalSchema)
    .mutation(async ({ ctx, input }) => await updateEvent(ctx, input)),
})
