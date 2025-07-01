import { z } from "zod"

export const waitlistSchema = z.object({
  isHost: z.boolean(),
  email: z.string().email(),
  name: z.string().min(1),
  organization: z.string().min(1),
})
