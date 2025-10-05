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
  withMedia: z.boolean().optional(),
  withUpdatedByUser: z.boolean().optional(),
})

export const searchEventsSchema = z.object({
  organizationId: z.string().optional(),
  limit: z.number().optional().default(12),
  page: z.number().optional().default(0),
  startDateRange: z.date().optional(),
  endDateRange: z.date().optional(),
  format: z.array(z.enum(["in-person", "virtual", "hybrid"])).optional(),
  expectedAttendeesMin: z.coerce
    .number()
    .min(0)
    .max(999999999999)
    .optional() as z.ZodOptional<z.ZodNumber>,
  expectedAttendeesMax: z.coerce
    .number()
    .min(0)
    .max(999999999999)
    .optional() as z.ZodOptional<z.ZodNumber>,
  eventNameQuery: z.string().optional(),
  sortBy: z
    .enum([
      "name",
      "startDatetime",
      "endDatetime",
      "duration",
      "expectedAttendeesMin",
      "expectedAttendeesMax",
      "isTicketed",
      "createdAt",
      "updatedAt",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})
