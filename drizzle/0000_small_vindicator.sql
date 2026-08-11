CREATE TABLE "app_meta" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
