import { z } from "zod"

export const getUserInfoSchema = z
  .object({
    withOrganization: z.boolean().optional(),
    withOrganizationMembership: z.boolean().optional(),
    withSettings: z.boolean().optional(),
    withNotifications: z.boolean().optional(),
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
  startDateRange: z.coerce.date().optional() as z.ZodOptional<z.ZodDate>,
  endDateRange: z.coerce.date().optional() as z.ZodOptional<z.ZodDate>,
  format: z.array(z.enum(["in-person", "virtual", "hybrid", "unspecified"])).optional(),
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

export const deleteEventSchema = z.object({
  id: z.string(),
})

export const getSponsorRequestsSchema = z
  .object({
    eventId: z.string().optional(),
    organizationId: z.string().optional(),
  })
  .refine((data) => data.eventId || data.organizationId, {
    message: "Either eventId or organizationId is required",
  })

export const createNotificationSchema = z
  .object({
    title: z.string(),
    body: z.string(),
    userId: z.string().optional(),
    organizationId: z.string().optional(),
  })
  .refine((data) => data.userId || data.organizationId, {
    message: "Either userId or organizationId is required",
  })

export const updateUserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export const addPhoneAuthSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
})

export const verifyPhoneAuthSchema = z.object({
  code: z.string().min(1, "Code is required"),
})
