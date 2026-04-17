import { useEffect, useState } from "react";
import {
  ExternalLink, Users, Droplets, FileText, ShoppingBag,
  Briefcase, GraduationCap, ArrowRight, Globe, Github,
} from "lucide-react";
import { useLocation } from "wouter";
import NebulaBg from "./NebulaBg";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { FirestoreProject } from "@/lib/firestoreTypes";

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
};

const accentMap: Record<string, AccentStyle> = {
  indigo: {
    border: "border-indigo-500/20",
    borderHover: "rgba(99,102,241,0.5)",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
    statusBg: "bg-indigo-500/20 backdrop-blur-sm border-indigo-500/30",
    statusText: "text-indigo-200",
    glowRgb: "99,102,241",
    gridStroke: "#6366f1",
  },
  red: {
    border: "border-red-500/20",
    borderHover: "rgba(239,68,68,0.5)",
    bg: "bg-red-500/10",
    text: "text-red-400",
    badge: "bg-red-500/15 text-red-300 border-red-500/25",
    statusBg: "bg-red-500/20 backdrop-blur-sm border-red-500/30",
    statusText: "text-red-200",
    glowRgb: "239,68,68",
    gridStroke: "#ef4444",
  },
  sky: {
    border: "border-sky-500/20",
    borderHover: "rgba(14,165,233,0.5)",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/25",
    statusBg: "bg-sky-500/20 backdrop-blur-sm border-sky-500/30",
    statusText: "text-sky-200",
    glowRgb: "14,165,233",
    gridStroke: "#0ea5e9",
  },
  orange: {
    border: "border-orange-500/20",
    borderHover: "rgba(249,115,22,0.5)",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    badge: "bg-orange-500/15 text-orange-300 border-orange-500/25",
    statusBg: "bg-orange-500/20 backdrop-blur-sm border-orange-500/30",
    statusText: "text-orange-200",
    glowRgb: "249,115,22",
    gridStroke: "#f97316",
  },
  violet: {
    border: "border-violet-500/20",
    borderHover: "rgba(139,92,246,0.5)",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    statusBg: "bg-violet-500/20 backdrop-blur-sm border-violet-500/30",
    statusText: "text-violet-200",
    glowRgb: "139,92,246",
    gridStroke: "#8b5cf6",
  },
  teal: {
    border: "border-teal-500/20",
    borderHover: "rgba(20,184,166,0.5)",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    badge: "bg-teal-500/15 text-teal-300 border-teal-500/25",
    statusBg: "bg-teal-500/20 backdrop-blur-sm border-teal-500/30",
    statusText: "text-teal-200",
    glowRgb: "20,184,166",
    gridStroke: "#14b8a6",
  },
  green: {
    border: "border-green-500/20",
    borderHover: "rgba(34,197,94,0.5)",
    bg: "bg-green-500/10",
    text: "text-green-400",
    badge: "bg-green-500/15 text-green-300 border-green-500/25",
    statusBg: "bg-green-500/20 backdrop-blur-sm border-green-500/30",
    statusText: "text-green-200",
    glowRgb: "34,197,94",
    gridStroke: "#22c55e",
  },
  amber: {
    border: "border-amber-500/20",
    borderHover: "rgba(245,158,11,0.5)",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    statusBg: "bg-amber-500/20 backdrop-blur-sm border-amber-500/30",
    statusText: "text-amber-200",
    glowRgb: "245,158,11",
    gridStroke: "#f59e0b",
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Droplets, FileText, ShoppingBag, GraduationCap, Briefcase,
};

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

function ProjectCard({
  project,
  a,
  Icon,
  onNavigate,
}: {
  project: DisplayProject;
  a: AccentStyle;
  Icon: React.ComponentType<{ className?: string }>;
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    transform: hovered ? "translateY(-6px) scale(1.012)" : "translateY(0) scale(1)",
    boxShadow: hovered
      ? `0 24px 60px -8px rgba(${a.glowRgb}, 0.28), 0 0 0 1px rgba(${a.glowRgb}, 0.2), 0 8px 32px -4px rgba(0,0,0,0.6)`
      : "0 4px 24px -4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
    borderColor: hovered ? a.borderHover : undefined,
    transition: "transform 0.35s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.35s ease, border-color 0.3s ease",
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border ${a.border} bg-[#111214] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
      style={cardStyle}
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(); } }}
      role="link"
      tabIndex={0}
    >
      {/* ── Image (16:9) ── */}
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
            <div className={`relative z-10 w-16 h-16 rounded-2xl ${a.bg} border border-current flex items-center justify-center shadow-2xl ${a.text}`}
              style={{ borderColor: `rgba(${a.glowRgb},0.3)` }}>
              <Icon className={`w-8 h-8 ${a.text}`} />
            </div>
          </div>
        )}

        {/* Bottom gradient: image fades into card bg */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#111214] to-transparent pointer-events-none" />

        {/* Status badge — frosted glass over image */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${a.statusBg} ${a.statusText} leading-none`}>
          {project.status}
        </span>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 px-5 pt-3 pb-5 gap-3">
        {/* Icon + tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`w-7 h-7 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}
            style={{ boxShadow: `0 0 0 1px rgba(${a.glowRgb},0.25)` }}>
            <Icon className={`w-3.5 h-3.5 ${a.text}`} />
          </div>
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${a.badge}`}>
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="text-[11px] text-neutral-600 font-medium">+{project.tags.length - 2}</span>
          )}
        </div>

        {/* Title + subtitle */}
        <div>
          <h3 className="text-base sm:text-[17px] font-black text-white leading-snug tracking-tight group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <p className={`text-[11px] font-semibold uppercase tracking-widest mt-0.5 ${a.text}`}>
            {project.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Divider + CTA row */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${a.text} group-hover:gap-2.5 transition-all duration-300`}>
            View Project
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

export default function Projects() {
  const [projects, setProjects] = useState<DisplayProject[]>(staticProjects);
  const [, setLocation] = useLocation();

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

  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden">
      <NebulaBg variant="green" />

      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[26rem] font-black tracking-tight text-white whitespace-nowrap"
          style={{ opacity: 0.018, transform: "rotate(-6deg)" }}
        >
          BUILD
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Section header */}
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

        {/* Cards grid */}
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
                onNavigate={() => setLocation(`/project/${project.slug}`)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
