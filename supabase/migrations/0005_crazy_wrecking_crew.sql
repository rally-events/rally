ALTER TABLE "events" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_type" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "format" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "using_organization_address" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "street_address" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "zip_code" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_datetime" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_datetime" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "expected_attendees_min" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "expected_attendees_max" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "themes" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "audience_age" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "community_segments" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "audience_interests" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "has_famous_people" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "famous_people" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_ticketed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "ticket_cost" text;