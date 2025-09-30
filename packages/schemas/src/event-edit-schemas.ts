import z from "zod"

export const eventTypeOptions = [
  { value: "conference", label: "Conference" },
  { value: "festival", label: "Festival" },
  { value: "sports", label: "Sports" },
  { value: "esports", label: "Esports" },
  { value: "concert", label: "Concert" },
  { value: "trade-show", label: "Trade Show" },
  { value: "webinar", label: "Webinar" },
  { value: "workshop", label: "Workshop" },
  { value: "hackathon", label: "Hackathon" },
  { value: "meet-up", label: "Meet Up" },
  { value: "awards", label: "Awards" },
  { value: "gala", label: "Gala" },
  { value: "charity", label: "Charity" },
  { value: "b2b-field-event", label: "B2B Field Event" },
  { value: "university-event", label: "University Event" },
  { value: "virtual-summit", label: "Virtual Summit" },
  { value: "hybrid", label: "Hybrid" },
]

const eventTypeEnum = z.enum(eventTypeOptions.map((option) => option.value))

const formatEnum = z.enum(["in-person", "virtual", "hybrid"])

const audienceAgeEnum = z.enum(["under-18", "18-21", "22-30", "31-40", "41-50", "51-60", "over-60"])

const famousPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  profession: z.string().min(1, "Profession/industry is required"),
  instagram: z.string().url("Invalid Instagram URL").optional(),
  website: z.string().url("Invalid website URL").optional(),
})

const sixHoursFromNow = new Date(Date.now() + 6 * 60 * 60 * 1000)

export const eventEditSchema = z
  .object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required").max(255, "Name must not exceed 255 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(3000, "Description must not exceed 3000 characters"),
    eventType: eventTypeEnum,
    format: formatEnum,
    usingOrganizationAddress: z.boolean().default(false),
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    startDatetime: z.date().min(sixHoursFromNow, "Start time must be at least 6 hours from now"),
    endDatetime: z.date(),
    expectedAttendees: z.object({
      min: z.number().int().positive("Minimum attendees must be positive"),
      max: z.number().int().positive("Maximum attendees must be positive"),
    }),
    themes: z.array(z.string()).min(1, "At least one theme/topic is required"),
    audienceAge: z.array(audienceAgeEnum).min(1, "At least one age group is required"),
    communitySegments: z.array(z.string()).min(1, "At least one community segment is required"),
    audienceInterests: z.array(z.string()).min(1, "At least one interest is required"),
    hasFamousPeople: z.boolean(),
    famousPeople: z.array(famousPersonSchema),
    isTicketed: z.boolean(),
    ticketCost: z
      .union([z.number().positive("Ticket cost must be positive"), z.literal("other")])
      .optional(),
    mediaIds: z.object({
      images: z.array(z.string().uuid()).max(10, "Maximum 10 images allowed"),
      video: z.string().uuid().optional(),
    }).optional(),
  })
  .superRefine((data, ctx) => {
    // Validate end datetime is at least 15 minutes after start
    const fifteenMinutesAfterStart = new Date(data.startDatetime.getTime() + 15 * 60 * 1000)
    if (data.endDatetime < fifteenMinutesAfterStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be at least 15 minutes after start time",
        path: ["endDatetime"],
      })
    }

    // Validate expectedAttendees max >= min
    if (data.expectedAttendees.max < data.expectedAttendees.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum attendees must be greater than or equal to minimum attendees",
        path: ["expectedAttendees", "max"],
      })
    }

    // Address fields only required if NOT virtual
    if (data.format !== "virtual") {
      if (!data.streetAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Street address is required for in-person and hybrid events",
          path: ["streetAddress"],
        })
      }
    }

    // If famous people are attending, must have at least one
    if (data.hasFamousPeople && data.famousPeople.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one famous person must be listed if famous people are attending",
        path: ["famousPeople"],
      })
    }

    // If ticketed, must have ticket cost
    if (data.isTicketed && !data.ticketCost) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ticket cost is required for ticketed events",
        path: ["ticketCost"],
      })
    }
  })

export const eventEditOptionalSchema = z
  .object({
    name: z.string().max(255, "Name must not exceed 255 characters").optional(),
    description: z.string().max(3000, "Description must not exceed 3000 characters").optional(),
    eventType: eventTypeEnum.optional(),
    format: formatEnum.optional(),
    themes: z.array(z.string()).optional(),
    usingOrganizationAddress: z.boolean().optional(),
    streetAddress: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    startDatetime: z
      .date()
      .min(sixHoursFromNow, "Start time must be at least 6 hours from now")
      .optional(),
    endDatetime: z.date().optional(),
    expectedAttendees: z
      .object({
        min: z.number().int().positive("Minimum attendees must be positive"),
        max: z.number().int().positive("Maximum attendees must be positive"),
      })
      .optional(),
    audienceAge: z.array(audienceAgeEnum).optional(),
    communitySegments: z.array(z.string()).optional(),
    audienceInterests: z.array(z.string()).optional(),
    hasFamousPeople: z.boolean().optional(),
    famousPeople: z.array(famousPersonSchema).optional(),
    isTicketed: z.boolean().optional(),
    ticketCost: z
      .union([z.number().positive("Ticket cost must be positive"), z.literal("other")])
      .optional(),
    mediaIds: z.object({
      images: z.array(z.string().uuid()).max(10, "Maximum 10 images allowed"),
      video: z.string().uuid().optional(),
    }).optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate if both dates are provided
    if (data.startDatetime && data.endDatetime) {
      const fifteenMinutesAfterStart = new Date(data.startDatetime.getTime() + 15 * 60 * 1000)
      if (data.endDatetime < fifteenMinutesAfterStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be at least 15 minutes after start time",
          path: ["endDatetime"],
        })
      }
    }

    // Validate expectedAttendees if provided
    if (data.expectedAttendees && data.expectedAttendees.max < data.expectedAttendees.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum attendees must be greater than or equal to minimum attendees",
        path: ["expectedAttendees", "max"],
      })
    }

    // Address validation for non-virtual events (only if format is provided)
    if (data.format && data.format !== "virtual") {
      if (data.streetAddress !== undefined && !data.streetAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Street address is required for in-person and hybrid events",
          path: ["streetAddress"],
        })
      }
    }

    // Famous people validation (only if hasFamousPeople is provided)
    if (data.hasFamousPeople && data.famousPeople && data.famousPeople.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one famous person must be listed if famous people are attending",
        path: ["famousPeople"],
      })
    }

    // Ticket cost validation (only if isTicketed is provided)
    if (data.isTicketed && data.ticketCost === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ticket cost is required for ticketed events",
        path: ["ticketCost"],
      })
    }
  })
