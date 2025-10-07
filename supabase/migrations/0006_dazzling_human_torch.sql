ALTER TABLE "media" ALTER COLUMN "aspect_ratio" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."aspect_ratio";--> statement-breakpoint
CREATE TYPE "public"."aspect_ratio" AS ENUM('1:1', '4:5', '5:4');--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "aspect_ratio" SET DATA TYPE "public"."aspect_ratio" USING "aspect_ratio"::"public"."aspect_ratio";