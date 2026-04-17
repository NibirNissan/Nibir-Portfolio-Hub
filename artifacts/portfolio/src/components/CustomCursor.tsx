import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const ring = useRef({ x: -999, y: -999 });
  const dotPos = useRef({ x: -999, y: -999 });
  const hovering = useRef(false);
  const ringScale = useRef(1);
  const rafId = useRef(0);
  const visible = useRef(false);

  useEffect(() => {
    // Bail out on touch/coarse-pointer devices — CSS also hides via @media
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    document.documentElement.classList.add("custom-cursor-active");

    const magneticSelector = "a, button, .card-hover, .skill-badge, [role='button']";
    const inputSelector = "input, textarea, select, [contenteditable]";
    let hoverCount = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!visible.current) {
        // Snap both cursors to actual position on first move so they don't
        // fly in from off-screen / the initial -999 position.
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
        dotPos.current.x = e.clientX;
        dotPos.current.y = e.clientY;
        visible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }

      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest(inputSelector)) {
        document.documentElement.classList.remove("custom-cursor-active");
      } else if (!document.documentElement.classList.contains("custom-cursor-active")) {
        document.documentElement.classList.add("custom-cursor-active");
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest(magneticSelector)) {
        hoverCount++;
        if (!hovering.current) {
          hovering.current = true;
          ringScale.current = 40 / 25;
          dotRef.current?.classList.add("cursor-hovering");
          ringRef.current?.classList.add("cursor-hovering");
        }
      }
    };

    const onPointerLeave = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest(magneticSelector)) {
        hoverCount = Math.max(0, hoverCount - 1);
        if (hoverCount === 0) {
          hovering.current = false;
          ringScale.current = 1;
          dotRef.current?.classList.remove("cursor-hovering");
          ringRef.current?.classList.remove("cursor-hovering");
        }
      }
    };

    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      if (visible.current) {
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    // Single RAF loop drives BOTH dot and ring — no DOM writes in event handlers
    const animate = () => {
      const lerp = hovering.current ? 0.1 : 0.14;

      // Dot: immediate snap to mouse (tiny lerp for sub-pixel smoothing only)
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.9;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.9;

      // Ring: lagged lerp for the trailing halo effect
      ring.current.x += (mouse.current.x - ring.current.x) * lerp;
      ring.current.y += (mouse.current.y - ring.current.y) * lerp;

      if (dotRef.current) {
        // translate3d forces GPU compositing layer — zero layout thrashing
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x - 12.5}px, ${ring.current.y - 12.5}px, 0) scale(${ringScale.current})`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("pointerenter", onPointerEnter, true);
    document.addEventListener("pointerleave", onPointerLeave, true);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerenter", onPointerEnter, true);
      document.removeEventListener("pointerleave", onPointerLeave, true);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps instantly to pointer position */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--cursor-dot-color, #10b981)",
          pointerEvents: "none",
          zIndex: 999999,
          opacity: 0,                      // hidden until first mousemove
          willChange: "transform, opacity",
          transition: "opacity 0.15s ease, background 0.3s ease",
        }}
      />
      {/* Ring — lazily follows with lerp for the halo trail */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 25,
          height: 25,
          borderRadius: "50%",
          border: "1.5px solid rgba(var(--theme-accent-rgb), 0.5)",
          boxShadow: "0 0 10px rgba(var(--theme-accent-rgb), 0.2), 0 0 20px rgba(var(--theme-accent-rgb), 0.08)",
          pointerEvents: "none",
          zIndex: 999999,
          opacity: 0,                      // hidden until first mousemove
          willChange: "transform, opacity",
          transformOrigin: "center center",
          transition: "opacity 0.2s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      />
    </>
  );
}
