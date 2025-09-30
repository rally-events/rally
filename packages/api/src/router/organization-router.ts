import { router, publicProcedure } from "../trpc"
import createOrganization from "../organization/createOrganization"
import { onboardingFormSchema } from "@rally/schemas"

export const organizationRouter = router({
  createOrganization: publicProcedure
    .input(onboardingFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await createOrganization(ctx, input)
    }),
})
