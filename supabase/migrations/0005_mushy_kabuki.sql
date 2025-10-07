ALTER TYPE "public"."poster_aspect_ratio" RENAME TO "aspect_ratio";--> statement-breakpoint
ALTER TABLE "media" RENAME COLUMN "poster_aspect_ratio" TO "aspect_ratio";--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "aspect_ratio" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."aspect_ratio";--> statement-breakpoint
CREATE TYPE "public"."aspect_ratio" AS ENUM('1/1', '5/4', '4/5');--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "aspect_ratio" SET DATA TYPE "public"."aspect_ratio" USING "aspect_ratio"::"public"."aspect_ratio";