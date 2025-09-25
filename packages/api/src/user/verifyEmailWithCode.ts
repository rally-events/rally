"use server"

import { and, db, emailOTPTable, eq } from "@rally/db"
import createAdminClient from "../utils/create-admin-client"
import getUserInfo from "./getUserInfo"
import { Context } from "../context"
import { TRPCError } from "@trpc/server"

export default async function verifyEmailWithCode(ctx: Context, code: string) {
  const client = createAdminClient()
  const userData = await getUserInfo(ctx)
  if (!userData) {
    console.error("[verifyEmailWithCode] userData not found")
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  const codeRow = await db.query.emailOTPTable.findFirst({
    where: and(eq(emailOTPTable.otp, code), eq(emailOTPTable.userId, userData.id)),
  })
  if (!codeRow) {
    console.error("[verifyEmailWithCode] codeRow not found")
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Incorrect code",
    })
  }

  await Promise.all([
    db.delete(emailOTPTable).where(eq(emailOTPTable.userId, userData.id)),
    client.auth.admin.updateUserById(userData.id, {
      user_metadata: {
        is_email_verified: true,
      },
    }),
  ])

  return true
}
