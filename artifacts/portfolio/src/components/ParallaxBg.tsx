import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxBg() {
  const ref = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const mesh = meshRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: isMobile ? -60 : -150,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      if (!isMobile && mesh) {
        gsap.to(mesh, {
          y: -80,
          rotation: 15,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        willChange: isMobile ? "auto" : "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "10%",
          width: isMobile ? "55vw" : "45vw",
          height: isMobile ? "55vw" : "45vw",
          maxWidth: isMobile ? 320 : 650,
          maxHeight: isMobile ? 320 : 650,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.05) 0%, transparent 70%)`,
          filter: isMobile ? "blur(50px)" : "blur(90px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          width: isMobile ? "45vw" : "40vw",
          height: isMobile ? "45vw" : "40vw",
          maxWidth: isMobile ? 280 : 550,
          maxHeight: isMobile ? 280 : 550,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(var(--theme-secondary-rgb), 0.04) 0%, transparent 70%)`,
          filter: isMobile ? "blur(40px)" : "blur(85px)",
        }}
      />

      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "55vw",
            height: "55vw",
            maxWidth: 750,
            maxHeight: 750,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.02) 0%, transparent 55%)`,
            filter: "blur(110px)",
          }}
        />
      )}

      {!isMobile && (
        <div
          ref={meshRef}
          style={{
            position: "absolute",
            top: "25%",
            left: "30%",
            width: "50vw",
            height: "50vw",
            maxWidth: 700,
            maxHeight: 700,
            borderRadius: "50%",
            background: `conic-gradient(
              from 0deg,
              rgba(var(--theme-accent-rgb), 0.015) 0deg,
              rgba(var(--theme-secondary-rgb), 0.01) 120deg,
              rgba(var(--theme-accent-rgb), 0.02) 240deg,
              rgba(var(--theme-accent-rgb), 0.015) 360deg
            )`,
            filter: "blur(120px)",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}
