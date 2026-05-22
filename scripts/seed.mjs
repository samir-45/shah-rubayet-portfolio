// Seed the portfolio database with current site content.
// Idempotent: only inserts if a table is empty (or for siteSettings, only if id=1 missing).
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

const portrait = "/manus-storage/portrait_00422057.jpg";
const projectEato = "/manus-storage/project-eato_5f80870e.jpg";
const projectBalance = "/manus-storage/project-balanceflow_883c51a4.jpg";
const projectNest = "/manus-storage/project-nest_d9ae7d54.jpg";
const projectPlaybook = "/manus-storage/project-playbook_79402323.jpg";
const projectCaretap = "/manus-storage/project-caretap_72c5e22e.jpg";
const cvUrl = "/manus-storage/cv_cb5dbff1.pdf";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
const sql = neon(url);

async function isEmpty(table) {
  const rows = await sql.query(`SELECT COUNT(*)::int AS n FROM "${table}"`);
  return rows[0].n === 0;
}

// --- siteSettings (singleton row id=1) ---
const settingsRows = await sql.query('SELECT id FROM "siteSettings" WHERE id = 1');
if (settingsRows.length === 0) {
  await sql.query(
    `INSERT INTO "siteSettings" (
      id, "brandName", "ownerName", location,
      "heroEyebrow", "heroHeadline", "heroDescription", "heroPortraitUrl",
      "heroAvailabilityLabel", "heroAvailabilityValue", "heroLocationLabel", "heroLocationValue",
      "cvUrl", "heroFeatures",
      "aboutEyebrow", "aboutHeadline", "aboutBody", "aboutStats",
      "servicesHeadline", "servicesIntro", "workHeadline",
      "processHeadline", "processIntro", "testimonialsHeadline",
      "skillsHeadline", "toolsHeadline", "toolsIntro",
      "contactHeadline", "contactBody",
      "contactEmail", "contactPhone", "contactLinkedinLabel", "contactLinkedinUrl",
      "footerCopyright"
    )
     VALUES (
      1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33
     )`,
    [
      "SHAH RUBAYET",
      "Shah Rubayet Ahmed",
      "Dhaka, BD — UTC+6",
      "Hey, I'm Shah Rubayet",
      "A UI/UX & Brand Designer",
      "Transforming ideas into intuitive, editorial digital products — interfaces, brand systems and prototypes for teams who care about craft.",
      portrait,
      "Available",
      "For Q1 ‘26 projects",
      "Based in",
      "Dhaka, BD — UTC+6",
      cvUrl,
      JSON.stringify([
        ["User-Centered Design", "Engaging experiences tailored to your audience."],
        ["Brand Identity & Strategy", "Visual storytelling that makes your brand unforgettable."],
        ["Responsive & Modern UI", "Pixel-perfect designs optimised for every device."],
        ["Seamless Prototypes", "Interactive mockups ready for engineering hand-off."],
      ]),
      "(About)",
      "Crafting meaningful digital experiences",
      "I'm Shah Rubayet Ahmed — a UI/UX & brand designer based in Dhaka. I help founders and product teams turn ambiguous problems into clear, user-centered products with a strong editorial voice.\n\nI trained through the Google UX Design Certificate and Grameenphone Academy's Figma Design System program, and I've been shipping work across SaaS, fintech, healthcare and food delivery since.",
      JSON.stringify([
        { value: "1+", label: "Years designing" },
        { value: "20+", label: "Projects shipped" },
        { value: "10+", label: "Happy clients" },
      ]),
      "What I can build for you",
      "Six core practices — combined when a project needs more than one, and never bolted on for the sake of scope.",
      "Featured projects",
      "A streamlined process for exceptional design",
      "A clear, repeatable system — six steps that turn ambiguity into a polished, shippable product.",
      "Kind things people have said",
      "Skills sharpened over years",
      "Software I design with",
      "A focused, opinionated toolkit — Figma for product, Framer & Webflow for the web, and the Adobe suite for brand and editorial craft.",
      "Let's make something great",
      "Available for select UI/UX, brand and Framer engagements from Q1 2026. Reach out — I read every message personally.",
      "shahrubayet@gmail.com",
      "+880 1619 868693",
      "shah-rubayet-ahmed",
      "https://www.linkedin.com/in/shah-rubayet-ahmed",
      "© 2026 — Dhaka",
    ],
  );
  console.log("siteSettings: inserted");
} else {
  console.log("siteSettings: present, skipping");
}

