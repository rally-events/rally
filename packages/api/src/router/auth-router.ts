import { router, protectedProcedure } from "../trpc"
import {
  verifySchema,
  addPhoneAuthSchema,
  verifyPhoneAuthSchema,
  addAuthenticatorAuthSchema,
  verifyAuthenticatorAuthSchema,
} from "@rally/schemas"
import verifyEmailWithCode from "../auth/verifyEmailWithCode"
import addPhoneAuth from "../auth/addPhoneAuth"
import verifyPhoneAuth from "../auth/verifyPhoneAuth"
import removePhoneAuth from "../auth/removePhoneAuth"
import addAuthenticatorAuth from "../auth/addAuthenticatorAuth"
import verifyAuthenticatorAuth from "../auth/verifyAuthenticatorAuth"
import removeAuthenticatorAuth from "../auth/removeAuthenticatorAuth"

export const authRouter = router({
  verifyEmail: protectedProcedure
    .input(verifySchema)
    .mutation(async ({ ctx, input }) => await verifyEmailWithCode(ctx, input.code)),
  addPhoneAuth: protectedProcedure
    .input(addPhoneAuthSchema)
    .mutation(async ({ ctx, input }) => await addPhoneAuth(ctx, input)),
  verifyPhoneAuth: protectedProcedure
    .input(verifyPhoneAuthSchema)
    .mutation(async ({ ctx, input }) => await verifyPhoneAuth(ctx, input)),
  removePhoneAuth: protectedProcedure.mutation(async ({ ctx }) => await removePhoneAuth(ctx)),
  addAuthenticatorAuth: protectedProcedure
    .input(addAuthenticatorAuthSchema)
    .mutation(async ({ ctx, input }) => await addAuthenticatorAuth(ctx, input)),
  verifyAuthenticatorAuth: protectedProcedure
    .input(verifyAuthenticatorAuthSchema)
    .mutation(async ({ ctx, input }) => await verifyAuthenticatorAuth(ctx, input)),
  removeAuthenticatorAuth: protectedProcedure.mutation(async ({ ctx }) => await removeAuthenticatorAuth(ctx)),
})
