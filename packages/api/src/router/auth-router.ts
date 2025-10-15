import { router, protectedProcedure } from "../trpc"
import { verifySchema, addPhoneAuthSchema, verifyPhoneAuthSchema } from "@rally/schemas"
import verifyEmailWithCode from "../auth/verifyEmailWithCode"
import addPhoneAuth from "../auth/addPhoneAuth"
import verifyPhoneAuth from "../auth/verifyPhoneAuth"
import removePhoneAuth from "../auth/removePhoneAuth"

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
})
