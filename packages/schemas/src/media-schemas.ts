import { z } from "zod"

export const generateUploadUrlSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  mimeType: z.string().min(1, "MIME type is required"),
  fileSize: z.number().int().positive("File size must be positive"),
  mediaType: z.enum(["image", "video", "poster", "pdf"]).optional(),
})

export const confirmUploadSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  fileKey: z.string().min(1, "File key is required"),
  fileSize: z.number().int().positive("File size must be positive"),
  mimeType: z.string().min(1, "MIME type is required"),
  width: z
    .number()
    .int()
    .min(250, "Width must be at least 250px")
    .max(12000, "Width must be at most 12000px")
    .optional(),
  height: z
    .number()
    .int()
    .min(250, "Height must be at least 250px")
    .max(12000, "Height must be at most 12000px")
    .optional(),
  duration: z
    .number()
    .min(2, "Video duration must be at least 2 seconds")
    .max(120, "Video duration must be at most 120 seconds")
    .optional(),
  mediaType: z.enum(["image", "video", "poster", "pdf"]).optional(),
})

export const getEventMediaSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
})

export const deleteMediaSchema = z.object({
  mediaId: z.string().uuid("Invalid media ID"),
})
