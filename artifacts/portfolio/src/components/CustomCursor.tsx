import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const ringScale = useRef(1);
  const rafId = useRef(0);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
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

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }

      const target = e.target as HTMLElement;
      if (target.closest(inputSelector)) {
        document.documentElement.classList.remove("custom-cursor-active");
      } else if (!document.documentElement.classList.contains("custom-cursor-active")) {
        document.documentElement.classList.add("custom-cursor-active");
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(magneticSelector)) {
        hoverCount++;
        if (!hovering.current) {
          hovering.current = true;
          ringScale.current = 40 / 25;
          if (dotRef.current) dotRef.current.classList.add("cursor-hovering");
          if (ringRef.current) ringRef.current.classList.add("cursor-hovering");
        }
      }
    };

    const onPointerLeave = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(magneticSelector)) {
        hoverCount = Math.max(0, hoverCount - 1);
        if (hoverCount === 0) {
          hovering.current = false;
          ringScale.current = 1;
          if (dotRef.current) dotRef.current.classList.remove("cursor-hovering");
          if (ringRef.current) ringRef.current.classList.remove("cursor-hovering");
        }
      }
    };

    const animate = () => {
      const lerp = hovering.current ? 0.12 : 0.15;
      ring.current.x += (mouse.current.x - ring.current.x) * lerp;
      ring.current.y += (mouse.current.y - ring.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 12.5}px, ${ring.current.y - 12.5}px) scale(${ringScale.current})`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("pointerenter", onPointerEnter, true);
    document.addEventListener("pointerleave", onPointerLeave, true);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerenter", onPointerEnter, true);
      document.removeEventListener("pointerleave", onPointerLeave, true);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
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
          background: "#10b981",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "opacity 0.2s ease",
          willChange: "transform",
        }}
      />
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
          border: "1.5px solid rgba(16, 185, 129, 0.5)",
          boxShadow: "0 0 10px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.08)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "opacity 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          willChange: "transform",
          transformOrigin: "center center",
        }}
      />
    </>
  );
}
