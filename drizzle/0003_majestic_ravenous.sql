CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"issuer" varchar(200) NOT NULL,
	"issueDate" varchar(100),
	"description" text,
	"credentialId" varchar(200),
	"credentialUrl" text,
	"imageUrl" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
