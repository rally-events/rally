import { z } from "zod"

export const generateUploadUrlSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  mimeType: z.string().min(1, "MIME type is required"),
  fileSize: z.number().int().positive("File size must be positive"),
})

export const deleteMediaSchema = z.object({
  mediaId: z.string().uuid("Invalid media ID"),
})