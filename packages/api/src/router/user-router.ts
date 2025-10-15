import { router, protectedProcedure, publicProcedure } from "../trpc"
import { signUpSchema, getUserInfoSchema, updateUserProfileSchema } from "@rally/schemas"
import registerUser from "../user/registerUser"
import getUserInfo from "../user/getUserInfo"
import updateUserProfile from "../user/updateUserProfile"

export const userRouter = router({
  getUserInfo: publicProcedure
    .input(getUserInfoSchema)
    .query(async ({ ctx, input }) => await getUserInfo(ctx, input)),
  registerUser: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => await registerUser(ctx, input)),
  updateUserProfile: protectedProcedure
    .input(updateUserProfileSchema)
    .mutation(async ({ ctx, input }) => await updateUserProfile(ctx, input)),
})
