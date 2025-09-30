import { protectedProcedure, router } from "../trpc"
import { generateUploadUrlSchema, confirmUploadSchema, getEventMediaSchema, deleteMediaSchema } from "@rally/schemas"
import generateUploadUrl from "../media/generateUploadUrl"
import confirmUpload from "../media/confirmUpload"
import getEventMedia from "../media/getEventMedia"
import deleteMedia from "../media/deleteMedia"

export const mediaRouter = router({
  generateUploadUrl: protectedProcedure
    .input(generateUploadUrlSchema)
    .mutation(async ({ ctx, input }) => await generateUploadUrl(ctx, input)),
  confirmUpload: protectedProcedure
    .input(confirmUploadSchema)
    .mutation(async ({ ctx, input }) => await confirmUpload(ctx, input)),
  getEventMedia: protectedProcedure
    .input(getEventMediaSchema)
    .query(async ({ ctx, input }) => await getEventMedia(ctx, input)),
  deleteMedia: protectedProcedure
    .input(deleteMediaSchema)
    .mutation(async ({ ctx, input }) => await deleteMedia(ctx, input)),
})