import { verifyPhoneAuthSchema } from "@rally/schemas"
import { TRPCContext } from "../context"
import z from "zod"
import { TRPCError } from "@trpc/server"
import getUserInfo from "../user/getUserInfo"
import { and, db, eq, gte, phoneChallengeTable, sql, usersTable } from "@rally/db"

export default async function verifyPhoneAuth(
  ctx: TRPCContext,
  input: z.infer<typeof verifyPhoneAuthSchema>,
) {
  if (!ctx.user) {
    console.error("[verifyPhoneAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }
  const user = await getUserInfo(ctx)
  if (!user) {
    console.error("[verifyPhoneAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  const challenge = await db.query.phoneChallengeTable.findFirst({
    where: and(
      eq(phoneChallengeTable.userId, user.id),
      gte(phoneChallengeTable.expiresAt, new Date()),
    ),
  })
  if (!challenge) {
    console.error("[verifyPhoneAuth] Challenge not found or expired")
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Challenge not found or expired",
    })
  }

  const { data, error } = await ctx.supabase.auth.mfa.verify({
    challengeId: challenge.challengeId,
    factorId: challenge.factorId,
    code: input.code,
  })
  if (!data || error) {
    console.error("[verifyPhoneAuth] Failed to verify phone", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error?.message || "Failed to verify phone",
    })
  }
  await ctx.supabase.auth.updateUser({
    data: {
      is_phone_verified: true,
    },
  })
  await db.delete(phoneChallengeTable).where(eq(phoneChallengeTable.id, challenge.id))
}
