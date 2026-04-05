import { ArrowDown, Github, MessageCircle, Phone } from "lucide-react";
import heroImg from "@assets/162cf2f13523cdbb8190637d39e5c469_1775426775549.webp";

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="hero-blob absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, #4338ca)" }}
        />
        <div
          className="hero-blob-2 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8b5cf6, #7c3aed)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 animate-float">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse-slow" />
              Available for freelance work
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
              <span className="text-white">Nibir</span>{" "}
              <span className="text-gradient">Nissan</span>
              <br />
              <span className="text-3xl md:text-4xl font-bold text-slate-300 mt-3 block">
                Entrepreneur &amp;{" "}
                <span className="text-gradient-blue">Developer</span>
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
              CST student turned{" "}
              <span className="text-indigo-300 font-medium">full-stack developer</span> &amp;{" "}
              <span className="text-violet-300 font-medium">AI automation expert</span>.
              Building digital products, automating workflows with n8n, and crafting
              premium visual experiences — from code to brand.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                onClick={() => scrollToSection("projects")}
                className="px-8 py-3.5 rounded-xl font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition-all duration-200 glow-blue hover:scale-105"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-3.5 rounded-xl font-semibold border border-white/15 text-white hover:bg-white/5 hover:border-indigo-500/50 transition-all duration-200"
              >
                Let's Talk
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/nibir_nissan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <div className="relative w-72 h-80 lg:w-80 lg:h-96">
              <div
                className="absolute inset-0 rounded-3xl opacity-40 blur-2xl"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                <img
                  src={heroImg}
                  alt="Nibir Nissan"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl border border-violet-500/40 bg-violet-500/10 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-violet-300">2k+</span>
                <span className="text-xs text-slate-400 font-medium text-center leading-tight">Active Users</span>
              </div>
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
                <span className="text-xl font-black text-indigo-300">n8n</span>
                <span className="text-xs text-slate-400 font-medium">Expert</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => scrollToSection("about")}
          className="text-slate-500 hover:text-indigo-400 transition-colors animate-bounce"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
