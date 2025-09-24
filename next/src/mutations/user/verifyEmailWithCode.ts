"use server"

import getUserInfo from "@/fetches/user/getUserInfo"
import createAdminClient from "@/utils/supabase/admin"
import { and, db, emailOTPTable, eq } from "@rally/db"

export default async function verifyEmailWithCode(code: string) {
  try {
    const client = await createAdminClient()
    const { data: userData, error: userError } = await getUserInfo()
    if (userError || !userData) {
      console.error("[verifyEmailWithCode] userError", userError)
      return { error: "User not found" }
    }

    const codeRow = await db.query.emailOTPTable.findFirst({
      where: and(eq(emailOTPTable.otp, code), eq(emailOTPTable.userId, userData.id)),
    })
    if (!codeRow) {
      console.error("[verifyEmailWithCode] codeRow not found")
      return { error: "Code not found" }
    }

    await Promise.all([
      db.delete(emailOTPTable).where(eq(emailOTPTable.userId, userData.id)),
      client.auth.admin.updateUserById(userData.id, {
        user_metadata: {
          is_email_verified: true,
        },
      }),
    ])

    return { error: null }
  } catch (error) {
    console.error("[verifyEmailWithCode] error", error)
    return { error: "An unknown error occurred" }
  }
}
