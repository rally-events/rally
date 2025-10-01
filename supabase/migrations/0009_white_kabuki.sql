CREATE TABLE "events_media" (
	"event_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	CONSTRAINT "events_media_event_id_media_id_pk" PRIMARY KEY("event_id","media_id")
);
--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "media_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "events_media" ADD CONSTRAINT "events_media_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events_media" ADD CONSTRAINT "events_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN "event_id";