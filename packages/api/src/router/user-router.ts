import { router, protectedProcedure, publicProcedure } from "../trpc"
import { signUpSchema, getUserInfoSchema, verifySchema } from "@rally/schemas"
import registerUser from "../user/registerUser"
import getUserInfo from "../user/getUserInfo"
import verifyEmailWithCode from "../user/verifyEmailWithCode"

export type SupabaseUserMetadata = {
  email: string
  full_name: string
  onboard_complete: boolean
  pending_access: number
  phone_verified: boolean
  stripe_customer_id: string
  sub: string
  we_verified_email: boolean
}

export const userRouter = router({
  getUserInfo: protectedProcedure
    .input(getUserInfoSchema)
    .query(async ({ ctx, input }) => await getUserInfo(ctx, input)),
  registerUser: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => await registerUser(ctx, input)),
  verifyEmail: protectedProcedure
    .input(verifySchema)
    .mutation(async ({ ctx, input }) => await verifyEmailWithCode(ctx, input.code)),
})
