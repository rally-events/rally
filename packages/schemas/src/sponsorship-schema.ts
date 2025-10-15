import { z } from "zod"

export const createSponsorRequestSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  description: z.string().optional(),
  dollarAmount: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
})
