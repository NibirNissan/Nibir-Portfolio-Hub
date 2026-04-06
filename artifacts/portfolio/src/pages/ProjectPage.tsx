import { useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { getProjectBySlug } from "@/data/projects";
import NebulaBg from "@/components/NebulaBg";
import ScanLine from "@/components/ScanLine";
import ScrollReveal from "@/components/ScrollReveal";
import BackButton from "@/components/BackButton";
import ProjectNav from "@/components/ProjectNav";
import { Sparkles, AlertTriangle, Cpu, Zap } from "lucide-react";

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
        background: `linear-gradient(135deg, rgba(${colors.rgb}, 0.05), rgba(10, 10, 10, 0.8))`,
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

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const project = getProjectBySlug(params.slug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

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
    <div className="min-h-screen overflow-x-hidden grain-bg relative" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
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
              style={{ background: "rgba(10, 10, 10, 0.6)" }}
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

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="icon-duotone"><Zap className="w-4 h-4" /></span>
                Features
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
                Key <span className="text-gradient">Capabilities</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {project.features.map((feature, idx) => (
              <ScrollReveal key={feature.title} delay={idx * 100}>
                <div
                  className="p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] h-full"
                  style={{
                    background: "rgba(10, 10, 10, 0.5)",
                    borderColor: `rgba(${colors.rgb}, 0.15)`,
                    boxShadow: `0 0 0 0 rgba(${colors.rgb}, 0)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${colors.rgb}, 0.4)`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px rgba(${colors.rgb}, 0.1)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${colors.rgb}, 0.15)`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 rgba(${colors.rgb}, 0)`;
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg font-black"
                    style={{ background: `rgba(${colors.rgb}, 0.1)`, color: `rgba(${colors.rgb}, 0.7)` }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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
                    background: "rgba(10, 10, 10, 0.6)",
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
