import { onboardingFormSchema } from "@rally/schemas"
import { TRPCContext } from "../context"
import z from "zod"
import { TRPCError } from "@trpc/server"
import { db } from "@rally/db"

export default async function getUserInfo(
  ctx: TRPCContext,
  input: z.infer<typeof onboardingFormSchema>,
) {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }
}
