import { useState, useEffect } from "react";
import { Code2, Figma, Bot, Video, Layers, TrendingUp, Server, Smartphone, Cog } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { FirestoreSkill } from "@/lib/firestoreTypes";

type CategoryConfig = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  skills: string[];
};

const categoryConfigs: Record<string, Omit<CategoryConfig, "skills" | "label">> = {
  Tech: {
    icon: Code2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "hover:shadow-emerald-500/20",
  },
  Design: {
    icon: Figma,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "hover:shadow-violet-500/20",
  },
  Automation: {
    icon: Bot,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "hover:shadow-amber-500/20",
  },
  Video: {
    icon: Video,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    glow: "hover:shadow-sky-500/20",
  },
  "Digital Marketing": {
    icon: TrendingUp,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "hover:shadow-rose-500/20",
  },
  Backend: {
    icon: Server,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "hover:shadow-blue-500/20",
  },
  DevOps: {
    icon: Cog,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    glow: "hover:shadow-orange-500/20",
  },
  Mobile: {
    icon: Smartphone,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    glow: "hover:shadow-pink-500/20",
  },
};

const fallbackConfigs: CategoryConfig[] = [
  {
    icon: Code2,
    label: "Tech",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "hover:shadow-emerald-500/20",
    skills: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "React"],
  },
  {
    icon: Figma,
    label: "Design",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "hover:shadow-violet-500/20",
    skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "UI/UX Design"],
  },
  {
    icon: Bot,
    label: "Automation",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "hover:shadow-amber-500/20",
    skills: ["n8n", "AI Agents", "Workflow Automation", "Facebook Business Suite"],
  },
  {
    icon: Video,
    label: "Video",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    glow: "hover:shadow-sky-500/20",
    skills: ["CapCut", "Adobe Premiere Pro", "Social Media Ads", "Motion Graphics"],
  },
  {
    icon: TrendingUp,
    label: "Digital Marketing",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "hover:shadow-rose-500/20",
    skills: ["Meta Ads", "Google Ads", "SEO", "Content Strategy", "Analytics"],
  },
];

const defaultCategoryConfig: Omit<CategoryConfig, "skills" | "label"> = {
  icon: Code2,
  color: "text-neutral-400",
  bg: "bg-neutral-500/10",
  border: "border-neutral-500/20",
  glow: "hover:shadow-neutral-500/20",
};

export default function Skills() {
  const [skillGroups, setSkillGroups] = useState<CategoryConfig[]>(fallbackConfigs);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    (async () => {
      try {
        const q = query(collection(db!, "skills"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSkill));
        if (items.length === 0) return;

        const grouped: Record<string, string[]> = {};
        for (const skill of items) {
          (grouped[skill.category] = grouped[skill.category] || []).push(skill.name);
        }

        const groups: CategoryConfig[] = Object.entries(grouped).map(([label, skills]) => ({
          label,
          skills,
          ...(categoryConfigs[label] ?? defaultCategoryConfig),
        }));

        setSkillGroups(groups);
      } catch {
        try {
          const snap = await getDocs(collection(db!, "skills"));
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSkill));
          if (items.length === 0) return;

          const grouped: Record<string, string[]> = {};
          for (const skill of items) {
            (grouped[skill.category] = grouped[skill.category] || []).push(skill.name);
          }

          const groups: CategoryConfig[] = Object.entries(grouped).map(([label, skills]) => ({
            label,
            skills,
            ...(categoryConfigs[label] ?? defaultCategoryConfig),
          }));

          setSkillGroups(groups);
        } catch { /* use fallback */ }
      }
    })();
  }, []);

  return (
    <section id="skills" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><Layers className="w-4 h-4" /></span>
            Skills
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            The <span className="text-gradient">Tech Stack</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            A versatile toolkit spanning development, design, automation, and content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className={`reveal-card p-6 sm:p-8 rounded-2xl border ${group.border} bg-neutral-900/60 card-hover hover:shadow-xl ${group.glow}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${group.bg} border ${group.border} flex items-center justify-center`}>
                  <group.icon className={`w-5 h-5 ${group.color}`} />
                </div>
                <h3 className={`text-lg font-bold ${group.color}`}>{group.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`skill-badge px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border ${group.border} ${group.bg} text-neutral-300 cursor-default`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
