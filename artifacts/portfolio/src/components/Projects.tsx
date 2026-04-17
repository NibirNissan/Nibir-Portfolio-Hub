import { useEffect, useState, useCallback, useRef } from "react";
import {
  ExternalLink, Users, Droplets, FileText, ShoppingBag,
  Briefcase, GraduationCap, ArrowRight, Globe, Github,
  X, ExternalLink as Launch, ChevronRight, Zap,
  AlertTriangle, Cpu, BarChart3, Layers,
} from "lucide-react";
import { useLocation } from "wouter";
import NebulaBg from "./NebulaBg";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import type { FirestoreProject } from "@/lib/firestoreTypes";
import { trackEvent } from "@/lib/analytics";

/* ─────────────────────────────────────────────────────────── */
/*  Static fallback data                                        */
/* ─────────────────────────────────────────────────────────── */

const staticProjects = [
  {
    icon: Users,
    title: "The Subspot",
    slug: "the-subspot",
    subtitle: "Digital Subscription Management",
    description:
      "A fully operational subscription management platform scaling to 2000+ active users. Handles digital product delivery, user management, and automated renewals.",
    tags: ["Web App", "Automation", "2000+ Users"],
    accent: "indigo",
    status: "Live",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
  },
  {
    icon: Droplets,
    title: "Jibon",
    slug: "jibon",
    subtitle: "Blood Donation Platform",
    description:
      "A life-saving platform connecting blood donors with patients in need. Features donor matching, real-time availability tracking, and hospital integration.",
    tags: ["Web App", "Healthcare", "React"],
    accent: "red",
    status: "Active",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
  },
  {
    icon: FileText,
    title: "Hospital Report Maker",
    slug: "hospital-report-maker",
    subtitle: "Multi-user Medical System",
    description:
      "A comprehensive medical report generation system supporting multiple users simultaneously. Streamlines documentation with automated formatting.",
    tags: ["Multi-user", "Healthcare", "Automation"],
    accent: "sky",
    status: "Deployed",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
  },
  {
    icon: ShoppingBag,
    title: "Roshbadam",
    slug: "roshbadam",
    subtitle: "E-commerce Branding & Logistics",
    description:
      "End-to-end e-commerce brand setup including visual identity, product photography direction, logistics pipeline, and digital marketing strategy.",
    tags: ["E-commerce", "Branding", "Logistics"],
    accent: "orange",
    status: "Live",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
  },
  {
    icon: GraduationCap,
    title: "College ERP System",
    slug: "college-erp",
    subtitle: "Educational Management Platform",
    description:
      "A role-based ERP for educational institutions with dedicated portals for Admins, Department Heads, Teachers, and Students with automated attendance tracking.",
    tags: ["Role-Based Access", "PHP/Node.js", "DB Design"],
    accent: "teal",
    status: "Built",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
  },
  {
    icon: Briefcase,
    title: "The Cat Club",
    slug: "the-cat-club",
    subtitle: "E-commerce Brand & Community",
    description:
      "A niche e-commerce brand built from scratch with a community-first approach. Includes brand identity, product catalog, social media, and fulfilment workflow.",
    tags: ["E-commerce", "Community", "Brand"],
    accent: "violet",
    status: "Active",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
  },
];

/* ─────────────────────────────────────────────────────────── */
/*  Accent map                                                  */
/* ─────────────────────────────────────────────────────────── */

type AccentStyle = {
  border: string;
  borderHover: string;
  bg: string;
  text: string;
  badge: string;
  statusBg: string;
  statusText: string;
  glowRgb: string;
  gridStroke: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
};

