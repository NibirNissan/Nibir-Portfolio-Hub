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
    if (prefersReduced) return;

    const isMobile = window.innerWidth < 768;

    // If the section is already in or past the viewport on mount,
    // skip the entrance animation entirely so it never gets stuck invisible.
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight;

    const ctx = gsap.context(() => {
      if (alreadyInView) {
        gsap.set(el, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: isMobile ? 30 : 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=50",
              toggleActions: "play none none none",
              onEnter: () => { el.style.willChange = "transform, opacity"; },
            },
            onComplete: () => { el.style.willChange = "auto"; },
          }
        );
      }

      const cards = el.querySelectorAll<HTMLElement>(".reveal-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: isMobile ? 20 : 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.07,
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=20",
              toggleActions: "play none none none",
            },
            onComplete: () => {
              cards.forEach((c) => { c.style.willChange = "auto"; });
            },
          }
        );
      }
    }, el);

    // Recompute trigger positions once the layout settles (images/fonts loaded)
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    // Safety net: if for any reason a trigger doesn't fire within 1.2s,
    // force the section visible so the page never has phantom gaps.
    const safetyId = window.setTimeout(() => {
      if (parseFloat(getComputedStyle(el).opacity) < 0.95) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
      }
    }, 1200);

    return () => {
      window.clearTimeout(refreshId);
      window.clearTimeout(safetyId);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className={`scroll-skew-section ${className}`}>
      {children}
    </div>
  );
}
