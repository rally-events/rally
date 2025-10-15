CREATE TYPE "public"."sponsor_request_status" AS ENUM('pending', 'approved', 'revised', 'rejected');--> statement-breakpoint
CREATE TABLE "sponsorships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"status" "sponsor_request_status" DEFAULT 'pending' NOT NULL,
	"sponsor_organization_id" uuid NOT NULL,
	"host_organization_id" uuid NOT NULL,
	"revision_count" integer DEFAULT 0 NOT NULL,
	"description" text,
	"dollar_amount" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "updated_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_sponsor_organization_id_sponsor_organizations_id_fk" FOREIGN KEY ("sponsor_organization_id") REFERENCES "public"."sponsor_organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_host_organization_id_host_organizations_id_fk" FOREIGN KEY ("host_organization_id") REFERENCES "public"."host_organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;