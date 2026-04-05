import { Code2, Figma, Bot, Video, Layers, TrendingUp } from "lucide-react";

const skillGroups = [
  {
    icon: Code2,
    label: "Tech",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    glow: "hover:shadow-indigo-500/20",
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
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "hover:shadow-emerald-500/20",
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

export default function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Layers className="w-4 h-4" />
            Skills
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            The <span className="text-gradient">Tech Stack</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            A versatile toolkit spanning development, design, automation, and content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className={`p-6 sm:p-8 rounded-2xl border ${group.border} bg-slate-900/60 card-hover hover:shadow-xl ${group.glow}`}
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
                    className={`skill-badge px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border ${group.border} ${group.bg} text-slate-300 cursor-default`}
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
