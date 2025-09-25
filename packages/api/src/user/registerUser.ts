import { signUpSchema } from "@rally/schemas"
import z from "zod"
import { Context } from "../context"
import { TRPCError } from "@trpc/server"

export default async function registerUser(ctx: Context, formData: z.infer<typeof signUpSchema>) {
  const { error: userError } = await ctx.supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        is_phone_verified: false,
        is_email_verified: false,
        is_onboarded: false,
        is_admin: false,
      },
    },
  })

  if (userError) {
    console.error("[registerUser] supabase failed to create user", userError)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: userError.message,
    })
  }
}
