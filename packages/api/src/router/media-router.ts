import { protectedProcedure, router } from "../trpc"
import { generateUploadUrlSchema, deleteMediaSchema } from "@rally/schemas"
import generateUploadUrl from "../media/generateUploadUrl"
import deleteMedia from "../media/deleteMedia"

export const mediaRouter = router({
  generateUploadUrl: protectedProcedure
    .input(generateUploadUrlSchema)
    .mutation(async ({ ctx, input }) => await generateUploadUrl(ctx, input)),
  deleteMedia: protectedProcedure
    .input(deleteMediaSchema)
    .mutation(async ({ ctx, input }) => await deleteMedia(ctx, input)),
})