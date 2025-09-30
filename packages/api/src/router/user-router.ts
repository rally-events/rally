import { router, protectedProcedure, publicProcedure } from "../trpc"
import { signUpSchema, getUserInfoSchema, verifySchema } from "@rally/schemas"
import registerUser from "../user/registerUser"
import getUserInfo from "../user/getUserInfo"
import verifyEmailWithCode from "../user/verifyEmailWithCode"

export const userRouter = router({
  getUserInfo: publicProcedure
    .input(getUserInfoSchema)
    .query(async ({ ctx, input }) => await getUserInfo(ctx, input)),
  registerUser: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => await registerUser(ctx, input)),
  verifyEmail: protectedProcedure
    .input(verifySchema)
    .mutation(async ({ ctx, input }) => await verifyEmailWithCode(ctx, input.code)),
})
