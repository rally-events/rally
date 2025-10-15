ALTER TABLE "sponsorships" DROP CONSTRAINT "sponsorships_sponsor_organization_id_sponsor_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsorships" DROP CONSTRAINT "sponsorships_host_organization_id_host_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_sponsor_organization_id_organizations_id_fk" FOREIGN KEY ("sponsor_organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_host_organization_id_organizations_id_fk" FOREIGN KEY ("host_organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;