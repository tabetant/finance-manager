CREATE TYPE "public"."status" AS ENUM('open', 'closed', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "help_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"course" text NOT NULL,
	"message" text NOT NULL,
	"status" "status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
