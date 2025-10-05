CREATE TYPE "public"."audience_age_enum" AS ENUM('under-18', '18-21', '22-30', '31-40', '41-50', '51-60', 'over-60');--> statement-breakpoint
CREATE TYPE "public"."format_enum" AS ENUM('in-person', 'virtual', 'hybrid');--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "format" SET DATA TYPE "public"."format_enum" USING "format"::"public"."format_enum";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "themes" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "audience_age" SET DATA TYPE "public"."audience_age_enum"[] USING "audience_age"::"public"."audience_age_enum"[];--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "community_segments" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "audience_interests" SET DATA TYPE text[];