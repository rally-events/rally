CREATE TABLE "authenticator_challenge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"factor_id" text NOT NULL,
	"qr_code" text NOT NULL,
	"secret" text NOT NULL,
	"uri" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "authenticator_challenge" ADD CONSTRAINT "authenticator_challenge_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;