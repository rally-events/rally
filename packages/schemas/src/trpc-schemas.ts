import { z } from "zod"

export const getUserInfoSchema = z
  .object({
    withOrganization: z.boolean().optional(),
    withOrganizationMembership: z.boolean().optional(),
    withSettings: z.boolean().optional(),
  })
  .optional()

export const getEventSchema = z.object({
  id: z.string(),
  withOrganization: z.boolean().optional(),
})
