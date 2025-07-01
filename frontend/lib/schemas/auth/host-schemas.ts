import { z } from "zod"

const organizationSetupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hostType: z.string().min(1, "Host type is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  country: z.string().min(1, "Country is required"),
  agreedToBeingInUnitedStates: z.boolean().refine((val) => val, {
    message: "Your organization must operate in the United States",
  }),
})

const fullHostSchema = z.object({
  ...organizationSetupSchema.shape,
})

export { organizationSetupSchema, fullHostSchema }
