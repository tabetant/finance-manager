CREATE TABLE "user_streaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_quiz_date" timestamp,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_streaks_user_id_unique" UNIQUE("user_id")
);
