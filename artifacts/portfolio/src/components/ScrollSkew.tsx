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
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: isMobile ? 60 : 100,
          rotateX: isMobile ? 0 : -15,
          scale: isMobile ? 1 : 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 40%",
            scrub: 1,
            toggleClass: { targets: el, className: "scroll-skew-active" },
            onEnter: () => { el.style.willChange = "transform, opacity"; },
            onLeave: () => { el.style.willChange = "auto"; },
            onEnterBack: () => { el.style.willChange = "transform, opacity"; },
            onLeaveBack: () => { el.style.willChange = "auto"; },
          },
        }
      );

      const cards = el.querySelectorAll<HTMLElement>(".reveal-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: isMobile ? 40 : 70,
            rotateX: isMobile ? 0 : -10,
            scale: isMobile ? 1 : 0.95,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );

        cards.forEach((card) => {
          card.style.willChange = "auto";
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          end: "top 25%",
          onEnter: () => cards.forEach((c) => { c.style.willChange = "transform, opacity"; }),
          onLeave: () => cards.forEach((c) => { c.style.willChange = "auto"; }),
          onEnterBack: () => cards.forEach((c) => { c.style.willChange = "transform, opacity"; }),
          onLeaveBack: () => cards.forEach((c) => { c.style.willChange = "auto"; }),
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-skew-section ${className}`}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d" as const,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}
