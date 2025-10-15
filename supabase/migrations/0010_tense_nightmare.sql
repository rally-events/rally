ALTER TABLE "sponsorships" RENAME TO "sponsorship_requests";--> statement-breakpoint
ALTER TABLE "sponsorship_requests" DROP CONSTRAINT "sponsorships_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsorship_requests" DROP CONSTRAINT "sponsorships_sponsor_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsorship_requests" DROP CONSTRAINT "sponsorships_host_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsorship_requests" ADD CONSTRAINT "sponsorship_requests_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_requests" ADD CONSTRAINT "sponsorship_requests_sponsor_organization_id_organizations_id_fk" FOREIGN KEY ("sponsor_organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorship_requests" ADD CONSTRAINT "sponsorship_requests_host_organization_id_organizations_id_fk" FOREIGN KEY ("host_organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;