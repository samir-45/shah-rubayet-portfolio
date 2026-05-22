import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Design system: dark editorial portfolio (purple-toned)
 * - Custom pointer with a small accent dot and a trailing ring
 * - Only enabled on devices with a fine pointer (desktop/mouse)
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2;
    let rx = x,
      ry = y;
    let scale = 1;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hoverRef.current = !!(t && t.closest("a, button, .project-card, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    let raf = 0;
    const tick = () => {
      rx += (x - rx) * 0.35;
      ry += (y - ry) * 0.35;
      
      const targetScale = hoverRef.current ? 1.6 : 1;
      scale += (targetScale - scale) * 0.2;

      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${scale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return createPortal(
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[70] size-9 rounded-full border border-accent/60 mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[70] size-1.5 rounded-full bg-accent"
      />
    </>,
    document.body
  );
}
