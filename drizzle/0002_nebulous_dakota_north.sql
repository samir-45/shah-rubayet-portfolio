ALTER TABLE "tools" ALTER COLUMN "slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "imageUrl" text;