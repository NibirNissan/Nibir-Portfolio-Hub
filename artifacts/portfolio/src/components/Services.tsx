import { Bot, Code2, Video, ShoppingBag, Zap } from "lucide-react";

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
      "From Figma prototypes to production-ready React applications. I handle the full stack — design systems, component libraries, and responsive frontends.",
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
      "High-impact video content for social media, ads, and brand campaigns. Specializing in short-form content that converts, from raw footage to polished deliverables.",
    features: ["Social Media Reels", "Ad Creatives", "Premiere Pro", "CapCut"],
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    glow: "hover:border-sky-500/40 hover:shadow-sky-500/10",
    tag: "Creative",
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
];

export default function Services() {
  return (
    <section id="services" className="py-28 relative">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Zap className="w-4 h-4" />
            Services
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            What I <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Comprehensive digital services that turn ideas into scalable, profitable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className={`p-8 rounded-2xl border ${service.border} bg-slate-900/70 card-hover hover:shadow-xl ${service.glow} transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${service.bg} border ${service.border} flex items-center justify-center`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${service.bg} ${service.color} border ${service.border}`}>
                  {service.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 leading-snug">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{service.description}</p>

              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${service.color.replace("text-", "bg-")}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