// --- services ---
if (await isEmpty("services")) {
  const services = [
    ["01", "UI/UX Design", "Interfaces that feel inevitable — clear flows, deliberate hierarchy, real users at the centre."],
    ["02", "Brand Identity", "Visual systems with a point of view. Marks, type, and voice that compound over time."],
    ["03", "Web Design", "Editorial sites and marketing surfaces engineered for clarity, speed and conversion."],
    ["04", "Mobile App Design", "Native-feeling iOS & Android experiences with rigorous attention to gesture and motion."],
    ["05", "Design Systems", "Token-driven libraries in Figma that scale across teams without losing craft."],
    ["06", "Framer Development", "Production builds in Framer with motion, CMS and pixel-honest fidelity."],
  ];
  for (let i = 0; i < services.length; i++) {
    const [n, t, d] = services[i];
    await sql.query(
      `INSERT INTO "services" (number, title, description, "sortOrder", published) VALUES ($1, $2, $3, $4, true)`,
      [n, t, d, i],
    );
  }
  console.log("services: inserted", services.length);
}

// --- projects ---
if (await isEmpty("projects")) {
  const projectsData = [
    {
      img: projectEato,
      cat: "Mobile · Food Delivery",
      title: "EATO",
      desc: "A seamless food delivery app — warm, intuitive and built around the ordering rhythm.",
      tags: ["iOS", "Mobile App", "UI/UX"],
      href: "https://www.behance.net/gallery/243901837/EATO-A-Seamless-Food-Delivery-App",
      span: "md:col-span-2 md:row-span-1",
    },
    {
      img: projectBalance,
      cat: "Fintech · Dashboard",
      title: "BalanceFlow",
      desc: "A personal finance command-centre that reframes balance, income and outcome.",
      tags: ["Fintech", "Dashboard"],
      href: "https://www.behance.net/gallery/244920275/BalanceFlow-Personal-Finance-Fintech-Dashboard",
      span: "md:col-span-1 md:row-span-2",
    },
    {
      img: projectNest,
      cat: "Web · Coworking",
      title: "NEST Corner",
      desc: "A coworking space web design — calm, editorial and built to convert curious visitors into members.",
      tags: ["Web Design", "Branding"],
      href: "https://www.behance.net/gallery/246723179/NEST-Corner-Coworking-Space-Web-Design",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      img: projectPlaybook,
      cat: "Web · Editorial",
      title: "The Daily Playbook",
      desc: "A sports news editorial experience — bold typography, rhythmic layouts, story-first hierarchy.",
      tags: ["Editorial", "Web Design"],
      href: "https://www.behance.net/gallery/246720335/The-Daily-Playbook-Sports-News-Editorial-Web-Design",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      img: projectCaretap,
      cat: "Healthcare · App",
      title: "CareTap",
      desc: "Bridging patients and professional medical care in a single, considered tap.",
      tags: ["Healthcare", "Mobile App"],
      href: "https://www.behance.net/gallery/243907819/CareTap-Medical-Appointment-Healthcare-App",
      span: "md:col-span-3 md:row-span-1",
    },
  ];
  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i];
    await sql.query(
      `INSERT INTO "projects" (title, category, description, "imageUrl", href, "tagsJson", "spanClass", "sortOrder", published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)`,
      [p.title, p.cat, p.desc, p.img, p.href, JSON.stringify(p.tags), p.span, i],
    );
  }
  console.log("projects: inserted", projectsData.length);
}

