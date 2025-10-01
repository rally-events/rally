ALTER TABLE "events_media" DROP CONSTRAINT "events_media_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "events_media" DROP CONSTRAINT "events_media_media_id_media_id_fk";
--> statement-breakpoint
ALTER TABLE "events_media" ADD CONSTRAINT "events_media_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events_media" ADD CONSTRAINT "events_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;