const accentMap: Record<string, AccentStyle> = {
  indigo: {
    border: "border-indigo-500/20", borderHover: "rgba(99,102,241,0.5)",
    bg: "bg-indigo-500/10", text: "text-indigo-400",
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
    statusBg: "bg-indigo-500/20 backdrop-blur-sm border-indigo-500/30",
    statusText: "text-indigo-200", glowRgb: "99,102,241", gridStroke: "#6366f1",
    pillBg: "rgba(99,102,241,0.1)", pillBorder: "rgba(99,102,241,0.3)", pillText: "rgba(165,180,252,1)",
  },
  red: {
    border: "border-red-500/20", borderHover: "rgba(239,68,68,0.5)",
    bg: "bg-red-500/10", text: "text-red-400",
    badge: "bg-red-500/15 text-red-300 border-red-500/25",
    statusBg: "bg-red-500/20 backdrop-blur-sm border-red-500/30",
    statusText: "text-red-200", glowRgb: "239,68,68", gridStroke: "#ef4444",
    pillBg: "rgba(239,68,68,0.1)", pillBorder: "rgba(239,68,68,0.3)", pillText: "rgba(252,165,165,1)",
  },
  sky: {
    border: "border-sky-500/20", borderHover: "rgba(14,165,233,0.5)",
    bg: "bg-sky-500/10", text: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/25",
    statusBg: "bg-sky-500/20 backdrop-blur-sm border-sky-500/30",
    statusText: "text-sky-200", glowRgb: "14,165,233", gridStroke: "#0ea5e9",
    pillBg: "rgba(14,165,233,0.1)", pillBorder: "rgba(14,165,233,0.3)", pillText: "rgba(125,211,252,1)",
  },
  orange: {
    border: "border-orange-500/20", borderHover: "rgba(249,115,22,0.5)",
    bg: "bg-orange-500/10", text: "text-orange-400",
    badge: "bg-orange-500/15 text-orange-300 border-orange-500/25",
    statusBg: "bg-orange-500/20 backdrop-blur-sm border-orange-500/30",
    statusText: "text-orange-200", glowRgb: "249,115,22", gridStroke: "#f97316",
    pillBg: "rgba(249,115,22,0.1)", pillBorder: "rgba(249,115,22,0.3)", pillText: "rgba(253,186,116,1)",
  },
  violet: {
    border: "border-violet-500/20", borderHover: "rgba(139,92,246,0.5)",
    bg: "bg-violet-500/10", text: "text-violet-400",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    statusBg: "bg-violet-500/20 backdrop-blur-sm border-violet-500/30",
    statusText: "text-violet-200", glowRgb: "139,92,246", gridStroke: "#8b5cf6",
    pillBg: "rgba(139,92,246,0.1)", pillBorder: "rgba(139,92,246,0.3)", pillText: "rgba(196,181,253,1)",
  },
  teal: {
    border: "border-teal-500/20", borderHover: "rgba(20,184,166,0.5)",
    bg: "bg-teal-500/10", text: "text-teal-400",
    badge: "bg-teal-500/15 text-teal-300 border-teal-500/25",
    statusBg: "bg-teal-500/20 backdrop-blur-sm border-teal-500/30",
    statusText: "text-teal-200", glowRgb: "20,184,166", gridStroke: "#14b8a6",
    pillBg: "rgba(20,184,166,0.1)", pillBorder: "rgba(20,184,166,0.3)", pillText: "rgba(94,234,212,1)",
  },
  green: {
    border: "border-green-500/20", borderHover: "rgba(34,197,94,0.5)",
    bg: "bg-green-500/10", text: "text-green-400",
    badge: "bg-green-500/15 text-green-300 border-green-500/25",
    statusBg: "bg-green-500/20 backdrop-blur-sm border-green-500/30",
    statusText: "text-green-200", glowRgb: "34,197,94", gridStroke: "#22c55e",
    pillBg: "rgba(34,197,94,0.1)", pillBorder: "rgba(34,197,94,0.3)", pillText: "rgba(134,239,172,1)",
  },
  amber: {
    border: "border-amber-500/20", borderHover: "rgba(245,158,11,0.5)",
    bg: "bg-amber-500/10", text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    statusBg: "bg-amber-500/20 backdrop-blur-sm border-amber-500/30",
    statusText: "text-amber-200", glowRgb: "245,158,11", gridStroke: "#f59e0b",
    pillBg: "rgba(245,158,11,0.1)", pillBorder: "rgba(245,158,11,0.3)", pillText: "rgba(253,230,138,1)",
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Droplets, FileText, ShoppingBag, GraduationCap, Briefcase,
};

/* ─────────────────────────────────────────────────────────── */
/*  Types                                                        */
/* ─────────────────────────────────────────────────────────── */

type DisplayProject = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  tags: string[];
  accent: string;
  status: string;
  thumbnail: string;
  liveLink: string;
  repoLink: string;
  fromFirestore?: boolean;
};

