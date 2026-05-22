import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { hashPassword } from "./utils/auth";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = neon(process.env.DATABASE_URL);
      const dbInstance = drizzle(client);
      _db = dbInstance;
      await provisionAdmin(dbInstance);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

async function provisionAdmin(db: ReturnType<typeof drizzle>) {
  try {
    const existingAdmins = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
    if (existingAdmins.length === 0) {
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
      if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
        console.warn(
          "[Database] WARNING: ADMIN_USERNAME or ADMIN_PASSWORD not set in .env. Falling back to default credentials: admin / admin1234"
        );
      }
      
      const pwdHash = hashPassword(adminPassword);
      
      await db.insert(users).values({
        openId: adminUsername,
        username: adminUsername,
        passwordHash: pwdHash,
        name: "Admin",
        email: "admin@example.com",
        loginMethod: "credentials",
        role: "admin",
      });
      console.log(`[Database] Auto-provisioned admin user: ${adminUsername}`);
    }
  } catch (error: any) {
    console.warn("[Database] Failed to auto-provision admin user (likely tables do not exist yet):", error.message);
  }
}

// TODO: add feature queries here as your schema grows.

/* =====================================================================
 * Portfolio CMS data helpers
 * ===================================================================== */

import { asc, desc } from "drizzle-orm";
import {
  contactMessages,
  InsertContactMessage,
  InsertProcessStep,
  InsertProject,
  InsertService,
  InsertSiteSettings,
  InsertSkill,
  InsertSocialLink,
  InsertTestimonial,
  InsertTool,
  processSteps,
  projects,
  services,
  siteSettings,
  skills,
  socialLinks,
  testimonials,
  tools,
  certifications,
  InsertCertification,
} from "../drizzle/schema";

/* ----- siteSettings (singleton id=1) ----- */
export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return rows[0];
}

export async function updateSiteSettings(patch: Partial<InsertSiteSettings>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(siteSettings).set(patch).where(eq(siteSettings.id, 1));
  return getSiteSettings();
}

/* ----- collection helpers (one per table for type-safety) ----- */
export async function listProjects(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(projects).values(data);
}
export async function updateProject(id: number, patch: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(projects).set(patch).where(eq(projects.id, id));
}
export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(projects).where(eq(projects.id, id));
}

export async function listServices(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertService(data: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(services).values(data);
}
export async function updateService(id: number, patch: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(services).set(patch).where(eq(services.id, id));
}
export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(services).where(eq(services.id, id));
}

export async function listProcessSteps(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(processSteps).orderBy(asc(processSteps.sortOrder), asc(processSteps.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertProcessStep(data: InsertProcessStep) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(processSteps).values(data);
}
export async function updateProcessStep(id: number, patch: Partial<InsertProcessStep>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(processSteps).set(patch).where(eq(processSteps.id, id));
}
export async function deleteProcessStep(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(processSteps).where(eq(processSteps.id, id));
}

export async function listSkills(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertSkill(data: InsertSkill) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(skills).values(data);
}
export async function updateSkill(id: number, patch: Partial<InsertSkill>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(skills).set(patch).where(eq(skills.id, id));
}
export async function deleteSkill(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(skills).where(eq(skills.id, id));
}

export async function listTestimonials(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertTestimonial(data: InsertTestimonial) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(testimonials).values(data);
}
export async function updateTestimonial(id: number, patch: Partial<InsertTestimonial>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(testimonials).set(patch).where(eq(testimonials.id, id));
}
export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

export async function listTools(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(tools).orderBy(asc(tools.sortOrder), asc(tools.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertTool(data: InsertTool) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(tools).values(data);
}
export async function updateTool(id: number, patch: Partial<InsertTool>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(tools).set(patch).where(eq(tools.id, id));
}
export async function deleteTool(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(tools).where(eq(tools.id, id));
}

export async function listSocialLinks(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder), asc(socialLinks.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertSocialLink(data: InsertSocialLink) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(socialLinks).values(data);
}
export async function updateSocialLink(id: number, patch: Partial<InsertSocialLink>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(socialLinks).set(patch).where(eq(socialLinks.id, id));
}
export async function deleteSocialLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
}

/* ----- contact messages ----- */
export async function listContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(contactMessages).values(data);
}
export async function markMessageRead(id: number, read: boolean) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
}
export async function deleteContactMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}

/* ----- certifications ----- */
export async function listCertifications(includeDrafts = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(certifications).orderBy(asc(certifications.sortOrder), asc(certifications.id));
  return includeDrafts ? rows : rows.filter(r => r.published);
}
export async function insertCertification(data: InsertCertification) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(certifications).values(data);
}
export async function updateCertification(id: number, patch: Partial<InsertCertification>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(certifications).set(patch).where(eq(certifications.id, id));
}
export async function deleteCertification(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(certifications).where(eq(certifications.id, id));
}
