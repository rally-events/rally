CREATE TYPE "public"."poster_aspect_ratio" AS ENUM('11:17', '4:5', '9:16', '8.5:11');--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "poster_aspect_ratio" "poster_aspect_ratio";