import { useRef, useCallback, useEffect, useState } from "react";
import { ExternalLink, Users, Droplets, FileText, ShoppingBag, Briefcase, GraduationCap, ArrowRight, Globe, Github } from "lucide-react";
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
    subtitle: "Digital Subscription Management System",
    description:
      "A fully operational subscription management platform scaling to 2000+ active users. Handles digital product delivery, user management, and automated subscription renewals.",
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
      "A comprehensive medical report generation system supporting multiple users simultaneously. Streamlines documentation for healthcare professionals with automated formatting.",
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
    subtitle: "Comprehensive Educational Management Platform",
    description:
      "A role-based ERP for educational institutions with dedicated portals for Admins, Department Heads, Teachers, and Students. Features automated attendance tracking, fine management, and dynamic mark entry.",
    tags: ["Role-Based Access", "PHP/Node.js", "Database Design"],
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
      "A niche e-commerce brand built from scratch with community-first approach. Includes brand identity, product catalog, social media presence, and fulfilment workflow.",
    tags: ["E-commerce", "Community", "Brand"],
    accent: "violet",
    status: "Active",
    thumbnail: "",
    liveLink: "",
    repoLink: "",
  },
];

const accentMap: Record<string, { border: string; bg: string; text: string; badge: string; status: string; hoverShadow: string }> = {
  indigo: { border: "border-indigo-500/30", bg: "bg-indigo-500/10", text: "text-indigo-400", badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20", status: "bg-indigo-500/20 text-indigo-300", hoverShadow: "hover:shadow-indigo-500/10" },
  red: { border: "border-red-500/30", bg: "bg-red-500/10", text: "text-red-400", badge: "bg-red-500/15 text-red-300 border-red-500/20", status: "bg-red-500/20 text-red-300", hoverShadow: "hover:shadow-red-500/10" },
  sky: { border: "border-sky-500/30", bg: "bg-sky-500/10", text: "text-sky-400", badge: "bg-sky-500/15 text-sky-300 border-sky-500/20", status: "bg-sky-500/20 text-sky-300", hoverShadow: "hover:shadow-sky-500/10" },
  orange: { border: "border-orange-500/30", bg: "bg-orange-500/10", text: "text-orange-400", badge: "bg-orange-500/15 text-orange-300 border-orange-500/20", status: "bg-orange-500/20 text-orange-300", hoverShadow: "hover:shadow-orange-500/10" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", badge: "bg-violet-500/15 text-violet-300 border-violet-500/20", status: "bg-violet-500/20 text-violet-300", hoverShadow: "hover:shadow-violet-500/10" },
  teal: { border: "border-teal-500/30", bg: "bg-teal-500/10", text: "text-teal-400", badge: "bg-teal-500/15 text-teal-300 border-teal-500/20", status: "bg-teal-500/20 text-teal-300", hoverShadow: "hover:shadow-teal-500/10" },
  green: { border: "border-green-500/30", bg: "bg-green-500/10", text: "text-green-400", badge: "bg-green-500/15 text-green-300 border-green-500/20", status: "bg-green-500/20 text-green-300", hoverShadow: "hover:shadow-green-500/10" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", badge: "bg-amber-500/15 text-amber-300 border-amber-500/20", status: "bg-amber-500/20 text-amber-300", hoverShadow: "hover:shadow-amber-500/10" },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Droplets, FileText, ShoppingBag, GraduationCap, Briefcase,
};

interface TiltCardProps {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  role?: string;
  tabIndex?: number;
}

function TiltCard({ children, className, onClick, onKeyDown, role, tabIndex }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>(0);

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
      el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
    rectRef.current = null;
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease-out, box-shadow 0.3s ease", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

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

export default function Projects() {
  const [projects, setProjects] = useState<DisplayProject[]>(staticProjects);
  const [loaded, setLoaded] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    (async () => {
      try {
        const q = query(collection(db!, "projects"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const fetched = snap.docs.map((d) => {
            const p = { id: d.id, ...d.data() } as FirestoreProject;
            return {
              title: p.title,
              slug: p.slug,
              subtitle: p.subtitle,
              description: p.heroDescription,
              tags: p.tags,
              accent: p.accent || "indigo",
              status: p.status,
              thumbnail: p.thumbnail,
              liveLink: p.liveLink,
              repoLink: p.repoLink,
              fromFirestore: true,
            } as DisplayProject;
          });
          setProjects(fetched);
        }
      } catch {
        try {
          const snap = await getDocs(collection(db!, "projects"));
          if (!snap.empty) {
            const fetched = snap.docs.map((d) => {
              const p = { id: d.id, ...d.data() } as FirestoreProject;
              return {
                title: p.title,
                slug: p.slug,
                subtitle: p.subtitle,
                description: p.heroDescription,
                tags: p.tags,
                accent: p.accent || "indigo",
                status: p.status,
                thumbnail: p.thumbnail,
                liveLink: p.liveLink,
                repoLink: p.repoLink,
                fromFirestore: true,
              } as DisplayProject;
            });
            setProjects(fetched);
          }
        } catch { /* stay on static */ }
      }
      setLoaded(true);
    })();
  }, []);

  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden">
      <NebulaBg variant="green" />
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[26rem] font-black tracking-tight text-white whitespace-nowrap"
          style={{ opacity: 0.025, transform: "rotate(-6deg)" }}
        >
          BUILD
        </span>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => {
            const a = accentMap[project.accent] ?? accentMap.indigo;
            const Icon = project.icon ?? iconMap.Briefcase ?? Briefcase;
            return (
              <TiltCard
                key={project.title}
                className={`group reveal-card relative rounded-2xl border ${a.border} bg-neutral-900/70 cursor-pointer flex flex-col overflow-hidden hover:shadow-2xl ${a.hoverShadow} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
                onClick={() => setLocation(`/project/${project.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLocation(`/project/${project.slug}`);
                  }
                }}
                role="link"
                tabIndex={0}
              >
                {project.thumbnail && (
                  <div className="w-full h-40 overflow-hidden bg-neutral-800">
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${a.text}`} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.status}`}>{project.status}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{project.title}</h3>
                  <p className={`text-xs sm:text-sm font-medium ${a.text} mb-3`}>{project.subtitle}</p>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed flex-1 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${a.badge}`}>{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 group-hover:gap-3 text-xs sm:text-sm font-semibold ${a.text} transition-all duration-300`}>
                      View Project <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-500 hover:text-white transition-colors"
                        title="Live site"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.repoLink && (
                      <a
                        href={project.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-500 hover:text-white transition-colors"
                        title="Source code"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
