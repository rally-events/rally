import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .regex(
    /^(?=.*[A-Z])(?=.*\d).*$/,
    "Must have at least 1 capital letter and 1 number"
  )

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
})

export { signInSchema }
