"use server"

import { signUpSchema } from "@/schemas/auth/login-schemas"
import z from "zod"
import sendVerificationEmail from "../email/sendVerificationEmail"
import { createClient } from "@/utils/supabase/server"

type SignupForm = z.infer<typeof signUpSchema>

export default async function registerUser(formData: SignupForm) {
  try {
    const { data, error, success } = signUpSchema.safeParse(formData)
    if (!success) {
      console.error("[registerUser] validatedData", error)
      return { error: error.message }
    }

    const supabase = await createClient()

    const { error: userError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          is_email_verified: false,
        },
      },
    })

    if (userError) {
      console.error("[registerUser] userError", userError)
      return { error: userError.message }
    }

    const { error: sendSignupEmailError } = await sendVerificationEmail(
      data.email
    )

    if (sendSignupEmailError) {
      console.error("[registerUser] sendSignupEmailError", sendSignupEmailError)
      return { error: sendSignupEmailError.toString() }
    }

    return { error: null }
  } catch (error) {
    console.error("[registerUser] error", error)
    return { error: "An unknown error occurred" }
  }
}
