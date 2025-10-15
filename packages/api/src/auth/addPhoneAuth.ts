import { TRPCError } from "@trpc/server"
import { TRPCContext } from "../context"
import getUserInfo from "../user/getUserInfo"
import { z } from "zod"
import { addPhoneAuthSchema } from "@rally/schemas"
import { db, phoneChallengeTable } from "@rally/db"

export default async function addPhoneAuth(
  ctx: TRPCContext,
  input: z.infer<typeof addPhoneAuthSchema>,
) {
  if (!ctx.user) {
    console.error("[addPhoneAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }
  const user = await getUserInfo(ctx)
  if (!user) {
    console.error("[addPhoneAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }
  if (user.supabaseMetadata.is_phone_verified || !user.supabaseMetadata.is_email_verified) {
    console.error("[addPhoneAuth] User already has phone number or email verified")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User already has phone number or not verified email",
    })
  }

  const { data: factors } = await ctx.supabase.auth.mfa.listFactors()
  if (factors) {
    factors.all.forEach(async (factor) => {
      if (factor.factor_type === "phone" && factor.status === "unverified") {
        await ctx.supabase.auth.mfa.unenroll({
          factorId: factor.id,
        })
      }
    })
  }

  const { data, error } = await ctx.supabase.auth.mfa.enroll({
    factorType: "phone",
    phone: input.phoneNumber,
  })
  if (!data || error) {
    console.error("[addPhoneAuth] Failed to enroll phone", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error?.message || "Failed to enroll phone",
    })
  }
  const { data: challengeData, error: challengeError } = await ctx.supabase.auth.mfa.challenge({
    factorId: data.id,
  })
  if (!challengeData || challengeError) {
    console.error("[addPhoneAuth] Failed to challenge phone", challengeError)
    await ctx.supabase.auth.mfa.unenroll({
      factorId: data.id,
    })
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: challengeError?.message || "Failed to challenge phone",
    })
  }
  await db.insert(phoneChallengeTable).values({
    userId: user.id,
    factorId: data.id,
    challengeId: challengeData.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 5),
  })
  await ctx.supabase.auth.updateUser({
    data: {
      phone_number: input.phoneNumber,
    },
  })
}
