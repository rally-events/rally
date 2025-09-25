import { z } from "zod"

export const organizationTypeSchema = z.enum(["host", "sponsor", ""]).refine((val) => val !== "", {
  message: "Organization type is required",
})

export const onboardingStep1Schema = z.object({
  organizationType: organizationTypeSchema,
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .max(255, "Organization name must not exceed 255 characters"),
})

export const onboardingFormSchema = z.object({
  ...onboardingStep1Schema.shape,
})

export const onboardingFormOptionalSchema = z
  .object({
    organizationType: organizationTypeSchema.optional(),
    organizationName: z
      .string()
      .max(255, "Organization name must not exceed 255 characters")
      .optional(),
  })
  .optional()
