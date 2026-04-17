import { useEffect, useRef, useCallback, useState } from "react";
import { useParams, useLocation } from "wouter";
import { getProjectBySlug } from "@/data/projects";
import type { ProjectData } from "@/data/projects";
import type { FirestoreProject } from "@/lib/firestoreTypes";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { trackEvent } from "@/lib/analytics";
import NebulaBg from "@/components/NebulaBg";
import ScanLine from "@/components/ScanLine";
import ScrollReveal from "@/components/ScrollReveal";
import BackButton from "@/components/BackButton";
import ProjectNav from "@/components/ProjectNav";
import { Sparkles, AlertTriangle, Cpu, Zap } from "lucide-react";

type PageProject = Omit<ProjectData, "icon"> | FirestoreProject;

const accentColors: Record<string, { rgb: string; tw: string; twBg: string; twBorder: string }> = {
  indigo: { rgb: "99, 102, 241", tw: "text-indigo-400", twBg: "bg-indigo-500/10", twBorder: "border-indigo-500/20" },
  red: { rgb: "239, 68, 68", tw: "text-red-400", twBg: "bg-red-500/10", twBorder: "border-red-500/20" },
  sky: { rgb: "56, 189, 248", tw: "text-sky-400", twBg: "bg-sky-500/10", twBorder: "border-sky-500/20" },
  orange: { rgb: "249, 115, 22", tw: "text-orange-400", twBg: "bg-orange-500/10", twBorder: "border-orange-500/20" },
  teal: { rgb: "20, 184, 166", tw: "text-teal-400", twBg: "bg-teal-500/10", twBorder: "border-teal-500/20" },
  violet: { rgb: "139, 92, 246", tw: "text-violet-400", twBg: "bg-violet-500/10", twBorder: "border-violet-500/20" },
};

