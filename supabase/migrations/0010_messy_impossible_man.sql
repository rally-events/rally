CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'poster', 'pdf');--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "file_size" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "mime_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "file_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "media_type" "media_type" NOT NULL;