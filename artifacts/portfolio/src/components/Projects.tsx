import { ExternalLink, Users, Droplets, FileText, ShoppingBag, Briefcase, GraduationCap } from "lucide-react";

const projects = [
  {
    icon: Users,
    title: "The Subspot",
    subtitle: "Digital Subscription Management System",
    description:
      "A fully operational subscription management platform scaling to 2000+ active users. Handles digital product delivery, user management, and automated subscription renewals.",
    tags: ["Web App", "Automation", "2000+ Users"],
    accent: "indigo",
    status: "Live",
  },
  {
    icon: Droplets,
    title: "Jibon",
    subtitle: "Blood Donation Platform",
    description:
      "A life-saving platform connecting blood donors with patients in need. Features donor matching, real-time availability tracking, and hospital integration.",
    tags: ["Web App", "Healthcare", "React"],
    accent: "red",
    status: "Active",
  },
  {
    icon: FileText,
    title: "Hospital Report Maker",
    subtitle: "Multi-user Medical System",
    description:
      "A comprehensive medical report generation system supporting multiple users simultaneously. Streamlines documentation for healthcare professionals with automated formatting.",
    tags: ["Multi-user", "Healthcare", "Automation"],
    accent: "sky",
    status: "Deployed",
  },
  {
    icon: ShoppingBag,
    title: "Roshbadam",
    subtitle: "E-commerce Branding & Logistics",
    description:
      "End-to-end e-commerce brand setup including visual identity, product photography direction, logistics pipeline, and digital marketing strategy.",
    tags: ["E-commerce", "Branding", "Logistics"],
    accent: "orange",
    status: "Live",
  },
  {
    icon: GraduationCap,
    title: "College ERP System",
    subtitle: "Comprehensive Educational Management Platform",
    description:
      "A role-based ERP for educational institutions with dedicated portals for Admins, Department Heads, Teachers, and Students. Features automated attendance tracking, fine management (20tk per missed class), and dynamic mark entry.",
    tags: ["Role-Based Access", "PHP/Node.js", "Database Design"],
    accent: "teal",
    status: "Built",
  },
  {
    icon: Briefcase,
    title: "The Cat Club",
    subtitle: "E-commerce Brand & Community",
    description:
      "A niche e-commerce brand built from scratch with community-first approach. Includes brand identity, product catalog, social media presence, and fulfilment workflow.",
    tags: ["E-commerce", "Community", "Brand"],
    accent: "violet",
    status: "Active",
  },
];

const accentMap: Record<string, { border: string; bg: string; text: string; badge: string; status: string }> = {
  indigo: {
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
    status: "bg-indigo-500/20 text-indigo-300",
  },
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-400",
    badge: "bg-red-500/15 text-red-300 border-red-500/20",
    status: "bg-red-500/20 text-red-300",
  },
  sky: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/20",
    status: "bg-sky-500/20 text-sky-300",
  },
  orange: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    badge: "bg-orange-500/15 text-orange-300 border-orange-500/20",
    status: "bg-orange-500/20 text-orange-300",
  },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/20",
    status: "bg-violet-500/20 text-violet-300",
  },
  teal: {
    border: "border-teal-500/30",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    badge: "bg-teal-500/15 text-teal-300 border-teal-500/20",
    status: "bg-teal-500/20 text-teal-300",
  },
};

export default function Projects() {
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <ExternalLink className="w-4 h-4" />
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
            const a = accentMap[project.accent];
            return (
              <div
                key={project.title}
                className={`group relative p-5 sm:p-6 rounded-2xl border ${a.border} bg-neutral-900/70 card-hover cursor-pointer flex flex-col`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center`}>
                    <project.icon className={`w-5 h-5 ${a.text}`} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.status}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-1">{project.title}</h3>
                <p className={`text-xs sm:text-sm font-medium ${a.text} mb-3`}>{project.subtitle}</p>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border ${a.badge}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
