import { Bot, Code2, Video, ShoppingBag, Zap, TrendingUp, Globe, LayoutDashboard, Rocket } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Custom AI Agent & Workflow Building",
    description:
      "End-to-end automation using n8n — from lead generation pipelines to complex multi-step AI workflows that run 24/7 without human intervention.",
    features: ["n8n Workflow Design", "AI Agent Integration", "API Connections", "Zapier Migration"],
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    tag: "Most Popular",
  },
  {
    icon: Code2,
    title: "Web Development & UI/UX Design",
    description:
      "From Figma prototypes to production-ready React applications. Full stack — design systems, component libraries, and responsive frontends.",
    features: ["Figma Prototyping", "React Development", "Tailwind CSS", "Responsive Design"],
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    glow: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    tag: "Full Stack",
  },
  {
    icon: Video,
    title: "Professional Video Editing",
    description:
      "High-impact video content for social media, ads, and brand campaigns. Short-form content that converts, from raw footage to polished deliverables.",
    features: ["Social Media Reels", "Ad Creatives", "Premiere Pro", "CapCut"],
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    glow: "hover:border-sky-500/40 hover:shadow-sky-500/10",
    tag: "Creative",
  },
  {
    icon: TrendingUp,
    title: "Results-Driven Digital Marketing",
    description:
      "Data-backed marketing campaigns that generate real leads and scale brands. From Meta Ads automation to full-funnel strategy — performance you can measure.",
    features: ["Meta Ads & Automation", "Google Ads Campaigns", "Lead Generation Funnels", "Brand Scaling Strategy"],
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "hover:border-rose-500/40 hover:shadow-rose-500/10",
    tag: "Growth",
  },
  {
    icon: ShoppingBag,
    title: "Digital Subscription Business Setup",
    description:
      "Complete setup of digital subscription systems and e-commerce stores — from payment integration to automated delivery and customer management.",
    features: ["Subscription Systems", "E-commerce Setup", "Payment Integration", "Logistics"],
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "hover:border-violet-500/40 hover:shadow-violet-500/10",
    tag: "Business",
  },
  {
    icon: Rocket,
    title: "Web App & SaaS Development",
    description:
      "Building custom SaaS platforms and web applications with complex logic, user dashboards, and subscription-based ecosystems.",
    features: ["Custom Dashboard Design", "Multi-user Role Management", "API & Payment Integration", "Scalable Architecture"],
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    tag: "Most Requested",
  },
];

const glassServices = [
  {
    icon: Globe,
    title: "High-Conversion WordPress Development",
    tagline: "Scalable & SEO-Optimized Websites",
    description:
      "Professional WordPress sites engineered to turn visitors into customers. Expert in custom theme customization, page builders, and WooCommerce — with a relentless focus on speed and SEO.",
    features: [
      { label: "Custom Theme Customization", detail: "Pixel-perfect designs tailored to your brand" },
      { label: "Elementor / Divi Expert", detail: "Advanced page builder mastery for rapid delivery" },
      { label: "WooCommerce Setup", detail: "Full e-commerce store configuration & optimization" },
      { label: "Page Speed Optimization", detail: "Core Web Vitals & Lighthouse score improvement" },
    ],
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.12)",
    glowBorder: "rgba(34, 211, 238, 0.25)",
    tag: "WordPress",
    tagColor: "text-cyan-300 bg-cyan-500/10 border-cyan-500/25",
  },
  {
    icon: LayoutDashboard,
    title: "Web App & SaaS Product Development",
    tagline: "Building the Future of Digital Tools",
    description:
      "Leveraging ERP system architecture and proven subscription models to build robust, scalable SaaS platforms. From admin dashboards to full multi-tenant logic — built to grow.",
    features: [
      { label: "Custom Dashboard Design", detail: "Data-rich UIs that make complex info intuitive" },
      { label: "Multi-user Role Management", detail: "Admin / User / Department access control" },
      { label: "API Integration", detail: "Third-party services wired seamlessly into your app" },
      { label: "Subscription-based Logic", detail: "Billing, gating, and renewal flows built-in" },
    ],
    color: "text-violet-400",
    glow: "rgba(139, 92, 246, 0.12)",
    glowBorder: "rgba(139, 92, 246, 0.25)",
    tag: "Most Requested",
    tagColor: "text-violet-300 bg-violet-500/10 border-violet-500/25",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Zap className="w-4 h-4" />
            Services
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            What I <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Comprehensive digital services that turn ideas into scalable, profitable outcomes.
          </p>
        </div>

        {/* Standard service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {services.map((service) => (
            <div
              key={service.title}
              className={`p-6 sm:p-8 rounded-2xl border ${service.border} bg-slate-900/70 card-hover hover:shadow-xl ${service.glow} transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl ${service.bg} border ${service.border} flex items-center justify-center`}>
                  <service.icon className={`w-5 h-5 ${service.color}`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${service.bg} ${service.color} border ${service.border}`}>
                  {service.tag}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 leading-snug">{service.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${service.color.replace("text-", "bg-")}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Glassmorphism premium cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {glassServices.map((service) => (
            <div
              key={service.title}
              className="relative rounded-2xl card-hover overflow-hidden"
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1px solid ${service.glowBorder}`,
                boxShadow: `0 0 40px ${service.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              {/* Inner glow blob */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-20"
                style={{ background: `radial-gradient(circle, ${service.glow.replace("0.12", "1")}, transparent 70%)`, filter: "blur(40px)" }}
              />

              <div className="relative p-6 sm:p-8">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: service.glow, border: `1px solid ${service.glowBorder}` }}
                  >
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${service.tagColor}`}>
                    {service.tag}
                  </span>
                </div>

                <p className={`text-xs font-semibold tracking-widest uppercase ${service.color} mb-1`}>
                  {service.tagline}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-white mb-3 leading-snug">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: service.glow.replace("0.12", "1").replace("rgba", "rgb").replace(", 1)", ")") }}
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-white">{f.label}</span>
                        <span className="text-slate-500 text-xs"> — {f.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
