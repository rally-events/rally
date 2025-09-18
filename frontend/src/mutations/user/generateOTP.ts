import { db, emailOTPTable, eq, InferSelectModel, usersTable } from "@rally/db"

export default async function generateOTP(user: InferSelectModel<typeof usersTable>) {
  try {
    // generate a random 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // delete any existing codes for the user
    await db.delete(emailOTPTable).where(eq(emailOTPTable.userId, user.id))

    await db.insert(emailOTPTable).values({
      userId: user.id,
      otp: code,
    })

    return code
  } catch (error) {
    console.error("[generateOTP] error", error)
    return null
  }
}
