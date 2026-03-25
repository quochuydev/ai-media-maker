CREATE TYPE "public"."image_job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "image_job_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"status" "image_job_status" DEFAULT 'pending' NOT NULL,
	"image_url" text,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_images" integer NOT NULL,
	"completed_images" integer DEFAULT 0 NOT NULL,
	"failed_images" integer DEFAULT 0 NOT NULL,
	"status" "image_job_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "image_job_items" ADD CONSTRAINT "image_job_items_job_id_image_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."image_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_jobs" ADD CONSTRAINT "image_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "image_job_items_job_id_idx" ON "image_job_items" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "image_jobs_user_id_idx" ON "image_jobs" USING btree ("user_id");