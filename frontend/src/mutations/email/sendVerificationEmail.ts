"use server"

import { Resend } from "resend"
import getPrivateEnv from "@/utils/getPrivateEnv"

import { db, eq, usersTable } from "@rally/db"
import generateOTP from "../user/generateOTP"
import { headers } from "next/headers"
import VerifyEmailTemplate from "../../../emails/verify-email-template"

const RESEND_API_KEY = getPrivateEnv("RESEND_API_KEY")

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set")
}

const resend = new Resend(RESEND_API_KEY)

export default async function sendVerificationEmail(email: string) {
  try {
    const headersList = await headers()
    const APP_URL =
      headersList.get("X-App-Url") || process.env.NEXT_PUBLIC_APP_URL!

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })

    if (!user) {
      console.error("[sendVerificationEmail] user not found")
      return { error: "User not found" }
    }

    const code = await generateOTP(user)
    if (!code) {
      console.error("[sendVerificationEmail] code not found")
      return { error: "Code not found" }
    }

    const { error } = await resend.emails.send({
      from: "Rally <onboarding@dominicclerici.com>",
      to: [email],
      subject: "Verify your email with Rally",
      react: VerifyEmailTemplate({
        firstName: user.firstName,
        lastName: user.lastName,
        code: code,
        baseUrl: APP_URL,
      }),
    })

    return { error }
  } catch (error) {
    console.error("[sendSignupEmail] error", error)
    return { error: "An unknown error occurred" }
  }
}
