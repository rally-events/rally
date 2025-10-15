CREATE TYPE "public"."notification_level" AS ENUM('info', 'warning', 'error');--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "data" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "body";

alter publication supabase_realtime
add table notifications;