// --- processSteps ---
if (await isEmpty("processSteps")) {
  const steps = [
    ["01", "Discover", "Interviews, audits, business and user goals — set the brief."],
    ["02", "Research", "Synthesis, competitive teardown, jobs-to-be-done mapping."],
    ["03", "Wireframe", "Architecture, flows, low-fi explorations to derisk the shape."],
    ["04", "Design", "High fidelity craft, components, motion language, edge cases."],
    ["05", "Prototype", "Interactive prototypes & usability rounds to validate."],
    ["06", "Deliver", "Tokens, hand-off, design ops — and a system that ships."],
  ];
  for (let i = 0; i < steps.length; i++) {
    const [n, t, d] = steps[i];
    await sql.query(
      `INSERT INTO "processSteps" (number, title, description, "sortOrder", published) VALUES ($1, $2, $3, $4, true)`,
      [n, t, d, i],
    );
  }
  console.log("processSteps: inserted", steps.length);
}

// --- skills ---
if (await isEmpty("skills")) {
  const skillsList = [
    ["UI Design", 96],
    ["UX Research", 88],
    ["Figma", 98],
    ["Design Systems", 92],
    ["Framer", 84],
    ["Prototyping", 94],
    ["Webflow", 78],
    ["Branding", 86],
  ];
  for (let i = 0; i < skillsList.length; i++) {
    const [n, v] = skillsList[i];
    await sql.query(
      `INSERT INTO "skills" (name, value, "sortOrder", published) VALUES ($1, $2, $3, true)`,
      [n, v, i],
    );
  }
  console.log("skills: inserted", skillsList.length);
}

// --- testimonials ---
if (await isEmpty("testimonials")) {
  const t = [
    ["Ayesha Karim", "Founder, Northline Studio", "Rubayet thinks in systems and ships with the patience of a craftsman. Our product finally feels like a brand.", 5],
    ["Daniyal Khan", "Product Lead, BalanceFlow", "Rare combination of editorial taste and product rigour. Every screen reads like it had a hundred small decisions behind it.", 5],
    ["Sara Lindgren", "Design Manager, Orbit", "He raised the bar for the entire team. Calm, sharp, fast — the dashboard is the best work we've shipped.", 5],
  ];
  for (let i = 0; i < t.length; i++) {
    const [name, role, quote, rating] = t[i];
    await sql.query(
      `INSERT INTO "testimonials" (name, role, quote, rating, "sortOrder", published) VALUES ($1, $2, $3, $4, $5, true)`,
      [name, role, quote, rating, i],
    );
  }
  console.log("testimonials: inserted", t.length);
}

// --- tools ---
if (await isEmpty("tools")) {
  const toolsList = [
    ["Figma", "figma"],
    ["Framer", "framer"],
    ["Adobe XD", "adobexd"],
    ["Photoshop", "adobephotoshop"],
    ["Illustrator", "adobeillustrator"],
  ];
  for (let i = 0; i < toolsList.length; i++) {
    const [n, s] = toolsList[i];
    await sql.query(
      `INSERT INTO "tools" (name, slug, "sortOrder", published) VALUES ($1, $2, $3, true)`,
      [n, s, i],
    );
  }
  console.log("tools: inserted", toolsList.length);
}

// --- socialLinks ---
if (await isEmpty("socialLinks")) {
  const links = [
    ["LinkedIn", "https://www.linkedin.com/in/shah-rubayet-ahmed"],
    ["Behance", "https://www.behance.net/shahrubayet"],
    ["Dribbble", "#"],
    ["Instagram", "#"],
  ];
  for (let i = 0; i < links.length; i++) {
    const [n, u] = links[i];
    await sql.query(
      `INSERT INTO "socialLinks" (name, url, "sortOrder", published) VALUES ($1, $2, $3, true)`,
      [n, u, i],
    );
  }
  console.log("socialLinks: inserted", links.length);
}

// --- users ---
if (await isEmpty("users")) {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
  const pwdHash = hashPassword(adminPassword);
  
  await sql.query(
    `INSERT INTO "users" ("openId", "username", "passwordHash", "name", "email", "loginMethod", "role") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      adminUsername,
      adminUsername,
      pwdHash,
      "Admin",
      "admin@example.com",
      "credentials",
      "admin"
    ]
  );
  console.log(`users: inserted default admin user (${adminUsername})`);
}

console.log("Seed complete.");