/* ─────────────────────────────────────────────────────────── */
/*  Inline-style animation helpers                              */
/* ─────────────────────────────────────────────────────────── */

const anim = (name: string, dur: string, easing = "ease", delay = "0s"): React.CSSProperties => ({
  animation: `${name} ${dur} ${easing} ${delay} both`,
});

const stagger = (index: number, base = 0.18): React.CSSProperties =>
  anim("overlay-item-up", "0.55s", "cubic-bezier(0.22,1,0.36,1)", `${base + index * 0.08}s`);

/* ─────────────────────────────────────────────────────────── */
/*  ProjectOverlay                                              */
/* ─────────────────────────────────────────────────────────── */

function ProjectOverlay({
  project,
  fullData,
  closing,
  onClose,
  onNavigate,
}: {
  project: DisplayProject;
  fullData: FirestoreProject | null;
  closing: boolean;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const a = accentMap[project.accent] ?? accentMap.indigo;
  const Icon = project.icon ?? iconMap.Briefcase ?? Briefcase;
  const contentRef = useRef<HTMLDivElement>(null);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Scroll content to top when project changes */
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [project.slug]);

  const tech = fullData?.techStack ?? project.tags;
  const stats = fullData?.stats ?? [];
  const features = fullData?.features ?? [];
  const problem = fullData?.problem ?? "";
  const solution = fullData?.solution ?? "";
  const year = fullData?.year ?? "";
  const role = fullData?.role ?? "";

  const backdropStyle: React.CSSProperties = {
    ...anim(closing ? "overlay-backdrop-out" : "overlay-backdrop-in", "0.3s", "ease"),
  };
  const panelStyle: React.CSSProperties = {
    ...anim(
      closing ? "overlay-panel-out" : "overlay-panel-in",
      closing ? "0.28s" : "0.45s",
      closing ? "ease" : "cubic-bezier(0.22,1,0.36,1)"
    ),
  };

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ ...backdropStyle, zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full sm:w-[95%] sm:mx-auto flex flex-col overflow-hidden sm:rounded-3xl rounded-t-3xl"
        style={{
          ...panelStyle,
          maxWidth: "900px",
          maxHeight: "90dvh",
          background: "#0d0e10",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `0 40px 120px -20px rgba(${a.glowRgb},0.22), 0 0 0 1px rgba(${a.glowRgb},0.12), 0 8px 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Close button — anchored to panel, always visible while scrolling */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-black/80 transition-all z-20"
          style={anim("overlay-fade-in", "0.3s", "ease", "0.1s")}
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Single scroll container — image + text flow together ── */}
        <style>{`.overlay-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div
          ref={contentRef}
          className="overlay-scroll flex-1 overflow-y-auto overscroll-contain"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties}
        >
          {/* ── Hero Image — inside scroll so it moves with content ── */}
          <div className="relative w-full aspect-video overflow-hidden bg-neutral-900">
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
                style={anim("overlay-fade-in", "0.6s", "ease", "0.05s")}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${a.bg} relative`}>
                <svg className="absolute inset-0 w-full h-full opacity-[0.10]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`ov-grid-${project.slug}`} width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M32 0L0 0 0 32" fill="none" stroke={a.gridStroke} strokeWidth="0.7" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#ov-grid-${project.slug})`} />
                </svg>
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at 50% 60%, rgba(${a.glowRgb},0.18) 0%, transparent 65%)` }}
                />
                <div
                  className="relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl"
                  style={{ background: `rgba(${a.glowRgb},0.12)`, border: `1px solid rgba(${a.glowRgb},0.3)`, boxShadow: `0 0 40px rgba(${a.glowRgb},0.2)` }}
                >
                  <Icon className={`w-10 h-10 ${a.text}`} />
                </div>
              </div>
            )}

            {/* Gradient fade into panel bg */}
            <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{ background: "linear-gradient(to top, #0d0e10 0%, transparent 100%)" }} />

            {/* Top badges — leave right-12 gap so close button is never covered */}
            <div className="absolute top-3 left-3 right-12 flex items-start justify-between pointer-events-none" style={anim("overlay-fade-in", "0.4s", "ease", "0.15s")}>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide ${a.statusBg} ${a.statusText}`}
              >
                {project.status}
              </span>
              {year && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 backdrop-blur-sm text-neutral-400 border border-white/10">
                  {year}
                </span>
              )}
            </div>
          </div>

          <div className="px-4 sm:px-7 pt-4 pb-16 sm:pb-[80px] space-y-6">

            {/* Title block */}
            <div style={stagger(0)}>
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center mt-1"
                  style={{ background: `rgba(${a.glowRgb},0.12)`, border: `1px solid rgba(${a.glowRgb},0.25)`, boxShadow: `0 0 16px rgba(${a.glowRgb},0.15)` }}
                >
                  <Icon className={`w-4.5 h-4.5 ${a.text}`} style={{ width: "18px", height: "18px" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                    {project.title}
                  </h2>
                  <p className={`text-sm font-semibold uppercase tracking-widest mt-0.5 ${a.text}`}>
                    {project.subtitle}
                  </p>
                </div>
              </div>
              {role && (
                <p className="text-xs text-neutral-600 mt-2 ml-12">{role}</p>
              )}
            </div>

            {/* Description */}
            <div style={stagger(1)}>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Problem & Solution (if available) */}
            {(problem || solution) && (
              <div className="space-y-4" style={stagger(2)}>
                {problem && (
                  <div
                    className="rounded-2xl p-4 sm:p-5 border relative overflow-hidden"
                    style={{ background: `rgba(${a.glowRgb},0.04)`, borderColor: `rgba(${a.glowRgb},0.15)` }}
                  >
                    <div
                      className="absolute left-0 inset-y-0 w-0.5 rounded-full"
                      style={{ background: `linear-gradient(to bottom, rgba(${a.glowRgb},0.7), transparent)` }}
                    />
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-2 ${a.text}`}>
                      <AlertTriangle className="w-3 h-3" /> The Problem
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed pl-1">{problem}</p>
                  </div>
                )}
                {solution && (
                  <div
                    className="rounded-2xl p-4 sm:p-5 border relative overflow-hidden"
                    style={{ background: `rgba(${a.glowRgb},0.04)`, borderColor: `rgba(${a.glowRgb},0.15)` }}
                  >
                    <div
                      className="absolute left-0 inset-y-0 w-0.5 rounded-full"
                      style={{ background: `linear-gradient(to bottom, rgba(${a.glowRgb},0.7), transparent)` }}
                    />
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-2 ${a.text}`}>
                      <Cpu className="w-3 h-3" /> The Solution
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed pl-1">{solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tech Stack */}
            <div style={stagger(problem || solution ? 3 : 2)}>
              <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-3 ${a.text}`}>
                <Layers className="w-3 h-3" /> Tech Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-transform hover:scale-105"
                    style={{
                      background: a.pillBg,
                      borderColor: a.pillBorder,
                      color: a.pillText,
                      boxShadow: `0 0 12px rgba(${a.glowRgb},0.12)`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div style={stagger(4)}>
                <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-3 ${a.text}`}>
                  <BarChart3 className="w-3 h-3" /> Impact
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-4 text-center border"
                      style={{ background: `rgba(${a.glowRgb},0.06)`, borderColor: `rgba(${a.glowRgb},0.15)` }}
                    >
                      <div className="text-xl sm:text-2xl font-black mb-0.5" style={{ color: `rgba(${a.glowRgb},1)` }}>
                        {s.value}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div style={stagger(5)}>
                <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-3 ${a.text}`}>
                  <Zap className="w-3 h-3" /> Key Features
                </div>
                <div className="space-y-3">
                  {features.slice(0, 4).map((f, i) => (
                    <div
                      key={f.title}
                      className="rounded-xl border overflow-hidden"
                      style={{ background: `rgba(${a.glowRgb},0.04)`, borderColor: `rgba(${a.glowRgb},0.12)` }}
                    >
                      {/* Feature image (if provided) */}
                      {f.imageUrl && (
                        <div className="w-full h-36 sm:h-44 overflow-hidden bg-neutral-900">
                          <img
                            src={f.imageUrl}
                            alt={f.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none"; }}
                          />
                        </div>
                      )}
                      {/* Text row */}
                      <div className="flex gap-3 items-start p-3.5">
                        <div
                          className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 mt-px"
                          style={{ background: `rgba(${a.glowRgb},0.15)`, color: `rgba(${a.glowRgb},1)` }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white leading-tight">{f.title}</div>
                          {f.description && (
                            <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{f.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-neutral-800/70" style={stagger(6)} />

            {/* CTA Buttons */}
            <div className="space-y-3" style={stagger(6)}>
              <div className="flex gap-3">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, rgba(${a.glowRgb},0.9), rgba(${a.glowRgb},0.7))`,
                      color: "#fff",
                      boxShadow: `0 8px 28px rgba(${a.glowRgb},0.35)`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Launch className="w-4 h-4" /> Visit Live Project
                  </a>
                )}
                {project.repoLink && (
                  <a
                    href={project.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-all active:scale-[0.98]"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4" /> View Code
                  </a>
                )}
              </div>

              {/* View full case study */}
              <button
                onClick={onNavigate}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-300 border border-transparent hover:border-neutral-800 transition-all group"
              >
                View full case study
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ProjectCard                                                 */
/* ─────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  a,
  Icon,
  onClick,
}: {
  project: DisplayProject;
  a: AccentStyle;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    transform: hovered ? "translateY(-6px) scale(1.012)" : "translateY(0) scale(1)",
    boxShadow: hovered
      ? `0 24px 60px -8px rgba(${a.glowRgb},0.28), 0 0 0 1px rgba(${a.glowRgb},0.2), 0 8px 32px -4px rgba(0,0,0,0.6)`
      : "0 4px 24px -4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
    borderColor: hovered ? a.borderHover : undefined,
    transition: "transform 0.35s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.35s ease, border-color 0.3s ease",
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border ${a.border} bg-[#111214] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
      style={{ ...cardStyle, touchAction: "manipulation" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title} details`}
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-neutral-900">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center relative ${a.bg}`}>
            <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`g-${project.slug}`} width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M28 0L0 0 0 28" fill="none" stroke={a.gridStroke} strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#g-${project.slug})`} />
            </svg>
            <div
              className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${a.text}`}
              style={{ background: `rgba(${a.glowRgb},0.12)`, border: `1px solid rgba(${a.glowRgb},0.3)` }}
            >
              <Icon className="w-8 h-8" />
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#111214] to-transparent pointer-events-none" />
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${a.statusBg} ${a.statusText} leading-none`}>
          {project.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 pt-3 pb-5 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `rgba(${a.glowRgb},0.1)`, boxShadow: `0 0 0 1px rgba(${a.glowRgb},0.25)` }}
          >
            <Icon className={`w-3.5 h-3.5 ${a.text}`} />
          </div>
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${a.badge}`}>{tag}</span>
          ))}
          {project.tags.length > 2 && (
            <span className="text-[11px] text-neutral-600 font-medium">+{project.tags.length - 2}</span>
          )}
        </div>

        <div>
          <h3 className="text-base sm:text-[17px] font-black text-white leading-snug tracking-tight">
            {project.title}
          </h3>
          <p className={`text-[11px] font-semibold uppercase tracking-widest mt-0.5 ${a.text}`}>
            {project.subtitle}
          </p>
        </div>

        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${a.text} group-hover:gap-2.5 transition-all duration-300`}>
            View Details
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
          <div className="flex items-center gap-2">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-neutral-800/60 text-neutral-500 hover:text-white hover:bg-neutral-700 transition-all"
                title="Live site"
              >
                <Globe className="w-3 h-3" />
              </a>
            )}
            {project.repoLink && (
              <a
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-neutral-800/60 text-neutral-500 hover:text-white hover:bg-neutral-700 transition-all"
                title="Source code"
              >
                <Github className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main Section                                                */
/* ─────────────────────────────────────────────────────────── */

export default function Projects() {
  const [projects, setProjects] = useState<DisplayProject[]>(staticProjects);
  const [, setLocation] = useLocation();

  /* Overlay state */
  const [activeProject, setActiveProject] = useState<DisplayProject | null>(null);
  const [fullData, setFullData] = useState<FirestoreProject | null>(null);
  const [overlayClosing, setOverlayClosing] = useState(false);

  /* Load projects from Firestore */
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    (async () => {
      try {
        const q = query(collection(db!, "projects"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setProjects(snap.docs.map((d) => {
            const p = { id: d.id, ...d.data() } as FirestoreProject;
            return {
              title: p.title, slug: p.slug, subtitle: p.subtitle,
              description: p.heroDescription, tags: p.tags,
              accent: p.accent || "indigo", status: p.status,
              thumbnail: p.thumbnail, liveLink: p.liveLink,
              repoLink: p.repoLink, fromFirestore: true,
            } as DisplayProject;
          }));
        }
      } catch {
        try {
          const snap = await getDocs(collection(db!, "projects"));
          if (!snap.empty) {
            setProjects(snap.docs.map((d) => {
              const p = { id: d.id, ...d.data() } as FirestoreProject;
              return {
                title: p.title, slug: p.slug, subtitle: p.subtitle,
                description: p.heroDescription, tags: p.tags,
                accent: p.accent || "indigo", status: p.status,
                thumbnail: p.thumbnail, liveLink: p.liveLink,
                repoLink: p.repoLink, fromFirestore: true,
              } as DisplayProject;
            }));
          }
        } catch { /* stay on static */ }
      }
    })();
  }, []);

  /* Open overlay & fetch full Firestore data for that project */
  const openOverlay = useCallback((project: DisplayProject) => {
    setActiveProject(project);
    setFullData(null);
    setOverlayClosing(false);
    trackEvent({ eventType: "project_view", eventTarget: project.title });

    if (!isFirebaseConfigured || !db) return;
    (async () => {
      try {
        const q = query(collection(db!, "projects"), where("slug", "==", project.slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setFullData({ id: snap.docs[0].id, ...snap.docs[0].data() } as FirestoreProject);
        }
      } catch { /* fullData stays null — basic info still shown */ }
    })();
  }, []);

  /* Animated close */
  const closeOverlay = useCallback(() => {
    setOverlayClosing(true);
    setTimeout(() => {
      setActiveProject(null);
      setFullData(null);
      setOverlayClosing(false);
    }, 300);
  }, []);

  /* Navigate to full case study page */
  const navigateToFull = useCallback((slug: string) => {
    closeOverlay();
    setTimeout(() => setLocation(`/project/${slug}`), 320);
  }, [closeOverlay, setLocation]);

  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden">
      <NebulaBg variant="green" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[26rem] font-black tracking-tight text-white whitespace-nowrap"
          style={{ opacity: 0.018, transform: "rotate(-6deg)" }}
        >
          BUILD
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><ExternalLink className="w-4 h-4" /></span>
            Projects
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Work that <span className="text-gradient">Ships</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            Real products used by real people — from digital platforms to brand ecosystems.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project) => {
            const a = accentMap[project.accent] ?? accentMap.indigo;
            const Icon = project.icon ?? iconMap.Briefcase ?? Briefcase;
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                a={a}
                Icon={Icon}
                onClick={() => openOverlay(project)}
              />
            );
          })}
        </div>
      </div>

      {/* Overlay */}
      {activeProject && (
        <ProjectOverlay
          project={activeProject}
          fullData={fullData}
          closing={overlayClosing}
          onClose={closeOverlay}
          onNavigate={() => navigateToFull(activeProject.slug)}
        />
      )}
    </section>
  );
}
