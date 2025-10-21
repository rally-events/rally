import { TRPCError } from "@trpc/server"
import { TRPCContext } from "../context"
import getUserInfo from "../user/getUserInfo"
import { z } from "zod"
import { addAuthenticatorAuthSchema } from "@rally/schemas"
import { db, authenticatorChallengeTable, eq } from "@rally/db"

export default async function addAuthenticatorAuth(
  ctx: TRPCContext,
  input: z.infer<typeof addAuthenticatorAuthSchema>,
) {
  if (!ctx.user) {
    console.error("[addAuthenticatorAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }
  const user = await getUserInfo(ctx)
  if (!user) {
    console.error("[addAuthenticatorAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }
  if (!user.supabaseMetadata.is_email_verified) {
    console.error("[addAuthenticatorAuth] User email not verified")
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email must be verified before adding authenticator",
    })
  }

  const { data: factors } = await ctx.supabase.auth.mfa.listFactors()
  if (factors) {
    for (const factor of factors.all) {
      if (factor.factor_type === "totp" && factor.status === "unverified") {
        await ctx.supabase.auth.mfa.unenroll({
          factorId: factor.id,
        })
      }
    }

    const hasVerifiedTotp = factors.all.some(
      (factor) => factor.factor_type === "totp" && factor.status === "verified",
    )
    if (hasVerifiedTotp) {
      console.error("[addAuthenticatorAuth] User already has verified authenticator")
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User already has a verified authenticator app",
      })
    }
  }

  await db
    .delete(authenticatorChallengeTable)
    .where(eq(authenticatorChallengeTable.userId, user.id))

  const { data, error } = await ctx.supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: input.friendlyName,
  })
  if (!data || error) {
    console.error("[addAuthenticatorAuth] Failed to enroll authenticator", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error?.message || "Failed to enroll authenticator",
    })
  }

  await db.insert(authenticatorChallengeTable).values({
    userId: user.id,
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  })

  return {
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
  }
}
