import { useRef, useState, useEffect, useCallback } from "react";
import {
  Zap, Moon, Code2, Layers, Monitor, Bot, Sparkles, Palette,
  Shield, GitBranch, Gauge, Smartphone, ChevronLeft, ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Performance Optimized",
    desc: "Blazing fast load times with lazy loading, code splitting, and asset optimization built in from the ground up.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: Moon,
    title: "Dark Mode Support",
    desc: "Fully themed dark-first UI with five hand-crafted themes and smooth animated transitions between them.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    icon: Code2,
    title: "Source Code Access",
    desc: "Clean, well-structured, and commented source code — ready to fork, extend, or study at any depth.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    icon: Layers,
    title: "Interactive Components",
    desc: "Rich interactive elements — tilt cards, parallax backgrounds, scroll-driven reveals, and custom cursors.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    glow: "rgba(14,165,233,0.15)",
  },
  {
    icon: Monitor,
    title: "Responsive Design",
    desc: "Pixel-perfect on every screen — from 320px mobile to 4K monitors, with fluid layouts and adaptive navigation.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "rgba(244,63,94,0.15)",
  },
  {
    icon: Bot,
    title: "AI Automation Ready",
    desc: "Designed to plug into n8n and AI agent pipelines — the site itself can be extended with live chat, lead capture, and automation flows.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    icon: Sparkles,
    title: "Smooth Animations",
    desc: "GSAP ScrollTrigger-powered scroll animations, spring physics, and GPU-accelerated transitions throughout.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    glow: "rgba(20,184,166,0.15)",
  },
  {
    icon: Palette,
    title: "Multi-Theme Support",
    desc: "5 carefully crafted themes — Emerald Stealth, Cyber Amber, Midnight Royal, Mono Chrome, and iPhone Liquid Glass.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    glow: "rgba(249,115,22,0.15)",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "No trackers, no third-party data collection. All contact links open directly to WhatsApp, email, or GitHub.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "rgba(34,197,94,0.15)",
  },
  {
    icon: GitBranch,
    title: "Version Controlled",
    desc: "Every feature built with clean git history — structured commits, modular components, and zero technical debt.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "rgba(6,182,212,0.15)",
  },
  {
    icon: Gauge,
    title: "Accessibility Built-In",
    desc: "Respects prefers-reduced-motion, semantic HTML, keyboard navigation, and focus management across all components.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    glow: "rgba(236,72,153,0.15)",
  },
  {
    icon: Smartphone,
    title: "Mobile-First UX",
    desc: "Touch-friendly interactions, swipe gestures, collapsible navigation, and adaptive typography for every device.",
    color: "text-lime-400",
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    glow: "rgba(132,204,22,0.15)",
  },
];

function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else setCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export default function ProjectFeatures() {
  const visibleCount = useVisibleCount();
  const totalPages = Math.ceil(features.length / visibleCount);
  const [page, setPage] = useState(0);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const pageRef = useRef(0);
  const animatingRef = useRef(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((target: number) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setAnimDir("out");
    setTimeout(() => {
      pageRef.current = target;
      setPage(target);
      setAnimDir("in");
      setTimeout(() => { animatingRef.current = false; }, 350);
    }, 200);
  }, []);

  const prev = useCallback(() => {
    goTo(pageRef.current === 0 ? totalPages - 1 : pageRef.current - 1);
  }, [goTo, totalPages]);

  const next = useCallback(() => {
    goTo(pageRef.current === totalPages - 1 ? 0 : pageRef.current + 1);
  }, [goTo, totalPages]);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 4500);
  }, [next]);

  useEffect(() => {
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto]);

  const handlePrev = () => { prev(); startAuto(); };
  const handleNext = () => { next(); startAuto(); };
  const handleDot = (i: number) => { goTo(i); startAuto(); };

  const start = page * visibleCount;
  const visibleFeatures = features.slice(start, start + visibleCount);

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full opacity-8"
          style={{ background: `radial-gradient(ellipse, var(--theme-accent), transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full opacity-6"
          style={{ background: `radial-gradient(ellipse, var(--theme-secondary), transparent 70%)` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: "rgba(var(--theme-accent-rgb),0.25)", color: "var(--theme-accent)", background: "rgba(var(--theme-accent-rgb),0.08)" }}>
            <Sparkles className="w-3 h-3" />
            What's Inside
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[var(--app-font-display)] mb-4 text-gradient">
            Project Features
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-base sm:text-lg" style={{ color: "var(--theme-body)" }}>
            Every detail crafted with intention — explore the capabilities built into this portfolio.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(var(--theme-surface-rgb),0.8)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(var(--theme-accent-rgb),0.25)",
              color: "var(--theme-accent)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(var(--theme-surface-rgb),0.8)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(var(--theme-accent-rgb),0.25)",
              color: "var(--theme-accent)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="overflow-hidden px-2">
            <div
              ref={trackRef}
              className="grid gap-4 sm:gap-5"
              style={{
                gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1)",
                opacity: animDir === "out" ? 0 : 1,
                transform: animDir === "out" ? "translateY(12px)" : "translateY(0px)",
              }}
            >
              {visibleFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="reveal-card card-hover rounded-2xl border p-6 sm:p-7 flex flex-col gap-4"
                    style={{
                      background: `rgba(var(--theme-surface-rgb), 0.45)`,
                      borderColor: "rgba(var(--theme-accent-rgb), 0.1)",
                      boxShadow: `0 0 40px ${f.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                    }}
                  >
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${f.bg} ${f.border}`}>
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <div>
                      <h3 className={`text-base font-bold mb-2 font-[var(--app-font-display)] ${f.color}`}>
                        {f.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--theme-body)" }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === page ? "28px" : "8px",
                height: "8px",
                background: i === page ? "var(--theme-accent)" : "rgba(var(--theme-accent-rgb),0.25)",
                boxShadow: i === page ? `0 0 10px rgba(var(--theme-accent-rgb),0.5)` : "none",
              }}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--theme-muted)" }}>
          {page * visibleCount + 1}–{Math.min((page + 1) * visibleCount, features.length)} of {features.length} features
        </p>
      </div>
    </section>
  );
}
