import { Code2, Figma, Video, Bot, Star } from "lucide-react";

const stats = [
  {
    icon: Code2,
    value: "2+",
    label: "Years in Web Dev",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: Figma,
    value: "3+",
    label: "Years in Figma",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Video,
    value: "6",
    label: "Years Video Editing",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    icon: Bot,
    value: "n8n",
    label: "AI Automation Expert",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

export default function About() {
  return (
    <section id="about" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
              <Star className="w-4 h-4" />
              About Me
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Building the future,{" "}
              <span className="text-gradient">one pixel</span> at a time
            </h2>
            <div className="space-y-4 text-slate-400 text-base leading-relaxed">
              <p>
                I'm <span className="text-white font-semibold">Nibir Nissan</span> — a Computer
                Science &amp; Technology (CST) student who turned a passion for
                technology into a multifaceted digital career. I build products
                that solve real problems and look beautiful doing it.
              </p>
              <p>
                My journey spans{" "}
                <span className="text-indigo-300 font-medium">web development</span>,{" "}
                <span className="text-violet-300 font-medium">UI/UX design</span>,{" "}
                <span className="text-sky-300 font-medium">professional video editing</span>, and{" "}
                <span className="text-emerald-300 font-medium">AI-powered automation</span> using
                n8n. I don't just write code — I architect systems, design
                experiences, and build businesses.
              </p>
              <p>
                From managing 2000+ users on The Subspot to setting up
                full e-commerce logistics for brands, I bring
                entrepreneurial thinking to every project I touch.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Problem Solver", "Entrepreneur", "Automation Expert", "Creator"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} card-hover`}
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
