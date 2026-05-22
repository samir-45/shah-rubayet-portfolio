import { useEffect, useState } from "react";

/**
 * Design system: dark editorial portfolio (purple-toned)
 * - Fixed top navbar inside a rounded pill that swaps to glass on scroll
 * - Section anchors using `.link-underline` and a magnetic CTA
 */
const links = [
  { href: "#work", label: "Work" },
  { href: "#certifications", label: "Certs" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container-editorial">
        <nav
          className={`flex items-center justify-between rounded-full px-5 md:px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass" : "bg-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="size-2 rounded-full bg-accent transition-transform group-hover:scale-125" />
            <span className="font-display text-sm sm:text-base tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">
              SHAH&nbsp;RUBAYET<span className="hidden sm:inline">&nbsp;AHMED</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-9 text-[12px] tracking-[0.18em] uppercase text-muted-foreground">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline hover:text-foreground transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <a
              href="#contact"
              className="magnetic-btn !py-2 !pl-5 !pr-2 !text-[11px]"
            >
              Let's Talk
              <span className="arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center size-10 rounded-full border border-border"
            aria-label="Toggle menu"
          >
            <span className="relative block w-4 h-[1.5px] bg-foreground before:content-[''] before:absolute before:-top-1.5 before:left-0 before:w-4 before:h-[1.5px] before:bg-foreground after:content-[''] after:absolute after:top-1.5 after:left-0 after:w-4 after:h-[1.5px] after:bg-foreground" />
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-6 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#work"
              onClick={() => setOpen(false)}
              className="ghost-btn !text-center !justify-center"
            >
              View Projects
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
