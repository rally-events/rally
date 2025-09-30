import { router, protectedProcedure } from "../trpc"
import createOrganization from "../organization/createOrganization"
import { onboardingFormSchema } from "@rally/schemas"

export const organizationRouter = router({
  createOrganization: protectedProcedure
    .input(onboardingFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await createOrganization(ctx, input)
    }),
})
