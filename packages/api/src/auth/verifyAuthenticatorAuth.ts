import { verifyAuthenticatorAuthSchema } from "@rally/schemas"
import { TRPCContext } from "../context"
import z from "zod"
import { TRPCError } from "@trpc/server"
import getUserInfo from "../user/getUserInfo"
import { and, db, eq, gte, authenticatorChallengeTable } from "@rally/db"

export default async function verifyAuthenticatorAuth(
  ctx: TRPCContext,
  input: z.infer<typeof verifyAuthenticatorAuthSchema>,
) {
  if (!ctx.user) {
    console.error("[verifyAuthenticatorAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }
  const user = await getUserInfo(ctx)
  if (!user) {
    console.error("[verifyAuthenticatorAuth] User not found")
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  const challenge = await db.query.authenticatorChallengeTable.findFirst({
    where: and(
      eq(authenticatorChallengeTable.userId, user.id),
      gte(authenticatorChallengeTable.expiresAt, new Date()),
    ),
  })
  if (!challenge) {
    console.error("[verifyAuthenticatorAuth] Challenge not found or expired")
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Challenge not found or expired",
    })
  }

  const { data: challengeData, error: challengeError } = await ctx.supabase.auth.mfa.challenge({
    factorId: challenge.factorId,
  })
  if (!challengeData || challengeError) {
    console.error("[verifyAuthenticatorAuth] Failed to create challenge", challengeError)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: challengeError?.message || "Failed to create challenge",
    })
  }

  const { data, error } = await ctx.supabase.auth.mfa.verify({
    factorId: challenge.factorId,
    challengeId: challengeData.id,
    code: input.code,
  })
  if (!data || error) {
    console.error("[verifyAuthenticatorAuth] Failed to verify authenticator", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error?.message || "Failed to verify authenticator",
    })
  }

  await ctx.supabase.auth.updateUser({
    data: {
      is_authenticator_verified: true,
    },
  })

  await db
    .delete(authenticatorChallengeTable)
    .where(eq(authenticatorChallengeTable.id, challenge.id))
}
