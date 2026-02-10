CREATE TABLE "user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"module_id" uuid NOT NULL,
	"course_id" text NOT NULL,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"started_at" timestamp DEFAULT now(),
	"quiz_score" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_user_module" UNIQUE("user_id","module_id")
);
--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;