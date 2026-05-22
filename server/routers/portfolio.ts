import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "../db";
import { storagePut } from "../storage";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

/* ---------- input schemas ---------- */

const projectInput = z.object({
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(200),
  description: z.string().min(1),
  imageUrl: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
  tagsJson: z.array(z.string()).optional(),
  spanClass: z.string().min(1).max(200),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

const serviceInput = z.object({
  number: z.string().min(1).max(8),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

const processStepInput = serviceInput;

const skillInput = z.object({
  name: z.string().min(1).max(200),
  value: z.number().int().min(0).max(100).default(80),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

const testimonialInput = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

const toolInput = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().max(120).optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

const socialLinkInput = z.object({
  name: z.string().min(1).max(120),
  url: z.string().min(1),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

const certificationInput = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  issueDate: z.string().max(100).optional().nullable(),
  description: z.string().optional().nullable(),
  credentialId: z.string().max(200).optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});


const heroFeatureSchema = z.tuple([z.string(), z.string()]);
const aboutStatSchema = z.object({ value: z.string(), label: z.string() });

const siteSettingsInput = z.object({
  brandName: z.string().min(1).max(120),
  ownerName: z.string().min(1).max(120),
  location: z.string().max(120),
  heroEyebrow: z.string().max(200),
  heroHeadline: z.string().min(1),
  heroDescription: z.string().min(1),
  heroPortraitUrl: z.string().nullable().optional(),
  heroAvailabilityLabel: z.string().max(80),
  heroAvailabilityValue: z.string().max(200),
  heroLocationLabel: z.string().max(80),
  heroLocationValue: z.string().max(200),
  cvUrl: z.string().nullable().optional(),
  heroFeatures: z.array(heroFeatureSchema),
  aboutEyebrow: z.string().max(80),
  aboutHeadline: z.string().min(1),
  aboutBody: z.string().min(1),
  aboutStats: z.array(aboutStatSchema),
  servicesHeadline: z.string().nullable().optional(),
  servicesIntro: z.string().nullable().optional(),
  workHeadline: z.string().nullable().optional(),
  processHeadline: z.string().nullable().optional(),
  processIntro: z.string().nullable().optional(),
  testimonialsHeadline: z.string().nullable().optional(),
  skillsHeadline: z.string().nullable().optional(),
  toolsHeadline: z.string().nullable().optional(),
  toolsIntro: z.string().nullable().optional(),
  contactHeadline: z.string().nullable().optional(),
  contactBody: z.string().nullable().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().nullable().optional(),
  contactLinkedinLabel: z.string().nullable().optional(),
  contactLinkedinUrl: z.string().nullable().optional(),
  footerCopyright: z.string().max(200),
});

const idInput = z.object({ id: z.number().int().positive() });

const uploadInput = z.object({
  fileName: z.string().min(1).max(200),
  contentType: z.string().min(1).max(120),
  // Base64-encoded file bytes
  data: z.string().min(1),
  // Optional logical folder ("projects", "portrait", "cv", etc.)
  folder: z.string().min(1).max(60).default("uploads"),
});

/* ---------- router ---------- */

export const portfolioRouter = router({
  /* ===== PUBLIC ===== */
  getSiteSettings: publicProcedure.query(async () => {
    const s = await db.getSiteSettings();
    return s ?? null;
  }),

  listProjects: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listProjects(input?.includeDrafts ?? false)),

  listServices: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listServices(input?.includeDrafts ?? false)),

  listProcessSteps: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listProcessSteps(input?.includeDrafts ?? false)),

  listSkills: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listSkills(input?.includeDrafts ?? false)),

  listTestimonials: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listTestimonials(input?.includeDrafts ?? false)),

  listTools: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listTools(input?.includeDrafts ?? false)),

  listSocialLinks: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listSocialLinks(input?.includeDrafts ?? false)),

  listCertifications: publicProcedure
    .input(z.object({ includeDrafts: z.boolean().default(false) }).optional())
    .query(({ input }) => db.listCertifications(input?.includeDrafts ?? false)),


  // Public: contact form submission
  submitMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        email: z.string().email().max(320),
        subject: z.string().max(300).optional(),
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      await db.createContactMessage(input);
      return { success: true } as const;
    }),

  /* ===== ADMIN ===== */
  updateSiteSettings: adminProcedure
    .input(siteSettingsInput.partial())
    .mutation(async ({ input }) => {
      const result = await db.updateSiteSettings(input as any);
      return result;
    }),

  // Generic image / file upload. Accepts base64 payload (we keep payloads small in UI).
  uploadFile: adminProcedure.input(uploadInput).mutation(async ({ input }) => {
    const buf = Buffer.from(input.data, "base64");
    if (buf.byteLength > 8 * 1024 * 1024) {
      throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Max 8MB" });
    }
    const safe = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${input.folder}/${safe}`;
    const out = await storagePut(key, buf, input.contentType);
    return out;
  }),

  /* projects */
  createProject: adminProcedure.input(projectInput).mutation(async ({ input }) => {
    await db.insertProject({
      ...input,
      tagsJson: input.tagsJson ?? [],
    } as any);
    return { success: true } as const;
  }),
  updateProject: adminProcedure
    .input(idInput.merge(projectInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateProject(id, patch as any);
      return { success: true } as const;
    }),
  deleteProject: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteProject(input.id);
    return { success: true } as const;
  }),

  /* services */
  createService: adminProcedure.input(serviceInput).mutation(async ({ input }) => {
    await db.insertService(input);
    return { success: true } as const;
  }),
  updateService: adminProcedure
    .input(idInput.merge(serviceInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateService(id, patch);
      return { success: true } as const;
    }),
  deleteService: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteService(input.id);
    return { success: true } as const;
  }),

  /* processSteps */
  createProcessStep: adminProcedure.input(processStepInput).mutation(async ({ input }) => {
    await db.insertProcessStep(input);
    return { success: true } as const;
  }),
  updateProcessStep: adminProcedure
    .input(idInput.merge(processStepInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateProcessStep(id, patch);
      return { success: true } as const;
    }),
  deleteProcessStep: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteProcessStep(input.id);
    return { success: true } as const;
  }),

  /* skills */
  createSkill: adminProcedure.input(skillInput).mutation(async ({ input }) => {
    await db.insertSkill(input);
    return { success: true } as const;
  }),
  updateSkill: adminProcedure
    .input(idInput.merge(skillInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateSkill(id, patch);
      return { success: true } as const;
    }),
  deleteSkill: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteSkill(input.id);
    return { success: true } as const;
  }),

  /* testimonials */
  createTestimonial: adminProcedure.input(testimonialInput).mutation(async ({ input }) => {
    await db.insertTestimonial(input);
    return { success: true } as const;
  }),
  updateTestimonial: adminProcedure
    .input(idInput.merge(testimonialInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateTestimonial(id, patch);
      return { success: true } as const;
    }),
  deleteTestimonial: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteTestimonial(input.id);
    return { success: true } as const;
  }),

  /* tools */
  createTool: adminProcedure.input(toolInput).mutation(async ({ input }) => {
    await db.insertTool(input);
    return { success: true } as const;
  }),
  updateTool: adminProcedure
    .input(idInput.merge(toolInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateTool(id, patch);
      return { success: true } as const;
    }),
  deleteTool: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteTool(input.id);
    return { success: true } as const;
  }),

  /* socialLinks */
  createSocialLink: adminProcedure.input(socialLinkInput).mutation(async ({ input }) => {
    await db.insertSocialLink(input);
    return { success: true } as const;
  }),
  updateSocialLink: adminProcedure
    .input(idInput.merge(socialLinkInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateSocialLink(id, patch);
      return { success: true } as const;
    }),
  deleteSocialLink: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteSocialLink(input.id);
    return { success: true } as const;
  }),

  /* certifications */
  createCertification: adminProcedure.input(certificationInput).mutation(async ({ input }) => {
    await db.insertCertification(input as any);
    return { success: true } as const;
  }),
  updateCertification: adminProcedure
    .input(idInput.merge(certificationInput.partial()))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await db.updateCertification(id, patch as any);
      return { success: true } as const;
    }),
  deleteCertification: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteCertification(input.id);
    return { success: true } as const;
  }),


  /* contact messages */
  listMessages: adminProcedure.query(() => db.listContactMessages()),
  setMessageRead: adminProcedure
    .input(z.object({ id: z.number().int().positive(), read: z.boolean() }))
    .mutation(async ({ input }) => {
      await db.markMessageRead(input.id, input.read);
      return { success: true } as const;
    }),
  markMessageRead: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.markMessageRead(input.id, true);
    return { success: true } as const;
  }),
  deleteMessage: adminProcedure.input(idInput).mutation(async ({ input }) => {
    await db.deleteContactMessage(input.id);
    return { success: true } as const;
  }),
});
