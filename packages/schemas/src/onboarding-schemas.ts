import { z } from "zod"

export const organizationTypeSchema = z.enum(["host", "sponsor", ""]).refine((val) => val !== "", {
  message: "Organization type is required",
})

export const hostOrganizationTypes = [
  { id: "fraternity", label: "Fraternity" },
  { id: "sorority", label: "Sorority" },
  { id: "club", label: "Club" },
  { id: "society", label: "Society" },
  { id: "student_org", label: "Student Organization" },
  { id: "nonprofit", label: "Nonprofit" },
  { id: "other", label: "Other" },
] as const

export const sponsorIndustries = [
  { id: "technology", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "retail", label: "Retail" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "consulting", label: "Consulting" },
  { id: "media", label: "Media & Entertainment" },
  { id: "food_beverage", label: "Food & Beverage" },
  { id: "other", label: "Other" },
] as const

export const employeeSizeRanges = [
  { id: "1-10", label: "1-10 employees" },
  { id: "11-50", label: "11-50 employees" },
  { id: "51-200", label: "51-200 employees" },
  { id: "201-500", label: "201-500 employees" },
  { id: "501-1000", label: "501-1000 employees" },
  { id: "1000+", label: "1000+ employees" },
] as const

export const onboardingStep1Schema = z.object({
  organizationType: organizationTypeSchema,
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .max(255, "Organization name must not exceed 255 characters"),
})

export const onboardingStep2HostSchema = z.object({
  hostOrganizationType: z.enum([...hostOrganizationTypes.map((t) => t.id), ""], {
    message: "Organization type is required",
  }),
  eventsPerYear: z.coerce
    .number({ message: "Number of events is required" })
    .min(1, "Number of events must be 1 or more")
    .max(100000, "Number of events must be less than 100000") as z.ZodNumber,
})

export const onboardingStep2SponsorSchema = z.object({
  industry: z.enum([...sponsorIndustries.map((i) => i.id), ""], {
    message: "Industry is required",
  }),
  employeeSize: z.enum([...employeeSizeRanges.map((s) => s.id), ""], {
    message: "Employee size is required",
  }),
})

export const onboardingStep3Schema = z.object({
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address must not exceed 500 characters"),
  city: z.string().min(1, "City is required").max(100, "City must not exceed 100 characters"),
  state: z.string().min(1, "State is required").max(100, "State must not exceed 100 characters"),
  zipCode: z
    .string()
    .min(1, "Zip code is required")
    .max(20, "Zip code must not exceed 20 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must not exceed 100 characters"),
})

export const onboardingStep4Schema = z.object({
  instagram: z
    .string()
    .max(255, "Instagram handle must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  tiktok: z
    .string()
    .max(255, "TikTok handle must not exceed 255 characters")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please enter a valid website URL")
    .max(500, "Website URL must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Contact email is required"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms of service and privacy policy",
  }),
  isUsBasedOrganization: z.boolean().refine((val) => val === true, {
    message: "Your organization must be based in the United States",
  }),
})

export const onboardingFormSchema = z.discriminatedUnion("organizationType", [
  z.object({
    ...onboardingStep1Schema.shape,
    ...onboardingStep2HostSchema.shape,
    ...onboardingStep3Schema.shape,
    ...onboardingStep4Schema.shape,
    organizationType: z.literal("host"),
  }),
  z.object({
    ...onboardingStep1Schema.shape,
    ...onboardingStep2SponsorSchema.shape,
    ...onboardingStep3Schema.shape,
    ...onboardingStep4Schema.shape,
    organizationType: z.literal("sponsor"),
  }),
])

// TODO: Make this a .partial() with zod
export const onboardingFormOptionalSchema = z
  .object({
    organizationType: organizationTypeSchema.optional(),
    organizationName: z
      .string()
      .max(255, "Organization name must not exceed 255 characters")
      .optional(),
    hostOrganizationType: z.enum([...hostOrganizationTypes.map((t) => t.id), ""]).optional(),
    eventsPerYear: z.coerce.number().max(100000).optional(),
    industry: z.enum([...sponsorIndustries.map((i) => i.id), ""]).optional(),
    employeeSize: z.enum([...employeeSizeRanges.map((s) => s.id), ""]).optional(),
    address: z.string().max(500, "Address must not exceed 500 characters").optional(),
    city: z.string().max(100, "City must not exceed 100 characters").optional(),
    state: z.string().max(100, "State must not exceed 100 characters").optional(),
    zipCode: z.string().max(20, "Zip code must not exceed 20 characters").optional(),
    country: z.string().max(100, "Country must not exceed 100 characters").optional(),
    instagram: z.string().max(255, "Instagram handle must not exceed 255 characters").optional(),
    tiktok: z.string().max(255, "TikTok handle must not exceed 255 characters").optional(),
    website: z.string().max(500, "Website URL must not exceed 500 characters").optional(),
    contactEmail: z.string().max(255, "Contact email must not exceed 255 characters").optional(),
    agreeToTerms: z.boolean().optional(),
    isUsBasedOrganization: z.boolean().optional(),
  })
  .optional()