function HeroMockup({ title, accent }: { title: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>(0);
  const colors = accentColors[accent] || accentColors.indigo;

  const handleMouseEnter = useCallback(() => {
    const el = ref.current;
    if (el) rectRef.current = el.getBoundingClientRect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      const rect = rectRef.current;
      if (!el || !rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
    rectRef.current = null;
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border"
      style={{
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
        borderColor: `rgba(${colors.rgb}, 0.2)`,
        background: `linear-gradient(135deg, rgba(${colors.rgb}, 0.05), rgba(var(--theme-surface-rgb), 0.8))`,
        boxShadow: `0 20px 60px rgba(${colors.rgb}, 0.1), 0 0 0 1px rgba(${colors.rgb}, 0.08)`,
      }}
    >
      <div className="aspect-video flex items-center justify-center relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(${colors.rgb}, 0.3), transparent 50%), radial-gradient(circle at 70% 60%, rgba(${colors.rgb}, 0.15), transparent 40%)`,
          }}
        />
        <div className="relative text-center p-8">
          <div
            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: `rgba(${colors.rgb}, 0.12)`, border: `1px solid rgba(${colors.rgb}, 0.25)` }}
          >
            <span className="text-3xl font-black" style={{ color: `rgba(${colors.rgb}, 0.8)` }}>
              {title.charAt(0)}
            </span>
          </div>
          <div className="font-mono text-xs text-neutral-500 tracking-wider">PROJECT MOCKUP</div>
          <div className={`text-sm font-semibold mt-1 ${colors.tw}`}>{title}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  FeatureShowcase — Interactive split layout                      */
/* ─────────────────────────────────────────────────────────────── */

type FeatureItem = { title: string; description: string; imageUrl?: string };

function FeatureShowcase({
  features,
  colors,
}: {
  features: FeatureItem[];
  colors: { rgb: string; tw: string; twBg: string; twBorder: string };
}) {
  const [active, setActive] = useState(0);
  const { rgb } = colors;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const userClickedRef = useRef(false);
  const clickResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Scroll-spy: IntersectionObserver watches each left-side feature row.
     When a row crosses the centre band of the viewport it becomes active. */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (userClickedRef.current) return; // honour explicit click for 800 ms
        let best: { ratio: number; idx: number } = { ratio: 0, idx: -1 };
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > best.ratio) {
            best = {
              ratio: entry.intersectionRatio,
              idx: Number(entry.target.getAttribute("data-spy-idx")),
            };
          }
        });
        if (best.idx !== -1) setActive(best.idx);
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-25% 0px -25% 0px", // fire only in the middle 50% of viewport
      }
    );
    itemRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [features.length]);

  const handleClick = (i: number) => {
    userClickedRef.current = true;
    setActive(i);
    if (clickResetRef.current) clearTimeout(clickResetRef.current);
    clickResetRef.current = setTimeout(() => { userClickedRef.current = false; }, 800);
  };

  if (!features.length) return null;

  return (
    <>
      {/* ── DESKTOP: split sticky layout ── */}
      <div className="hidden lg:flex gap-10 xl:gap-14 items-start">

        {/* LEFT — scrollable feature list */}
        <div className="flex-1 min-w-0">
          {features.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                onMouseEnter={() => handleClick(i)}
                className="w-full text-left focus-visible:outline-none group"
              >
                <div
                  ref={(el) => { itemRefs.current[i] = el; }}
                  data-spy-idx={i}
                  className="pointer-events-none"
                />
                <div
                  className="relative pl-7 pr-4 py-7 border-l-2 transition-all duration-400"
                  style={{
                    borderLeftColor: isActive
                      ? `rgba(${rgb}, 0.75)`
                      : "rgba(255,255,255,0.05)",
                    opacity: isActive ? 1 : 0.4,
                    transition: "opacity 0.35s ease, border-color 0.35s ease",
                  }}
                >
                  {/* Glowing dot on the active border */}
                  {isActive && (
                    <span
                      className="absolute left-[-5px] top-8 w-2.5 h-2.5 rounded-full"
                      style={{
                        background: `rgba(${rgb},1)`,
                        boxShadow: `0 0 8px rgba(${rgb},0.7), 0 0 20px rgba(${rgb},0.35)`,
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  )}

                  {/* Index number */}
                  <div
                    className="text-[11px] font-black tracking-widest font-mono mb-2 transition-colors duration-300"
                    style={{ color: isActive ? `rgba(${rgb},0.9)` : "rgba(255,255,255,0.18)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-black leading-snug mb-2.5 transition-colors duration-300"
                    style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)" }}
                  >
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed transition-colors duration-300"
                    style={{ color: isActive ? "rgba(163,163,163,0.9)" : "rgba(115,115,115,0.6)" }}
                  >
                    {f.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT — sticky image panel */}
        <div className="w-[52%] xl:w-[54%] shrink-0 sticky top-[120px] self-start">
          {/* Image stage */}
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
              aspectRatio: "4/3",
              background: "#0c0d0f",
              border: `1px solid rgba(${rgb},0.12)`,
              boxShadow: `0 40px 90px -20px rgba(${rgb},0.18), 0 0 0 1px rgba(${rgb},0.07)`,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : "scale(1.04)",
                  transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)",
                  pointerEvents: i === active ? "auto" : "none",
                  willChange: "opacity, transform",
                }}
              >
                {f.imageUrl ? (
                  <img src={f.imageUrl} alt={f.title} className="w-full h-full object-cover" />
                ) : (
                  /* Styled placeholder when no image is set */
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-5 relative"
                    style={{
                      background: `linear-gradient(145deg, rgba(${rgb},0.07) 0%, #0c0d0f 60%)`,
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`fcg-${i}`} width="36" height="36" patternUnits="userSpaceOnUse">
                          <path d="M36 0L0 0 0 36" fill="none" stroke={`rgba(${rgb},1)`} strokeWidth="0.7" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#fcg-${i})`} />
                    </svg>
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(ellipse at 50% 55%, rgba(${rgb},0.14), transparent 60%)`,
                      }}
                    />
                    <div
                      className="relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black"
                      style={{
                        background: `rgba(${rgb},0.08)`,
                        border: `1px solid rgba(${rgb},0.22)`,
                        color: `rgba(${rgb},0.85)`,
                        boxShadow: `0 0 50px rgba(${rgb},0.18)`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p
                      className="relative z-10 text-sm font-semibold opacity-50 max-w-[65%] text-center leading-snug"
                      style={{ color: `rgba(${rgb},1)` }}
                    >
                      {f.title}
                    </p>
                  </div>
                )}

                {/* Gradient + caption over real images */}
                {f.imageUrl && (
                  <div
                    className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-16 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}
                  >
                    <div
                      className="text-[10px] font-black uppercase tracking-widest mb-1"
                      style={{ color: `rgba(${rgb},0.8)` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="text-sm font-bold text-white">{f.title}</div>
                  </div>
                )}
              </div>
            ))}

            {/* Pill nav dots */}
            <div className="absolute bottom-4 right-4 flex gap-1.5 z-20">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Feature ${i + 1}`}
                  style={{
                    width: i === active ? "22px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background:
                      i === active ? `rgba(${rgb},0.95)` : "rgba(255,255,255,0.22)",
                    transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.25s ease",
                    boxShadow: i === active ? `0 0 8px rgba(${rgb},0.5)` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Arrow controls + counter */}
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs text-neutral-600 font-mono tracking-widest">
              {String(active + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              {[
                { label: "←", dir: -1 },
                { label: "→", dir: 1 },
              ].map(({ label, dir }) => {
                const next = active + dir;
                const disabled = next < 0 || next >= features.length;
                return (
                  <button
                    key={label}
                    onClick={() => !disabled && setActive(next)}
                    disabled={disabled}
                    className="w-8 h-8 rounded-full text-sm font-bold border flex items-center justify-center transition-all"
                    style={{
                      borderColor: disabled ? "rgba(255,255,255,0.06)" : `rgba(${rgb},0.25)`,
                      color: disabled ? "rgba(255,255,255,0.15)" : `rgba(${rgb},0.8)`,
                      background: disabled ? "transparent" : `rgba(${rgb},0.06)`,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: feature text → feature image, stacked ── */}
      <div className="lg:hidden space-y-8">
        {features.map((f, i) => (
          <div key={i} className="space-y-3">
            {/* Text card */}
            <div
              className="rounded-2xl p-5 border relative overflow-hidden"
              style={{
                background: `rgba(${rgb},0.04)`,
                borderColor: `rgba(${rgb},0.13)`,
              }}
            >
              <div
                className="absolute left-0 inset-y-0 w-[2px]"
                style={{
                  background: `linear-gradient(to bottom, rgba(${rgb},0.65), transparent)`,
                }}
              />
              <div className="pl-4">
                <div
                  className="text-[11px] font-black tracking-widest font-mono mb-2"
                  style={{ color: `rgba(${rgb},0.7)` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-black text-white mb-1.5 leading-snug">{f.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{f.description}</p>
              </div>
            </div>

            {/* Image (if provided) */}
            {f.imageUrl && (
              <div
                className="w-full overflow-hidden rounded-2xl border"
                style={{
                  aspectRatio: "16/9",
                  borderColor: `rgba(${rgb},0.12)`,
                  boxShadow: `0 16px 40px -8px rgba(${rgb},0.14)`,
                }}
              >
                <img
                  src={f.imageUrl}
                  alt={f.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [project, setProject] = useState<PageProject | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Fetch project: Firestore first, static data as fallback ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProject(null);

    const slug = params.slug || "";

    async function fetchProject() {
      // 1. Try Firestore (covers all Admin-created projects)
      if (isFirebaseConfigured && db) {
        try {
          const q = query(collection(db, "projects"), where("slug", "==", slug));
          const snap = await getDocs(q);
          if (!snap.empty && !cancelled) {
            const doc = snap.docs[0];
            setProject({ id: doc.id, ...doc.data() } as FirestoreProject);
            setLoading(false);
            return;
          }
        } catch {
          // Firestore unavailable — fall through to static data
        }
      }

      // 2. Fall back to static hardcoded data (covers pre-existing projects)
      if (!cancelled) {
        const staticProject = getProjectBySlug(slug);
        setProject(staticProject ?? null);
        setLoading(false);
      }
    }

    fetchProject();
    return () => { cancelled = true; };
  }, [params.slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  /* Time-on-page tracking — fires page_leave with seconds spent on unmount */
  useEffect(() => {
    if (!project) return;
    const title = project.title;
    const startedAt = Date.now();
    trackEvent({ eventType: "page_enter", eventTarget: title });
    return () => {
      const timeSpent = Math.round((Date.now() - startedAt) / 1000);
      trackEvent({ eventType: "page_leave", eventTarget: title, timeSpent });
    };
  }, [project?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Loading state — prevents premature "Not Found" flash */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--theme-bg)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: "var(--theme-accent)", borderRightColor: "rgba(var(--theme-accent-rgb),0.3)" }}
          />
          <p className="text-neutral-500 text-sm font-mono tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Project Not Found</h1>
          <p className="text-neutral-400">The project you're looking for doesn't exist.</p>
        </div>
        <BackButton />
      </div>
    );
  }

  const colors = accentColors[project.accent] || accentColors.indigo;

  return (
    <div className="min-h-screen grain-bg relative" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)", overflowX: "clip" }}>
      <BackButton />
      <ProjectNav />

      {/* NN monogram */}
      <button
        onClick={() => setLocation("/")}
        className="fixed top-5 left-5 sm:top-6 sm:left-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all"
        style={{ backgroundColor: `rgba(var(--theme-accent-rgb), 0.1)`, border: `1px solid rgba(var(--theme-accent-rgb), 0.3)` }}
      >
        <span className="text-sm sm:text-base font-black tracking-tighter font-[var(--app-font-display)]" style={{ color: "var(--theme-accent-light)" }}>NN</span>
      </button>

      {/* Hero Section */}
      <section id="overview" className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <NebulaBg variant="green" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="icon-duotone"><Sparkles className="w-4 h-4" /></span>
                Case Study
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3">
                {project.title}
              </h1>
              <p className={`text-lg sm:text-xl font-medium ${colors.tw} mb-4`}>
                {project.subtitle}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-neutral-400">
                <span className={`px-3 py-1 rounded-full font-semibold ${colors.twBg} ${colors.tw} border ${colors.twBorder}`}>
                  {project.status}
                </span>
                <span>{project.year}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{project.role}</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <HeroMockup title={project.title} accent={project.accent} />
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="text-neutral-400 text-center text-base sm:text-lg max-w-2xl mx-auto mt-10 leading-relaxed">
              {project.heroDescription}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <ScanLine />

      {/* The Problem */}
      <section id="problem" className="py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
              <span className="icon-duotone"><AlertTriangle className="w-4 h-4" /></span>
              The Problem
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6">
              The Challenge <span className="text-gradient">We Solved</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div
              className="p-6 sm:p-8 rounded-2xl border border-neutral-800 relative overflow-hidden"
              style={{ background: "rgba(var(--theme-surface-rgb), 0.6)" }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500/50 to-transparent rounded-full" />
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed pl-4">
                {project.problem}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScanLine />

      {/* The Solution + Tech Stack */}
      <section id="solution" className="py-16 md:py-24 relative overflow-hidden">
        <NebulaBg variant="emerald-amber" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
              <span className="icon-duotone"><Cpu className="w-4 h-4" /></span>
              The Solution
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6">
              How We <span className="text-gradient">Built It</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8">
              {project.solution}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <h3 className="text-lg font-bold text-white mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => {
                const isCore = ["MongoDB", "n8n"].includes(tech);
                const rgb = isCore ? "16, 185, 129" : colors.rgb;
                return (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 hover:scale-105"
                    style={{
                      background: isCore ? `rgba(var(--theme-accent-rgb), 0.12)` : `rgba(${colors.rgb}, 0.08)`,
                      borderColor: isCore ? `rgba(var(--theme-accent-rgb), 0.35)` : `rgba(${colors.rgb}, 0.2)`,
                      color: isCore ? "var(--theme-accent-light)" : `rgba(${colors.rgb}, 1)`,
                      boxShadow: isCore
                        ? `0 0 16px rgba(var(--theme-accent-rgb), 0.25), 0 0 4px rgba(var(--theme-accent-rgb), 0.15)`
                        : `0 0 12px rgba(${rgb}, 0.08)`,
                    }}
                  >
                    {tech}
                  </span>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScanLine />

      {/* Features — Interactive Showcase */}
      {project.features.length > 0 && (
        <section id="features" className="py-16 md:py-24 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="mb-12 lg:mb-16">
                <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                  <span className="icon-duotone"><Zap className="w-4 h-4" /></span>
                  Features
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
                  Key <span className="text-gradient">Capabilities</span>
                </h2>
                <p className="text-neutral-500 text-sm max-w-md">
                  Click or hover any feature to explore it.
                </p>
              </div>
            </ScrollReveal>

            <FeatureShowcase features={project.features} colors={colors} />
          </div>
        </section>
      )}

      <ScanLine />

      {/* Results / Impact */}
      <section id="results" className="py-16 md:py-24 relative overflow-hidden">
        <NebulaBg variant="green" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="icon-duotone"><Sparkles className="w-4 h-4" /></span>
                Results
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
                Real <span className="text-gradient">Impact</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {project.stats.map((stat, idx) => (
              <ScrollReveal key={stat.label} delay={idx * 100} direction="scale">
                <div
                  className="text-center p-6 sm:p-8 rounded-2xl border relative overflow-hidden group"
                  style={{
                    background: "rgba(var(--theme-surface-rgb), 0.6)",
                    borderColor: `rgba(${colors.rgb}, 0.15)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, rgba(${colors.rgb}, 0.08), transparent 70%)` }}
                  />
                  <div
                    className="text-3xl sm:text-4xl font-black mb-2 relative"
                    style={{ color: `rgba(${colors.rgb}, 1)` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-neutral-400 text-xs sm:text-sm font-medium relative">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ScanLine />

      {/* CTA Footer */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Want something like this <span className="text-gradient">built for you?</span>
            </h2>
            <p className="text-neutral-400 mb-8">
              Let's discuss your project and turn your ideas into a reality.
            </p>
            <button
              onClick={() => { setLocation("/"); setTimeout(() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 500); }}
              className="inline-flex px-8 py-3.5 rounded-full text-sm font-semibold text-black transition-all glow-emerald"
              style={{ backgroundColor: "var(--theme-accent)" }}
            >
              Get in Touch
            </button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
