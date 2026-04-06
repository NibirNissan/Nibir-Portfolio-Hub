import { ArrowDown, Github, MessageCircle, Phone } from "lucide-react";
import heroImg from "@assets/162cf2f13523cdbb8190637d39e5c469_1775426775549.webp";

const stagger = (delay: number): React.CSSProperties => ({
  opacity: 0,
  animation: `hero-stagger-in 0.7s ease-out ${delay}s forwards`,
});

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-12 pb-24">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="hero-blob absolute top-1/3 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-15"
          style={{ background: `radial-gradient(circle, var(--theme-accent), var(--theme-accent))` }}
        />
        <div
          className="hero-blob-2 absolute bottom-1/3 right-1/4 w-56 h-56 md:w-80 md:h-80 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, var(--theme-secondary), var(--theme-secondary))` }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

          <div className="flex-1 text-center lg:text-left w-full">
            <div
              style={stagger(0.1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              {...{
                style: {
                  ...stagger(0.1),
                  borderColor: `rgba(var(--theme-accent-rgb), 0.3)`,
                  backgroundColor: `rgba(var(--theme-accent-rgb), 0.08)`,
                  color: "var(--theme-accent-light)",
                  border: `1px solid rgba(var(--theme-accent-rgb), 0.3)`,
                },
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse-slow"
                style={{ backgroundColor: "var(--theme-accent-light)" }}
              />
              Available for freelance work
            </div>

            <h1 style={stagger(0.25)} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-none">
              <span className="text-white">Nibir</span>{" "}
              <span className="text-gradient">Nissan</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-300 mt-3 block">
                Entrepreneur &amp;{" "}
                <span className="text-gradient-amber">Developer</span>
              </span>
            </h1>

            <p style={stagger(0.4)} className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              CST student turned{" "}
              <span className="font-medium" style={{ color: "var(--theme-accent-light)" }}>full-stack developer</span> &amp;{" "}
              <span className="font-medium" style={{ color: "var(--theme-secondary-light)" }}>AI automation expert</span>.
              Building digital products, automating workflows with n8n, and crafting
              premium visual experiences — from code to brand.
            </p>

            <div style={stagger(0.55)} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <button
                onClick={() => scrollToSection("projects")}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-200 glow-emerald hover:scale-105 text-sm sm:text-base"
                style={{ backgroundColor: "var(--theme-accent)", color: "#000" }}
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-white transition-all duration-200 text-sm sm:text-base"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(var(--theme-accent-rgb), 0.5)`; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                Let's Talk
              </button>
            </div>

            <div style={stagger(0.7)} className="flex items-center justify-center lg:justify-start gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500/50 hover:bg-neutral-500/10 transition-all duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/nibir_nissan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div style={stagger(0.55)} className="flex-shrink-0 w-full max-w-[260px] sm:max-w-[300px] lg:max-w-none lg:w-auto mx-auto lg:mx-0">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl opacity-30 blur-2xl"
                style={{ background: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent))` }}
              />
              <div
                className="relative w-full lg:w-72 xl:w-80 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  border: `1px solid rgba(var(--theme-accent-rgb), 0.25)`,
                  boxShadow: `0 25px 50px -12px rgba(var(--theme-accent-rgb), 0.15)`,
                }}
              >
                <img
                  src={heroImg}
                  alt="Nibir Nissan"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center shadow-lg"
                style={{
                  border: `1px solid rgba(var(--theme-secondary-rgb), 0.3)`,
                  backgroundColor: `rgba(var(--theme-secondary-rgb), 0.1)`,
                }}
              >
                <span className="text-xl sm:text-2xl font-black" style={{ color: "var(--theme-secondary-light)" }}>2k+</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-medium text-center leading-tight">Active Users</span>
              </div>
              <div
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center shadow-lg"
                style={{
                  border: `1px solid rgba(var(--theme-accent-rgb), 0.3)`,
                  backgroundColor: `rgba(var(--theme-accent-rgb), 0.1)`,
                }}
              >
                <span className="text-base sm:text-xl font-black" style={{ color: "var(--theme-accent-light)" }}>n8n</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-medium">Expert</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => scrollToSection("about")}
          className="text-neutral-500 transition-colors animate-bounce"
          style={{ ["--tw-text-opacity" as string]: 1 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--theme-accent-light)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = ""; }}
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
