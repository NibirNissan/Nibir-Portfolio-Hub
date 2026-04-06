import { Code2, Figma, Video, Bot, Star } from "lucide-react";
import aboutImg from "@assets/WhatsApp_Image_2026-02-28_at_3.21.31_AM_1775426721378.jpeg";
import bwImg from "@assets/edb565d71d70ceba8f9cf9b19979ae50_1775426775549.webp";
import outdoorImg from "@assets/nibir_1775426721380.jpg";
import nightImg from "@assets/WhatsApp_Image_2026-02-28_at_3.16.26_AM_1775426721379.jpeg";

const stats = [
  {
    icon: Code2,
    value: "4+",
    label: "Years in Web Dev",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
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
    label: "Years Editing",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    icon: Bot,
    value: "n8n",
    label: "AI Expert",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

const galleryPhotos = [
  { src: bwImg, alt: "Nibir Nissan - Studio" },
  { src: outdoorImg, alt: "Nibir Nissan - Outdoor" },
  { src: nightImg, alt: "Nibir Nissan - Night" },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

          <div className="w-full lg:flex-shrink-0 lg:w-80 xl:w-96 mx-auto max-w-sm lg:max-w-none">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-15 blur-3xl"
                style={{ background: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent))` }}
              />
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl" style={{ border: `1px solid rgba(var(--theme-accent-rgb), 0.15)` }}>
                <img
                  src={aboutImg}
                  alt="Nibir Nissan at the waterfront"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                {galleryPhotos.map((photo) => (
                  <div
                    key={photo.alt}
                    className="aspect-square rounded-xl overflow-hidden border border-white/10 card-hover"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
              <span className="icon-duotone"><Star className="w-4 h-4" /></span>
              About Me
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Building the future,{" "}
              <span className="text-gradient">one pixel</span> at a time
            </h2>
            <div className="space-y-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
              <p>
                I'm <span className="text-white font-semibold">Nibir Nissan</span> — a Computer
                Science &amp; Technology (CST) student who turned a passion for
                technology into a multifaceted digital career. I build products
                that solve real problems and look beautiful doing it.
              </p>
              <p>
                My journey spans{" "}
                <span className="font-medium" style={{ color: "var(--theme-accent-light)" }}>web development</span>,{" "}
                <span className="text-violet-300 font-medium">UI/UX design</span>,{" "}
                <span className="text-sky-300 font-medium">professional video editing</span>, and{" "}
                <span className="font-medium" style={{ color: "var(--theme-secondary-light)" }}>AI-powered automation</span> using
                n8n. I don't just write code — I architect systems, design
                experiences, and build businesses.
              </p>
              <p>
                From managing 2000+ users on The Subspot to building full
                e-commerce logistics for brands, I bring entrepreneurial
                thinking to every project I touch.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
              {["Problem Solver", "Entrepreneur", "Automation Expert", "Creator"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                  style={{
                    border: `1px solid rgba(var(--theme-accent-rgb), 0.25)`,
                    backgroundColor: `rgba(var(--theme-accent-rgb), 0.08)`,
                    color: "var(--theme-accent-light)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`reveal-card p-4 sm:p-5 rounded-2xl border ${stat.border} ${stat.bg} card-hover`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`text-xl sm:text-2xl font-black ${stat.color} mb-0.5`}>{stat.value}</div>
                  <div className="text-neutral-400 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
