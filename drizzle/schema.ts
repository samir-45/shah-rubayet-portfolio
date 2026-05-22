import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 64 }).unique(),
  passwordHash: text("passwordHash"),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Singleton-style settings row (id = 1) with all "global" portfolio content.
 * Hero copy, intro text, about copy, stats, contact info, social links and CV.
 */
export const siteSettings = pgTable("siteSettings", {
  id: serial("id").primaryKey(),

  // Branding
  brandName: varchar("brandName", { length: 120 }).notNull().default("SHAH RUBAYET"),
  ownerName: varchar("ownerName", { length: 120 }).notNull().default("Shah Rubayet Ahmed"),
  location: varchar("location", { length: 120 }).notNull().default("Dhaka, BD — UTC+6"),

  // Hero
  heroEyebrow: varchar("heroEyebrow", { length: 200 }).notNull().default("Hey, I'm Shah Rubayet"),
  heroHeadline: text("heroHeadline").notNull(),
  heroDescription: text("heroDescription").notNull(),
  heroPortraitUrl: text("heroPortraitUrl"),
  heroAvailabilityLabel: varchar("heroAvailabilityLabel", { length: 80 }).notNull().default("Available"),
  heroAvailabilityValue: varchar("heroAvailabilityValue", { length: 200 }).notNull().default("For Q1 '26 projects"),
  heroLocationLabel: varchar("heroLocationLabel", { length: 80 }).notNull().default("Based in"),
  heroLocationValue: varchar("heroLocationValue", { length: 200 }).notNull().default("Dhaka, BD — UTC+6"),
  cvUrl: text("cvUrl"),
  // 4 hero feature pills, stored as JSON array of {title, description}
  heroFeatures: jsonb("heroFeatures"),

  // About
  aboutEyebrow: varchar("aboutEyebrow", { length: 80 }).notNull().default("(About)"),
  aboutHeadline: text("aboutHeadline").notNull(),
  aboutBody: text("aboutBody").notNull(),
  // stats: array of {label, value}
  aboutStats: jsonb("aboutStats"),

  // Section headings (purely cosmetic)
  servicesHeadline: text("servicesHeadline"),
  servicesIntro: text("servicesIntro"),
  workHeadline: text("workHeadline"),
  processHeadline: text("processHeadline"),
  processIntro: text("processIntro"),
  testimonialsHeadline: text("testimonialsHeadline"),
  skillsHeadline: text("skillsHeadline"),
  toolsHeadline: text("toolsHeadline"),
  toolsIntro: text("toolsIntro"),

  // Contact section
  contactHeadline: text("contactHeadline"),
  contactBody: text("contactBody"),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull().default("shahrubayet@gmail.com"),
  contactPhone: varchar("contactPhone", { length: 40 }),
  contactLinkedinLabel: varchar("contactLinkedinLabel", { length: 200 }),
  contactLinkedinUrl: text("contactLinkedinUrl"),

  // Footer copy
  footerCopyright: varchar("footerCopyright", { length: 200 }).notNull().default("© 2026 — Dhaka"),

  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;

/**
 * Projects (Selected Work bento grid). Free-form ordering via "sortOrder".
 * "span" controls the bento grid placement string.
 */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 200 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl"),
  href: text("href"),
  tagsJson: jsonb("tagsJson"), // string[]
  spanClass: varchar("spanClass", { length: 200 })
    .notNull()
    .default("md:col-span-1 md:row-span-1"),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Services (six-tile grid).
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  number: varchar("number", { length: 8 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Process steps.
 */
export const processSteps = pgTable("processSteps", {
  id: serial("id").primaryKey(),
  number: varchar("number", { length: 8 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type ProcessStep = typeof processSteps.$inferSelect;
export type InsertProcessStep = typeof processSteps.$inferInsert;

/**
 * Skills with percentage.
 */
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  value: integer("value").notNull().default(80),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * Testimonials.
 */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 200 }).notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Tools strip (Figma, Framer, etc). slug used for simpleicons.org logo.
 */
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }),
  imageUrl: text("imageUrl"),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Tool = typeof tools.$inferSelect;
export type InsertTool = typeof tools.$inferInsert;

/**
 * Social links shown in contact + footer.
 */
export const socialLinks = pgTable("socialLinks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = typeof socialLinks.$inferInsert;

/**
 * Inbound contact messages from the public site (optional contact form on dashboard).
 */
export const contactMessages = pgTable("contactMessages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 300 }),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Certifications section.
 */
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  issuer: varchar("issuer", { length: 200 }).notNull(),
  issueDate: varchar("issueDate", { length: 100 }),
  description: text("description"),
  credentialId: varchar("credentialId", { length: 200 }),
  credentialUrl: text("credentialUrl"),
  imageUrl: text("imageUrl"),
  sortOrder: integer("sortOrder").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;

