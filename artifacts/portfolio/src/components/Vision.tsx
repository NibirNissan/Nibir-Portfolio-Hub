import { Rocket, Globe, Cpu, BarChart3, Code2 } from "lucide-react";

const pillars = [
  {
    icon: Cpu,
    label: "AI Automation",
    desc: "Intelligent workflows that eliminate bottlenecks and scale operations without scaling headcount.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: BarChart3,
    label: "Performance Marketing",
    desc: "Data-driven campaigns that turn ad spend into measurable revenue — at any scale.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: Code2,
    label: "High-End Development",
    desc: "Enterprise-grade digital products built to last — from architecture to pixel-perfect UI.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Globe,
    label: "Global Digital Agency",
    desc: "A world-class agency delivering end-to-end solutions for brands, startups, and enterprises.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

export default function Vision() {
  return (
    <section id="vision" className="py-20 md:py-28 relative overflow-hidden">
      {/* Glowing background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse at center top, #6366f1, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-8"
          style={{ background: "radial-gradient(ellipse, #38bdf8, transparent 70%)" }}
        />
      </div>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Rocket className="w-4 h-4" />
            Future Vision
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            The Roadmap: Building{" "}
            <span className="text-gradient">the Next Digital Giant</span>
          </h2>

          {/* Vision statement — glassmorphism card */}
          <div
            className="max-w-3xl mx-auto p-7 sm:p-8 rounded-2xl border border-indigo-500/20 mb-14 text-left"
            style={{
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 0 60px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-indigo-300 text-sm font-semibold">Vision Statement</span>
            </div>
            <blockquote className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium italic border-l-2 border-indigo-500/50 pl-5">
              "My goal is to establish a world-class Digital Agency that bridges the gap between{" "}
              <span className="text-indigo-300 not-italic font-semibold">AI Automation</span>,{" "}
              <span className="text-rose-300 not-italic font-semibold">Marketing</span>, and{" "}
              <span className="text-violet-300 not-italic font-semibold">High-end Development</span>. We are moving from a subscription provider
              to a full-scale digital solution powerhouse."
            </blockquote>
            <div className="mt-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-indigo-300">N</span>
              </div>
              <span className="text-slate-500 text-sm">Nibir Nissan — Founder</span>
            </div>
          </div>
        </div>

        {/* Four pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <div
              key={p.label}
              className={`relative p-6 rounded-2xl border ${p.border} card-hover overflow-hidden`}
              style={{
                background: "rgba(15, 23, 42, 0.55)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div className="absolute top-4 right-4 text-5xl font-black opacity-5 text-white leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className={`w-10 h-10 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center mb-4`}>
                <p.icon className={`w-5 h-5 ${p.color}`} />
              </div>
              <h4 className={`text-sm font-bold ${p.color} mb-2`}>{p.label}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-indigo-500/20"
            style={{
              background: "rgba(99, 102, 241, 0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse-slow" />
            <span className="text-slate-400 text-sm">From subscription provider → Full-scale digital solution powerhouse</span>
          </div>
        </div>
      </div>
    </section>
  );
}
