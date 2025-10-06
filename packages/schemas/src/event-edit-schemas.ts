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

export const formatOptions = ["in-person", "virtual", "hybrid"]

const eventTypeEnum = z.enum(eventTypeOptions.map((option) => option.value))

const formatEnum = z.enum([...formatOptions, ""])

export const ageOptions = ["under-18", "18-21", "22-30", "31-40", "41-50", "51-60", "over-60"]

const audienceAgeEnum = z.enum([...ageOptions])

const famousPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  profession: z.string().min(1, "Profession/industry is required"),
  instagram: z.url("Invalid Instagram URL").optional(),
  website: z.url("Invalid website URL").optional(),
})

const sixHoursFromNow = new Date(Date.now() + 6 * 60 * 60 * 1000)

export const eventEditSchema = z
  .object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required").max(255, "Name must not exceed 255 characters"),
    description: z.string().max(3000, "Description must not exceed 3000 characters"),
    eventType: eventTypeEnum,
    format: formatEnum.refine((val) => val !== "", "Format is required"),
    usingOrganizationAddress: z.boolean().default(false),
    streetAddress: z.string().max(500, "Street address must be 500 characters or less"),
    city: z.string().max(255, "City must not exceed 255 characters"),
    state: z.string().max(2, "State must be 2 characters"), // TODO: Make this a state code enum
    country: z.string().max(255, "Country must be 255 characters or less"),
    zipCode: z.string().max(20, "Zip code must be 20 characters or less"),
    venueDetails: z.string().max(2000, "Venue details must not exceed 2000 characters"),
    startDatetime: z.date().min(sixHoursFromNow, "Start time must be at least 6 hours from now"),
    endDatetime: z.date(),
    expectedAttendees: z.object({
      min: z.number().int().positive("Minimum attendees must be positive"),
      max: z.number().int().positive("Maximum attendees must be positive"),
    }),
    themes: z.array(z.string()).min(1, "At least one theme/topic is required"),
    audienceAge: z.array(audienceAgeEnum).min(1, "At least one age group is required"),
    communitySegments: z.array(
      z
        .string()
        .min(1, "Community segment is required")
        .max(255, "Community segment must not exceed 255 characters"),
    ),
    audienceInterests: z.array(
      z.string().min(1, "Interest is required").max(255, "Interest must not exceed 255 characters"),
    ),
    hasFamousPeople: z.boolean().default(false),
    famousPeople: z.array(famousPersonSchema),
    eventWebsite: z.url("Invalid website URL").optional().nullable(),
    isTicketed: z.boolean().default(false),
    ticketCost: z
      .union([z.number().positive("Ticket cost must be positive"), z.literal("other")])
      .optional(),
    mediaIds: z
      .object({
        images: z.array(z.string().uuid()).max(10, "Maximum 10 images allowed"),
        video: z.string().uuid().optional(),
        poster: z.string().uuid().optional(),
        pdfs: z.array(z.string().uuid()).max(5, "Maximum 5 PDFs allowed"),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validate end datetime is at least 15 minutes after start
    const fifteenMinutesAfterStart = new Date(data.startDatetime.getTime() + 15 * 60 * 1000)
    if (data.endDatetime < fifteenMinutesAfterStart) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be at least 15 minutes after start time",
        path: ["endDatetime"],
      })
    }

    // Validate expectedAttendees max >= min
    if (data.expectedAttendees.max < data.expectedAttendees.min) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum attendees must be greater than or equal to minimum attendees",
        path: ["expectedAttendees", "max"],
      })
    }

    // Address fields only required if NOT virtual
    if (data.format !== "virtual") {
      if (!data.streetAddress || !data.city || !data.state || !data.country || !data.zipCode) {
        const path = []
        if (!data.streetAddress) path.push("streetAddress")
        if (!data.city) path.push("city")
        if (!data.state) path.push("state")
        if (!data.country) path.push("country")
        if (!data.zipCode) path.push("zipCode")
        ctx.addIssue({
          code: "custom",
          message: `Full address is required for ${data.format} events`,
          path: path,
        })
      }
    }

    // If famous people are attending, must have at least one
    if (data.hasFamousPeople && data.famousPeople.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one famous person must be listed if famous people are attending",
        path: ["famousPeople"],
      })
    }

    // If ticketed, must have ticket cost
    if (data.isTicketed && !data.ticketCost) {
      ctx.addIssue({
        code: "custom",
        message: "Ticket cost is required for ticketed events",
        path: ["ticketCost"],
      })
    }
  })

export const eventEditOptionalSchema = z
  .object({
    id: z.string().min(1, "ID is required"),
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
    venueDetails: z
      .string()
      .max(2000, "Venue details must not exceed 2000 characters")
      .optional()
      .nullable(),
    startDatetime: z.coerce
      .date()
      .min(sixHoursFromNow, "Start time must be at least 6 hours from now")
      .optional() as z.ZodOptional<z.ZodDate>,
    endDatetime: z.coerce.date().optional() as z.ZodOptional<z.ZodDate>,
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
    eventWebsite: z.url("Invalid website URL").optional().nullable(),
    isTicketed: z.boolean().optional(),
    ticketCost: z
      .union([z.number().positive("Ticket cost must be positive"), z.literal("other")])
      .optional(),
    mediaIds: z
      .object({
        images: z.array(z.string().uuid()).max(10, "Maximum 10 images allowed"),
        video: z.string().uuid().optional(),
        poster: z.string().uuid().optional(),
        pdfs: z.array(z.string().uuid()).max(5, "Maximum 5 PDFs allowed"),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate if both dates are provided
    if (data.startDatetime && data.endDatetime) {
      const fifteenMinutesAfterStart = new Date(data.startDatetime.getTime() + 15 * 60 * 1000)
      if (data.endDatetime < fifteenMinutesAfterStart) {
        ctx.addIssue({
          code: "custom",
          message: "End time must be at least 15 minutes after start time",
          path: ["endDatetime"],
        })
      }
    }

    // Validate expectedAttendees if provided
    if (data.expectedAttendees && data.expectedAttendees.max < data.expectedAttendees.min) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum attendees must be greater than or equal to minimum attendees",
        path: ["expectedAttendees", "max"],
      })
    }

    // Address validation for non-virtual events (only if format is provided)
    if (data.format && data.format !== "virtual") {
      if (data.streetAddress !== undefined && !data.streetAddress) {
        ctx.addIssue({
          code: "custom",
          message: "Street address is required for in-person and hybrid events",
          path: ["streetAddress"],
        })
      }
    }

    // Famous people validation (only if hasFamousPeople is provided)
    if (data.hasFamousPeople && data.famousPeople && data.famousPeople.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one famous person must be listed if famous people are attending",
        path: ["famousPeople"],
      })
    }

    // Ticket cost validation (only if isTicketed is provided)
    if (data.isTicketed && data.ticketCost === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Ticket cost is required for ticketed events",
        path: ["ticketCost"],
      })
    }
  })
