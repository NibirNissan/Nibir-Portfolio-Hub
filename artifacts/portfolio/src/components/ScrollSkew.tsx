import { useRef, useEffect, type ReactNode } from "react";

const managedElements = new Set<{ el: HTMLElement }>();
let scrollRafId = 0;
let listenerCount = 0;

function updateAll() {
  const vh = window.innerHeight;
  const viewCenter = vh / 2;

  managedElements.forEach(({ el }) => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = (center - viewCenter) / vh;
    const clamped = Math.max(-1, Math.min(1, distance));

    const rotateX = clamped * 3;
    const scale = 1 - Math.abs(clamped) * 0.03;
    const opacity = Math.max(0.6, 1 - Math.abs(clamped) * 0.15);

    el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) scale(${scale})`;
    el.style.opacity = String(opacity);
  });
}

function onScroll() {
  cancelAnimationFrame(scrollRafId);
  scrollRafId = requestAnimationFrame(updateAll);
}

interface ScrollSkewProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollSkew({ children, className = "" }: ScrollSkewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const entry = { el };
    managedElements.add(entry);

    if (listenerCount === 0) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    listenerCount++;

    updateAll();

    return () => {
      managedElements.delete(entry);
      listenerCount--;
      if (listenerCount === 0) {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(scrollRafId);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: "transform, opacity",
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}
