import { TRPCContext } from "../context"
import { db, eventsTable } from "@rally/db"
import { eq } from "drizzle-orm"
import { getEventSchema } from "@rally/schemas"
import z from "zod"
import { TRPCError } from "@trpc/server"

export default async function getEvent(ctx: TRPCContext, input: z.infer<typeof getEventSchema>) {
  if (!ctx.user) {
    console.error("[API/getEvent] User not found")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }
  if (!ctx.user.user_metadata.organization_type) {
    console.error("[API/getEvent] User is not a host")
    throw new TRPCError({
      code: "FORBIDDEN",
    })
  }

  const event = await db.query.eventsTable.findFirst({
    where: eq(eventsTable.id, input.id),
    with: {
      organization: input.withOrganization ? true : undefined,
      media: input.withMedia ? true : undefined,
      updatedByUser: true,
      // updatedByUser: input.withUpdatedByUser ? true : undefined,
    },
  })

  console.log(event!.updatedByUser) // prints full obj, but ts thinks its only {id: string}

  return event
}
