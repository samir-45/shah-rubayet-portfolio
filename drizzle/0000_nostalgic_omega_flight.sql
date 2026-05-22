CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "contactMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"subject" varchar(300),
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "processSteps" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" varchar(8) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"category" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text,
	"href" text,
	"tagsJson" jsonb,
	"spanClass" varchar(200) DEFAULT 'md:col-span-1 md:row-span-1' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" varchar(8) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "siteSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"brandName" varchar(120) DEFAULT 'SHAH RUBAYET' NOT NULL,
	"ownerName" varchar(120) DEFAULT 'Shah Rubayet Ahmed' NOT NULL,
	"location" varchar(120) DEFAULT 'Dhaka, BD — UTC+6' NOT NULL,
	"heroEyebrow" varchar(200) DEFAULT 'Hey, I''m Shah Rubayet' NOT NULL,
	"heroHeadline" text NOT NULL,
	"heroDescription" text NOT NULL,
	"heroPortraitUrl" text,
	"heroAvailabilityLabel" varchar(80) DEFAULT 'Available' NOT NULL,
	"heroAvailabilityValue" varchar(200) DEFAULT 'For Q1 ''26 projects' NOT NULL,
	"heroLocationLabel" varchar(80) DEFAULT 'Based in' NOT NULL,
	"heroLocationValue" varchar(200) DEFAULT 'Dhaka, BD — UTC+6' NOT NULL,
	"cvUrl" text,
	"heroFeatures" jsonb,
	"aboutEyebrow" varchar(80) DEFAULT '(About)' NOT NULL,
	"aboutHeadline" text NOT NULL,
	"aboutBody" text NOT NULL,
	"aboutStats" jsonb,
	"servicesHeadline" text,
	"servicesIntro" text,
	"workHeadline" text,
	"processHeadline" text,
	"processIntro" text,
	"testimonialsHeadline" text,
	"skillsHeadline" text,
	"toolsHeadline" text,
	"toolsIntro" text,
	"contactHeadline" text,
	"contactBody" text,
	"contactEmail" varchar(320) DEFAULT 'shahrubayet@gmail.com' NOT NULL,
	"contactPhone" varchar(40),
	"contactLinkedinLabel" varchar(200),
	"contactLinkedinUrl" text,
	"footerCopyright" varchar(200) DEFAULT '© 2026 — Dhaka' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"value" integer DEFAULT 80 NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "socialLinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"url" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"role" varchar(200) NOT NULL,
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
