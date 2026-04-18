import type {
  FirestoreSkill,
  FirestoreTimeline,
  FirestoreService,
  FirestoreSocial,
  FirestoreProject,
} from "@/lib/firestoreTypes";
import { projectsData } from "./projects";
import { servicesData } from "./services";

/* ─────────────────────────────────────────────────────────────
   PROJECTS  — sourced directly from projects.ts (single source of truth)
   LucideIcon is stripped; all text/array content is preserved exactly.
   Fields not in ProjectData (thumbnail, liveLink, repoLink, detailSections)
   start blank so the admin can fill them in later.
───────────────────────────────────────────────────────────── */
export const seedProjects: Omit<FirestoreProject, "id">[] = projectsData.map(
  (p, i) => ({
    slug:            p.slug,
    title:           p.title,
    subtitle:        p.subtitle,
    year:            p.year,
    role:            p.role,
    accent:          p.accent,
    status:          p.status,
    thumbnail:       "",
    mockupImage:     "",
    liveLink:        "",
    repoLink:        "",
    heroDescription: p.heroDescription,
    problem:         p.problem,
    solution:        p.solution,
    techStack:       [...p.techStack],
    features:        p.features.map((f) => ({ title: f.title, description: f.description })),
    stats:           p.stats.map((s) => ({ value: s.value, label: s.label })),
    tags:            [...p.tags],
    detailSections:  [],
    order:           i,
    createdAt:       Date.now(),
  })
);

/* ─────────────────────────────────────────────────────────────
   SKILLS  (manually curated — no equivalent local array)
───────────────────────────────────────────────────────────── */
export const seedSkills: Omit<FirestoreSkill, "id">[] = [
  { name: "React",            category: "Tech",             order: 0  },
  { name: "TypeScript",       category: "Tech",             order: 1  },
  { name: "Node.js",          category: "Tech",             order: 2  },
  { name: "Next.js",          category: "Tech",             order: 3  },
  { name: "Vite",             category: "Tech",             order: 4  },
  { name: "Tailwind CSS",     category: "Tech",             order: 5  },
  { name: "PHP",              category: "Backend",          order: 6  },
  { name: "MySQL",            category: "Backend",          order: 7  },
  { name: "MongoDB",          category: "Backend",          order: 8  },
  { name: "REST API",         category: "Backend",          order: 9  },
  { name: "Firebase",         category: "Backend",          order: 10 },
  { name: "Figma",            category: "Design",           order: 11 },
  { name: "Photoshop",        category: "Design",           order: 12 },
  { name: "Lightroom",        category: "Design",           order: 13 },
  { name: "n8n",              category: "Automation",       order: 14 },
  { name: "Make (Integromat)", category: "Automation",      order: 15 },
  { name: "Zapier",           category: "Automation",       order: 16 },
  { name: "Premiere Pro",     category: "Video",            order: 17 },
  { name: "After Effects",    category: "Video",            order: 18 },
  { name: "CapCut",           category: "Video",            order: 19 },
  { name: "Meta Ads",         category: "Digital Marketing",order: 20 },
  { name: "Google Ads",       category: "Digital Marketing",order: 21 },
  { name: "SEO",              category: "Digital Marketing",order: 22 },
  { name: "WordPress",        category: "Tech",             order: 23 },
  { name: "WooCommerce",      category: "Tech",             order: 24 },
  { name: "Docker",           category: "DevOps",           order: 25 },
  { name: "Git",              category: "DevOps",           order: 26 },
];

/* ─────────────────────────────────────────────────────────────
   TIMELINE  (manually curated career milestones)
───────────────────────────────────────────────────────────── */
export const seedTimeline: Omit<FirestoreTimeline, "id">[] = [
  {
    year: "2025",
    title: "Launched The Subspot",
    description:
      "Scaled a digital subscription management platform to 2,800+ active users with full n8n automation.",
    icon: "Rocket",
    rgb: "99, 102, 241",
    tag: "Product Launch",
    order: 0,
  },
  {
    year: "2025",
    title: "Full-Stack AI Automation",
    description:
      "Began delivering end-to-end AI agent & workflow systems for clients — cutting manual hours by 20+ per week.",
    icon: "Bot",
    rgb: "16, 185, 129",
    tag: "Service Launch",
    order: 1,
  },
  {
    year: "2024",
    title: "College ERP System",
    description:
      "Architected a role-based ERP for educational institutions managing 500+ students across four user portals.",
    icon: "GraduationCap",
    rgb: "20, 184, 166",
    tag: "Enterprise Build",
    order: 2,
  },
  {
    year: "2024",
    title: "Jibon — Blood Donation Platform",
    description:
      "Built a real-time donor-matching platform connecting 500+ registered donors with patients in under 30 minutes.",
    icon: "Droplets",
    rgb: "239, 68, 68",
    tag: "Social Impact",
    order: 3,
  },
  {
    year: "2024",
    title: "Roshbadam E-commerce Brand",
    description:
      "Delivered a full brand-to-market e-commerce launch: identity, photography, storefront, logistics, and Meta Ads.",
    icon: "ShoppingBag",
    rgb: "249, 115, 22",
    tag: "Brand Launch",
    order: 4,
  },
  {
    year: "2024",
    title: "The Cat Club",
    description:
      "Built a community-first e-commerce brand from scratch, growing to 1,200+ members before launching products.",
    icon: "Users",
    rgb: "139, 92, 246",
    tag: "Community Brand",
    order: 5,
  },
  {
    year: "2023",
    title: "Started Freelancing",
    description:
      "Began taking client projects in web development, automation, and digital marketing — building a full-stack portfolio.",
    icon: "Briefcase",
    rgb: "245, 158, 11",
    tag: "Career Start",
    order: 6,
  },
];

/* ─────────────────────────────────────────────────────────────
   SOCIAL LINKS  (matches the defaultSocials in Hero.tsx)
───────────────────────────────────────────────────────────── */
export const seedSocials: Omit<FirestoreSocial, "id">[] = [
  { name: "GitHub",   icon: "Github",        url: "https://github.com/NibirNissan",  order: 0 },
  { name: "Telegram", icon: "MessageCircle", url: "https://t.me/nibir_nissan",        order: 1 },
  { name: "WhatsApp", icon: "Phone",         url: "https://wa.me/8801976816697",      order: 2 },
];

/* ─────────────────────────────────────────────────────────────
   SERVICES  — sourced directly from services.ts (single source of truth)
   LucideIcon is stripped. pricing → packages, faq → faqs, roiLine → description.
   iconUrl starts blank so the admin can add an image URL later.
───────────────────────────────────────────────────────────── */
export const seedServices: Omit<FirestoreService, "id">[] = servicesData.map(
  (s, i) => ({
    title:        s.title,
    description:  s.roiLine,
    iconUrl:      "",
    price:        "Contact",
    badge:        "",
    color:        s.color,
    order:        i,
    process:      s.process.map((step) => ({
      title:       step.title,
      description: step.description,
    })),
    deliverables: s.deliverables.map((d) => ({
      title:       d.title,
      description: d.description,
    })),
    packages: s.pricing.map((tier) => ({
      name:     tier.name,
      subtitle: tier.description,
      price:    tier.price,
      features: [...tier.features],
    })),
    faqs: s.faq.map((f) => ({
      question: f.question,
      answer:   f.answer,
    })),
    createdAt: Date.now(),
  })
);
