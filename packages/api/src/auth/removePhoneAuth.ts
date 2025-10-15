import { TRPCError } from "@trpc/server"
import { TRPCContext } from "../context"
import getUserInfo from "../user/getUserInfo"
import { z } from "zod"
import { db, phoneChallengeTable, eq } from "@rally/db"

export default async function removePhoneAuth(ctx: TRPCContext) {
  if (!ctx.user) {
    console.error("[API/AUTH/removePhoneAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    })
  }

  const user = await getUserInfo(ctx)
  if (!user) {
    console.error("[API/AUTH/removePhoneAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    })
  }
  if (!user.supabaseMetadata.phone_number || !user.supabaseMetadata.is_phone_verified) {
    console.error("[API/AUTH/removePhoneAuth] User does not have a verified phone number")
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User does not have a verified phone number",
    })
  }
  const { data: factors } = await ctx.supabase.auth.mfa.listFactors()
  const verifiedFactorId = factors?.all.find(
    (factor) => factor.factor_type === "phone" && factor.status === "verified",
  )?.id
  if (!verifiedFactorId) {
    console.error("[API/AUTH/removePhoneAuth] User does not have a verified phone number")
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User does not have a verified phone number",
    })
  }

  await ctx.supabase.auth.mfa.unenroll({
    factorId: verifiedFactorId,
  })
  await db.delete(phoneChallengeTable).where(eq(phoneChallengeTable.userId, user.id))
  await ctx.supabase.auth.updateUser({
    data: {
      phone_number: null,
      is_phone_verified: false,
    },
  })
}
