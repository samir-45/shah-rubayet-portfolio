/**
 * Public portfolio page — entirely DB-driven via tRPC.
 * Sections, copy, projects, services, testimonials, skills, tools and links
 * all come from the admin dashboard.
 */
import { Cursor } from "@/components/portfolio/Cursor";
import { Navbar } from "@/components/portfolio/Navbar";
import { Reveal } from "@/components/portfolio/Reveal";
import { trpc } from "@/lib/trpc";
import type { SiteSettings } from "@shared/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { toast } from "sonner";

type HeroFeature = [string, string];
type AboutStat = { value: string; label: string };

function Hero({ s }: { s: SiteSettings }) {
  const features = (s.heroFeatures as HeroFeature[] | null) ?? [];
  return (
    <section id="top" className="relative pt-36 md:pt-44 pb-24 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 ambient-glow pointer-events-none" />
      <div className="container-editorial relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                {s.heroEyebrow}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 font-display font-bold leading-[1.02] tracking-tight text-5xl md:text-6xl lg:text-[64px] whitespace-pre-line">
                {s.heroHeadline}
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty whitespace-pre-line">
                {s.heroDescription}
              </p>
            </Reveal>
            <Reveal delay={340}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#work" className="magnetic-btn">
                  View Projects
                  <span className="arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
                {s.cvUrl ? (
                  <a href={s.cvUrl} target="_blank" rel="noopener noreferrer" className="ghost-btn">
                    Download My CV
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 relative">
            <Reveal delay={200}>
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-tr from-accent/20 via-transparent to-olive/10 rounded-[2.5rem] blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card aspect-[5/4] md:aspect-[4/3]">
                  {s.heroPortraitUrl ? (
                    <img
                      src={s.heroPortraitUrl}
                      alt={`Portrait of ${s.ownerName}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                      No portrait set
                    </div>
                  )}
                </div>
                <div className="glass absolute -left-2 sm:-left-4 md:-left-10 bottom-10 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-2xl">
                  <div className="size-7 sm:size-9 rounded-full bg-accent/20 grid place-items-center text-accent">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-4 sm:h-4">
                      <path d="M12 20l9-16H3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {s.heroAvailabilityLabel}
                    </div>
                    <div className="text-xs sm:text-sm">{s.heroAvailabilityValue}</div>
                  </div>
                </div>
                <div className="glass absolute -right-2 sm:-right-3 md:-right-8 top-10 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-2xl">
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {s.heroLocationLabel}
                  </div>
                  <div className="text-xs sm:text-sm font-medium">{s.heroLocationValue}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {features.length > 0 ? (
          <Reveal delay={400}>
            <div className="mt-20 md:mt-28 hairline pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {features.map(([t, d]) => (
                <div key={t}>
                  <div className="text-[11px] uppercase tracking-[0.22em] font-medium">{t}</div>
                  <div className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function Tools() {
  const { data: tools = [] } = trpc.portfolio.listTools.useQuery();
  const { data: settings } = trpc.portfolio.getSiteSettings.useQuery();
  if (!tools.length) return null;
  return (
    <section className="py-20 md:py-24 border-y border-border">
      <div className="container-editorial">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Tools)</div>
              <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight max-w-xl">
                {settings?.toolsHeadline ?? "Software I design with"}
              </h2>
            </div>
            {settings?.toolsIntro ? (
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">{settings.toolsIntro}</p>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {tools.map(t => (
              <div
                key={t.id}
                className="group bg-background flex flex-col items-center justify-center gap-3 py-8 px-4 transition-colors hover:bg-card"
                title={t.name}
              >
                <img
                  src={t.imageUrl || (t.slug ? `https://cdn.simpleicons.org/${t.slug}/ffffff` : "")}
                  alt={`${t.name} logo`}
                  width={36}
                  height={36}
                  loading="lazy"
                  className="size-9 opacity-70 group-hover:opacity-100 transition-opacity object-contain"
                  onError={e => {
                    const img = e.target as HTMLImageElement;
                    if (t.slug && img.src && !img.src.endsWith(`/icons/${t.slug}.svg`)) {
                      img.src = `/icons/${t.slug}.svg`;
                    }
                  }}
                />
                <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground group-hover:text-foreground transition-colors">
                  {t.name}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About({ s }: { s: SiteSettings }) {
  const stats = (s.aboutStats as AboutStat[] | null) ?? [];
  return (
    <section id="about" className="py-28 md:py-40">
      <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">{s.aboutEyebrow}</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[0.95] whitespace-pre-line">
              {s.aboutHeadline}
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:pt-10">
          <Reveal delay={150}>
            {s.aboutBody.split(/\n{2,}/).map((p: string, i: number) => (
              <p key={i} className={`text-[15px] leading-relaxed text-muted-foreground ${i > 0 ? "mt-5" : ""}`}>
                {p}
              </p>
            ))}
          </Reveal>
          {stats.length > 0 ? (
            <Reveal delay={250}>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 hairline pt-8">
                {stats.map(stat => (
                  <div key={stat.label}>
                    <div className="font-display text-4xl md:text-5xl">{stat.value}</div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const { data: services = [] } = trpc.portfolio.listServices.useQuery();
  const { data: settings } = trpc.portfolio.getSiteSettings.useQuery();
  if (!services.length) return null;
  return (
    <section id="services" className="py-28 md:py-36 border-t border-border">
      <div className="container-editorial">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <Reveal>
            <div>
              <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Services)</div>
              <h2 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] max-w-2xl">
                {settings?.servicesHeadline ?? "What I can build for you"}
              </h2>
            </div>
          </Reveal>
          {settings?.servicesIntro ? (
            <Reveal delay={150}>
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">{settings.servicesIntro}</p>
            </Reveal>
          ) : null}
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {services.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 60}>
              <div className="group relative bg-background p-8 md:p-10 h-full transition-colors duration-500 hover:bg-card">
                <div className="flex items-start justify-between">
                  <div className="text-[11px] tracking-[0.3em] text-muted-foreground">{svc.number}</div>
                  <div className="size-9 rounded-full border border-border grid place-items-center transition-transform duration-500 group-hover:rotate-45 group-hover:border-accent">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-12 font-display text-3xl md:text-4xl">{svc.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  const { data: projects = [] } = trpc.portfolio.listProjects.useQuery();
  const { data: settings } = trpc.portfolio.getSiteSettings.useQuery();
  if (!projects.length) return null;
  return (
    <section id="work" className="py-28 md:py-40 border-t border-border">
      <div className="container-editorial">
        <div className="flex items-end justify-between gap-8">
          <Reveal>
            <div>
              <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Selected Work)</div>
              <h2 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95]">
                {settings?.workHeadline ?? "Featured projects"}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={150} className="hidden md:block">
            <a href="#contact" className="ghost-btn">
              All Case Studies
            </a>
          </Reveal>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 md:auto-rows-[280px] gap-5">
          {projects.map((p, i) => {
            const tags = (p.tagsJson as string[] | null) ?? [];
            const span = p.spanClass || "md:col-span-1 md:row-span-1";
            return (
              <Reveal key={p.id} delay={i * 80} className={`${span} col-span-1 h-full`}>
                <a
                  href={p.href || "#"}
                  target={p.href ? "_blank" : undefined}
                  rel={p.href ? "noopener noreferrer" : undefined}
                  className="project-card group block h-full"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card h-full min-h-[280px]">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={`${p.title} — ${p.category}`}
                        loading="lazy"
                        className="project-img absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-90" />
                    <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-[11px] tracking-[0.22em] uppercase">
                      <span className="text-foreground/80">{p.category}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        View
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-display text-2xl sm:text-3xl md:text-5xl leading-none">{p.title}</h3>
                      <p className="mt-3 max-w-md text-[13px] text-muted-foreground">{p.description}</p>
                      {tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {tags.map(t => (
                            <span
                              key={t}
                              className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border border-border bg-background/40 backdrop-blur"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  const { data: certs = [] } = trpc.portfolio.listCertifications.useQuery();
  if (!certs.length) return null;
  return (
    <section id="certifications" className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-olive/5 blur-3xl" />
      </div>
      <div className="container-editorial relative">
        <Reveal>
          <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Certifications)</div>
          <h2 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            Credentials &amp; achievements
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <div className="group relative glass rounded-3xl p-7 h-full flex flex-col gap-5 border border-border/50 hover:border-accent/40 transition-all duration-500 hover:shadow-[0_0_40px_-8px_oklch(0.78_0.14_295/0.15)]">
                {/* Top row: badge + title */}
                <div className="flex items-start gap-4">
                  {c.imageUrl ? (
                    <div className="shrink-0 size-14 rounded-2xl border border-border bg-background/60 grid place-items-center overflow-hidden p-1">
                      <img
                        src={c.imageUrl}
                        alt={`${c.issuer} badge`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="shrink-0 size-14 rounded-2xl border border-border bg-gradient-to-br from-accent/20 to-olive/20 grid place-items-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                        <path d="M12 15l-2 5-6-6 5-2m5 2l2 5 6-6-5-2" />
                        <circle cx="12" cy="8" r="5" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg leading-snug group-hover:text-accent transition-colors duration-300">
                      {c.title}
                    </h3>
                    <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
                      {c.issuer}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {c.description ? (
                  <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">{c.description}</p>
                ) : <div className="flex-1" />}

                {/* Footer: date + credential link */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  {c.issueDate ? (
                    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                      {c.issueDate}
                    </span>
                  ) : <span />}
                  {c.credentialUrl ? (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-accent hover:text-foreground transition-colors"
                    >
                      Verify
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </a>
                  ) : c.credentialId ? (
                    <span className="text-[10px] font-mono text-muted-foreground/60">ID: {c.credentialId}</span>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


function Process() {
  const { data: steps = [] } = trpc.portfolio.listProcessSteps.useQuery();
  const { data: settings } = trpc.portfolio.getSiteSettings.useQuery();
  if (!steps.length) return null;
  return (
    <section id="process" className="py-28 md:py-36 border-t border-border">
      <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
          <Reveal>
            <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Process)</div>
            <h2 className="mt-5 font-display text-5xl md:text-6xl leading-[0.95]">
              {settings?.processHeadline ?? "A streamlined process"}
            </h2>
            {settings?.processIntro ? (
              <p className="mt-6 text-sm text-muted-foreground max-w-sm leading-relaxed">
                {settings.processIntro}
              </p>
            ) : null}
          </Reveal>
        </div>
        <ul className="lg:col-span-8 flex flex-col">
          {steps.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <li className="group grid grid-cols-12 items-baseline gap-6 py-8 border-t border-border last:border-b">
                <span className="col-span-2 md:col-span-1 text-[11px] tracking-[0.3em] text-muted-foreground">
                  {p.number}
                </span>
                <h3 className="col-span-10 md:col-span-4 font-display text-3xl md:text-4xl transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="col-span-12 md:col-span-7 text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Testimonials() {
  const { data: testimonials = [] } = trpc.portfolio.listTestimonials.useQuery();
  const { data: settings } = trpc.portfolio.getSiteSettings.useQuery();
  if (!testimonials.length) return null;
  return (
    <section className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 ambient-glow opacity-60 pointer-events-none" />
      <div className="container-editorial relative">
        <Reveal>
          <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Words)</div>
          <h2 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            {settings?.testimonialsHeadline ?? "Kind things people have said"}
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <figure className="glass rounded-3xl p-8 h-full flex flex-col">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-6 text-lg leading-relaxed text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                  <div className="size-11 rounded-full bg-gradient-to-br from-accent/40 to-olive/40 grid place-items-center font-display text-base">
                    {t.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const { data: skills = [] } = trpc.portfolio.listSkills.useQuery();
  const { data: settings } = trpc.portfolio.getSiteSettings.useQuery();
  if (!skills.length) return null;
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Toolkit)</div>
            <h2 className="mt-5 font-display text-5xl md:text-6xl leading-[0.95]">
              {settings?.skillsHeadline ?? "Skills sharpened over years"}
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
          {skills.map((s, i) => (
            <Reveal key={s.id} delay={i * 50}>
              <div>
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-xl tracking-wider">{s.name.toUpperCase()}</div>
                  <div className="text-[11px] tracking-[0.2em] text-muted-foreground">{s.value}%</div>
                </div>
                <div className="mt-3 h-px bg-border relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-[1400ms] ease-out"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ s }: { s: SiteSettings }) {
  const { data: socials = [] } = trpc.portfolio.listSocialLinks.useQuery();
  const contactCards = [
    s.contactPhone ? { label: "Cell", value: s.contactPhone, href: `tel:${s.contactPhone.replace(/\s+/g, "")}` } : null,
    { label: "Email", value: s.contactEmail, href: `mailto:${s.contactEmail}` },
    s.contactLinkedinUrl
      ? {
          label: "LinkedIn",
          value: s.contactLinkedinLabel || s.contactLinkedinUrl,
          href: s.contactLinkedinUrl,
        }
      : null,
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section id="contact" className="py-32 md:py-48 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 ambient-glow pointer-events-none" />
      <div className="container-editorial text-center relative">
        <Reveal>
          <div className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">(Contact)</div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-6 font-display text-6xl md:text-[10vw] leading-[0.9] whitespace-pre-line">
            {s.contactHeadline ?? "Let's make something great"}
          </h2>
        </Reveal>
        {s.contactBody ? (
          <Reveal delay={200}>
            <p className="mt-8 max-w-lg mx-auto text-muted-foreground">{s.contactBody}</p>
          </Reveal>
        ) : null}
        <Reveal delay={300}>
          <div className="mt-10 flex justify-center">
            <a href={`mailto:${s.contactEmail}`} className="magnetic-btn">
              {s.contactEmail}
              <span className="arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-14">
            <ContactForm />
          </div>
        </Reveal>
        {contactCards.length > 0 ? (
          <Reveal delay={350}>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-border max-w-3xl mx-auto rounded-2xl overflow-hidden">
              {contactCards.map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="bg-background px-6 py-7 text-left hover:bg-card transition-colors group"
                >
                  <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{c.label}</div>
                  <div className="mt-3 text-sm md:text-base text-foreground break-all group-hover:text-accent transition-colors">
                    {c.value}
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        ) : null}
        {socials.length > 0 ? (
          <Reveal delay={400}>
            <div className="mt-14 flex flex-wrap justify-center gap-6 text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
              {socials.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const submit = trpc.portfolio.submitMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent — I'll be in touch.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: e => toast.error(e.message || "Failed to send"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Name, email and message are required");
      return;
    }
    submit.mutate({ name, email, subject: subject || undefined, message });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto text-left grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      <input
        className="col-span-1 px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="email"
        className="col-span-1 px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="md:col-span-2 px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder="Subject (optional)"
        value={subject}
        onChange={e => setSubject(e.target.value)}
      />
      <textarea
        className="md:col-span-2 px-4 py-3 rounded-xl bg-card border border-border text-sm min-h-[140px] focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder="Tell me about the project…"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="magnetic-btn" disabled={submit.isPending}>
          {submit.isPending ? "Sending…" : "Send message"}
          <span className="arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </form>
  );
}

function Footer({ s }: { s: SiteSettings }) {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-editorial flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-accent" />
          <span className="font-display text-base tracking-[0.1em] sm:tracking-[0.2em]">{s.brandName}</span>
        </a>
        <div className="flex flex-wrap gap-6 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          <a href="#work" className="hover:text-foreground">Work</a>
          <a href="#about" className="hover:text-foreground">About</a>
          <a href="#services" className="hover:text-foreground">Services</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">{s.footerCopyright}</span>
          <a href="#top" className="ghost-btn !py-2 !px-3" aria-label="Back to top">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { data: settings, isLoading } = trpc.portfolio.getSiteSettings.useQuery();

  useEffect(() => {
    if (isLoading || !settings) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Intercept anchor link clicks to animate them smoothly via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId || "top");
        if (targetElement) {
          lenis.scrollTo(targetElement);
        } else if (href === "#") {
          lenis.scrollTo(0);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, [isLoading, settings]);

  if (isLoading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="min-h-screen grid place-items-center text-center px-6">
        <div>
          <h1 className="font-display text-3xl">Portfolio not yet configured</h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to <code className="font-mono">/admin</code> to set up your content.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative noise">
      <Cursor />
      <Navbar />
      <Hero s={settings} />
      <Tools />
      <About s={settings} />
      <Services />
      <Work />
      <Certifications />
      <Process />
      <Testimonials />
      <Skills />
      <Contact s={settings} />
      <Footer s={settings} />
    </main>
  );
}
