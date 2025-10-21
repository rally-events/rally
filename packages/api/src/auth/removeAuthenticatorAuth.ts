import { TRPCError } from "@trpc/server"
import { TRPCContext } from "../context"
import getUserInfo from "../user/getUserInfo"
import { db, authenticatorChallengeTable, eq } from "@rally/db"

export default async function removeAuthenticatorAuth(ctx: TRPCContext) {
  if (!ctx.user) {
    console.error("[API/AUTH/removeAuthenticatorAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    })
  }

  const user = await getUserInfo(ctx)
  if (!user) {
    console.error("[API/AUTH/removeAuthenticatorAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    })
  }

  // Check if user has a verified authenticator
  if (!user.supabaseMetadata.is_authenticator_verified) {
    console.error("[API/AUTH/removeAuthenticatorAuth] User does not have a verified authenticator")
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User does not have a verified authenticator app",
    })
  }

  const { data: factors } = await ctx.supabase.auth.mfa.listFactors()
  const verifiedFactorId = factors?.all.find(
    (factor) => factor.factor_type === "totp" && factor.status === "verified",
  )?.id
  if (!verifiedFactorId) {
    console.error("[API/AUTH/removeAuthenticatorAuth] User does not have a verified authenticator")
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User does not have a verified authenticator app",
    })
  }

  await ctx.supabase.auth.mfa.unenroll({
    factorId: verifiedFactorId,
  })
  await db.delete(authenticatorChallengeTable).where(eq(authenticatorChallengeTable.userId, user.id))
  await ctx.supabase.auth.updateUser({
    data: {
      is_authenticator_verified: false,
    },
  })
}
