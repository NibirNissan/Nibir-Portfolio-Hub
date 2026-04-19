import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSkewProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollSkew({ children, className = "" }: ScrollSkewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      /* ── Section entrance animation ─────────────────────────────
         Use a plain duration-based tween (no scrub) so the section
         snaps to its final state rather than hovering half-visible
         and creating DOM-height blank gaps between sections.
         Removed rotateX and scale — those transforms keep the
         element at less-than-full visual height while it still
         occupies its full DOM height, creating the phantom gaps. */
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: isMobile ? 40 : 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
            onEnter: () => { el.style.willChange = "transform, opacity"; },
            onLeaveBack: () => { el.style.willChange = "auto"; },
          },
          onComplete: () => { el.style.willChange = "auto"; },
        }
      );

      /* ── Staggered card reveals inside the section ───────────── */
      const cards = el.querySelectorAll<HTMLElement>(".reveal-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: isMobile ? 30 : 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            onComplete: () => {
              cards.forEach((c) => { c.style.willChange = "auto"; });
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-skew-section ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}
