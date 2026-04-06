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

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom 10%",
          scrub: isMobile ? 0.5 : 1,
          toggleClass: { targets: el, className: "scroll-skew-active" },
        },
      });

      tl.fromTo(
        el,
        {
          rotateX: isMobile ? -10 : -15,
          opacity: 0,
          scale: isMobile ? 0.97 : 0.95,
          y: isMobile ? 30 : 0,
        },
        {
          rotateX: 0,
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "none",
          duration: 0.4,
        }
      );

      tl.to(el, {
        rotateX: isMobile ? 8 : 12,
        opacity: 0.7,
        scale: isMobile ? 0.98 : 0.96,
        ease: "none",
        duration: 0.4,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-skew-section ${className}`}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d" as const,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
