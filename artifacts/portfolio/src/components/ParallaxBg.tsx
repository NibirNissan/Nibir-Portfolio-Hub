import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }, el);

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
          top: "10%",
          left: "15%",
          width: isMobile ? "50vw" : "40vw",
          height: isMobile ? "50vw" : "40vw",
          maxWidth: isMobile ? 300 : 600,
          maxHeight: isMobile ? 300 : 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)",
          filter: isMobile ? "blur(40px)" : "blur(80px)",
        }}
      />
      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              right: "10%",
              width: "35vw",
              height: "35vw",
              maxWidth: 500,
              maxHeight: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50vw",
              height: "50vw",
              maxWidth: 700,
              maxHeight: 700,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.025) 0%, transparent 60%)",
              filter: "blur(100px)",
            }}
          />
        </>
      )}
    </div>
  );
}
