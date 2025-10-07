import { protectedProcedure, router } from "../trpc"
import createEvent from "../events/createEvent"
import {
  deleteEventSchema,
  eventEditOptionalSchema,
  getEventSchema,
  searchEventsSchema,
} from "@rally/schemas"
import updateEvent from "../events/updateEvent"
import getEvent from "../events/getEvent"
import searchEvents from "../events/searchEvents"
import deleteEvent from "../events/deleteEvent"

export const eventRouter = router({
  createEvent: protectedProcedure.mutation(async ({ ctx }) => await createEvent(ctx)),
  getEvent: protectedProcedure
    .input(getEventSchema)
    .query(async ({ ctx, input }) => await getEvent(ctx, input)),

  updateEvent: protectedProcedure
    .input(eventEditOptionalSchema)
    .mutation(async ({ ctx, input }) => await updateEvent(ctx, input)),
  searchEvents: protectedProcedure
    .input(searchEventsSchema)
    .query(async ({ ctx, input }) => await searchEvents(ctx, input)),
  deleteEvent: protectedProcedure
    .input(deleteEventSchema)
    .mutation(async ({ ctx, input }) => await deleteEvent(ctx, input)),
})
