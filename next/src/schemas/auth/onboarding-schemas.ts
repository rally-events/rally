import z from "zod"

export const onboardingStep1Schema = z.object({
  hostOrSponsor: z.enum(["host", "sponsor", ""]).refine((val) => val !== "", {
    message: "You must select either host or sponsor",
  }),
  companyCategory: z
    .enum([
      "technology",
      "finance",
      "healthcare",
      "education",
      "retail",
      "real estate",
      "other",
      "",
    ])
    .refine((val) => val !== "", {
      message: "You must select a company category",
    }), // for hosts, this is like club/frat/team, for sponsors, this is like tech/finance/healthcare
})

export const fullOptionalSchema = z.object({
  hostOrSponsor: z.enum(["host", "sponsor", ""]),
  companyCategory: z.enum([
    "technology",
    "finance",
    "healthcare",
    "education",
    "retail",
    "real estate",
    "other",
    "",
  ]),
})
