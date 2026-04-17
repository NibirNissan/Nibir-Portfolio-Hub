import { useState, useEffect } from "react";
import { Bot, Code2, Video, ShoppingBag, Zap, TrendingUp, Globe, LayoutDashboard, Rocket, ArrowRight, ImageIcon } from "lucide-react";
import { Link } from "wouter";
import NebulaBg from "./NebulaBg";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { FirestoreService } from "@/lib/firestoreTypes";

const colorToRgb: Record<string, string> = {
  "text-emerald-400": "16, 185, 129",
  "text-indigo-400":  "99, 102, 241",
  "text-sky-400":     "56, 189, 248",
  "text-rose-400":    "251, 113, 133",
  "text-violet-400":  "139, 92, 246",
  "text-amber-400":   "245, 158, 11",
};

const colorKeyToRgb: Record<string, string> = {
  emerald: "16, 185, 129",
  indigo:  "99, 102, 241",
  sky:     "56, 189, 248",
  rose:    "251, 113, 133",
  violet:  "139, 92, 246",
  amber:   "245, 158, 11",
  cyan:    "34, 211, 238",
};

interface GeoShape {
  type: "sphere" | "line" | "ring";
  size: number;
  top?: string; bottom?: string; left?: string; right?: string;
  anim: string; dur: string; delay?: string;
  opacity: number; angle?: number;
}

const geoConfigs: GeoShape[][] = [
  [
    { type: "sphere", size: 48, top: "-12px", right: "20px", anim: "geo-float-1", dur: "7s", opacity: 0.18 },
    { type: "line", size: 80, bottom: "16px", left: "-8px", anim: "geo-line-drift", dur: "9s", opacity: 0.12, angle: 30 },
    { type: "ring", size: 32, bottom: "-8px", right: "40%", anim: "geo-float-3", dur: "8s", delay: "1s", opacity: 0.14 },
  ],
  [
    { type: "sphere", size: 36, bottom: "10px", left: "10px", anim: "geo-float-2", dur: "8s", opacity: 0.16 },
    { type: "line", size: 60, top: "20px", right: "-4px", anim: "geo-line-drift", dur: "10s", delay: "0.5s", opacity: 0.1, angle: -20 },
  ],
  [
    { type: "ring", size: 44, top: "-6px", left: "30%", anim: "geo-float-1", dur: "9s", delay: "0.3s", opacity: 0.15 },
    { type: "sphere", size: 28, bottom: "-4px", right: "15px", anim: "geo-float-3", dur: "7.5s", opacity: 0.18 },
    { type: "line", size: 70, top: "50%", left: "-12px", anim: "geo-line-drift", dur: "11s", opacity: 0.1, angle: 45 },
  ],
  [
    { type: "sphere", size: 40, top: "8px", left: "-6px", anim: "geo-float-3", dur: "8.5s", opacity: 0.17 },
    { type: "line", size: 90, bottom: "20px", right: "5px", anim: "geo-line-drift", dur: "10s", delay: "1s", opacity: 0.11, angle: -35 },
  ],
  [
    { type: "ring", size: 38, top: "-10px", right: "25%", anim: "geo-float-2", dur: "9s", opacity: 0.15 },
    { type: "sphere", size: 30, bottom: "5px", left: "20px", anim: "geo-float-1", dur: "7s", delay: "0.8s", opacity: 0.16 },
  ],
  [
    { type: "sphere", size: 52, top: "-8px", left: "15px", anim: "geo-float-1", dur: "8s", delay: "0.5s", opacity: 0.2 },
    { type: "ring", size: 26, bottom: "10px", right: "10px", anim: "geo-float-2", dur: "9.5s", opacity: 0.14 },
    { type: "line", size: 65, top: "40%", right: "-10px", anim: "geo-line-drift", dur: "10s", delay: "0.3s", opacity: 0.1, angle: 20 },
  ],
];

function GeoDecor({ shapes, rgb }: { shapes: GeoShape[]; rgb: string }) {
  return (
    <>
      {shapes.map((s, i) => {
        const pos: React.CSSProperties = {
          position: "absolute", top: s.top, bottom: s.bottom, left: s.left, right: s.right,
          pointerEvents: "none",
          animation: `${s.anim} ${s.dur} ease-in-out ${s.delay || "0s"} infinite`,
          zIndex: 0,
        };
        if (s.type === "sphere") return (
          <div key={i} style={{ ...pos, width: s.size, height: s.size, borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, rgba(${rgb}, ${s.opacity + 0.08}), rgba(${rgb}, ${s.opacity * 0.3}) 60%, transparent 80%)`,
            boxShadow: `0 0 ${s.size * 0.6}px rgba(${rgb}, ${s.opacity * 0.5})`, filter: "blur(1px)" }} />
        );
        if (s.type === "ring") return (
          <div key={i} style={{ ...pos, width: s.size, height: s.size, borderRadius: "50%",
            border: `1.5px solid rgba(${rgb}, ${s.opacity})`,
            boxShadow: `0 0 ${s.size * 0.4}px rgba(${rgb}, ${s.opacity * 0.4}), inset 0 0 ${s.size * 0.3}px rgba(${rgb}, ${s.opacity * 0.15})` }} />
        );
        return (
          <div key={i} style={{ ...pos, width: s.size, height: 1.5,
            background: `linear-gradient(90deg, transparent, rgba(${rgb}, ${s.opacity}), transparent)`,
            boxShadow: `0 0 8px rgba(${rgb}, ${s.opacity * 0.6})`,
            transform: `rotate(${s.angle || 0}deg)` }} />
        );
      })}
    </>
  );
}

const services = [
  {
    icon: Bot, title: "Custom AI Agent & Workflow Building", slug: "ai-automation",
    description: "End-to-end automation using n8n — from lead generation pipelines to complex multi-step AI workflows that run 24/7 without human intervention.",
    features: ["n8n Workflow Design", "AI Agent Integration", "API Connections", "Zapier Migration"],
    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", tag: "Most Popular",
  },
  {
    icon: Code2, title: "Web Development & UI/UX Design", slug: "web-development",
    description: "From Figma prototypes to production-ready React applications. Full stack — design systems, component libraries, and responsive frontends.",
    features: ["Figma Prototyping", "React Development", "Tailwind CSS", "Responsive Design"],
    color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", tag: "Full Stack",
  },
  {
    icon: Video, title: "Professional Video Editing", slug: "video-editing",
    description: "High-impact video content for social media, ads, and brand campaigns. Short-form content that converts, from raw footage to polished deliverables.",
    features: ["Social Media Reels", "Ad Creatives", "Premiere Pro", "CapCut"],
    color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", tag: "Creative",
  },
  {
    icon: TrendingUp, title: "Results-Driven Digital Marketing", slug: "digital-marketing",
    description: "Data-backed marketing campaigns that generate real leads and scale brands. From Meta Ads automation to full-funnel strategy — performance you can measure.",
    features: ["Meta Ads & Automation", "Google Ads Campaigns", "Lead Generation Funnels", "Brand Scaling Strategy"],
    color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", tag: "Growth",
  },
  {
    icon: ShoppingBag, title: "Digital Subscription Business Setup", slug: "subscription-business",
    description: "Complete setup of digital subscription systems and e-commerce stores — from payment integration to automated delivery and customer management.",
    features: ["Subscription Systems", "E-commerce Setup", "Payment Integration", "Logistics"],
    color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", tag: "Business",
  },
  {
    icon: Rocket, title: "Web App & SaaS Development", slug: "saas-development",
    description: "Building custom SaaS platforms and web applications with complex logic, user dashboards, and subscription-based ecosystems.",
    features: ["Custom Dashboard Design", "Multi-user Role Management", "API & Payment Integration", "Scalable Architecture"],
    color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", tag: "Most Requested",
  },
];

const glassServices = [
  {
    icon: Globe, title: "High-Conversion WordPress Development", slug: "wordpress-development",
    tagline: "Scalable & SEO-Optimized Websites",
    description: "Professional WordPress sites engineered to turn visitors into customers. Expert in custom theme customization, page builders, and WooCommerce — with a relentless focus on speed and SEO.",
    features: [
      { label: "Custom Theme Customization", detail: "Pixel-perfect designs tailored to your brand" },
      { label: "Elementor / Divi Expert", detail: "Advanced page builder mastery for rapid delivery" },
      { label: "WooCommerce Setup", detail: "Full e-commerce store configuration & optimization" },
      { label: "Page Speed Optimization", detail: "Core Web Vitals & Lighthouse score improvement" },
    ],
    color: "text-cyan-400", glow: "rgba(34, 211, 238, 0.12)", glowBorder: "rgba(34, 211, 238, 0.25)",
    rgb: "34, 211, 238", tag: "WordPress", tagColor: "text-cyan-300 bg-cyan-500/10 border-cyan-500/25",
  },
  {
    icon: LayoutDashboard, title: "Web App & SaaS Product Development", slug: "webapp-saas-product",
    tagline: "Building the Future of Digital Tools",
    description: "Leveraging ERP system architecture and proven subscription models to build robust, scalable SaaS platforms. From admin dashboards to full multi-tenant logic — built to grow.",
    features: [
      { label: "Custom Dashboard Design", detail: "Data-rich UIs that make complex info intuitive" },
      { label: "Multi-user Role Management", detail: "Admin / User / Department access control" },
      { label: "API Integration", detail: "Third-party services wired seamlessly into your app" },
      { label: "Subscription-based Logic", detail: "Billing, gating, and renewal flows built-in" },
    ],
    color: "text-violet-400", glow: "rgba(139, 92, 246, 0.12)", glowBorder: "rgba(139, 92, 246, 0.25)",
    rgb: "139, 92, 246", tag: "Most Requested", tagColor: "text-violet-300 bg-violet-500/10 border-violet-500/25",
  },
];

function DynamicServiceCard({ service, idx }: { service: FirestoreService; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const rgb = colorKeyToRgb[service.color || "indigo"] || "99, 102, 241";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="reveal-card relative flex flex-col p-6 sm:p-8 rounded-2xl overflow-hidden"
      style={{
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid rgba(${rgb}, ${hovered ? 0.45 : 0.12})`,
        boxShadow: hovered
          ? `0 0 50px rgba(${rgb}, 0.12), 0 0 0 1px rgba(${rgb}, 0.08), inset 0 0 30px rgba(${rgb}, 0.03)`
          : `0 4px 24px rgba(0,0,0,0.35)`,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, background 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Inner corner glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 pointer-events-none rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${rgb}, ${hovered ? 0.12 : 0.04}), transparent 70%)`,
          filter: "blur(30px)",
          transition: "all 0.4s ease",
        }}
      />

      {/* Header row: icon + badge */}
      <div className="relative z-10 flex items-start justify-between mb-5 gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-2"
          style={{
            background: `rgba(${rgb}, 0.1)`,
            border: `1px solid rgba(${rgb}, 0.25)`,
            boxShadow: hovered ? `0 0 20px rgba(${rgb}, 0.2)` : "none",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {service.iconUrl
            ? <img src={service.iconUrl} alt="" className="max-w-full max-h-full object-contain" />
            : <ImageIcon className="w-5 h-5" style={{ color: `rgba(${rgb}, 1)` }} />
          }
        </div>
        {service.badge ? (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap"
            style={{ color: `rgba(${rgb}, 1)`, borderColor: `rgba(${rgb}, 0.3)`, background: `rgba(${rgb}, 0.08)` }}
          >
            {service.badge}
          </span>
        ) : service.price ? (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap"
            style={{ color: `rgba(${rgb}, 1)`, borderColor: `rgba(${rgb}, 0.3)`, background: `rgba(${rgb}, 0.08)` }}
          >
            {service.price}
          </span>
        ) : null}
      </div>

      {/* Text */}
      <h3 className="relative z-10 text-base sm:text-lg font-bold text-white mb-3 leading-snug">
        {service.title}
      </h3>
      <p className="relative z-10 text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-3 flex-1">
        {service.description}
      </p>

      {/* Learn More */}
      <div className="relative z-10 mt-5 pt-4 border-t" style={{ borderColor: `rgba(${rgb}, 0.12)` }}>
        <Link
          href={`/service/${service.id}`}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-300"
          style={{ color: hovered ? `rgba(${rgb}, 1)` : `rgba(${rgb}, 0.7)` }}
        >
          Learn More
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  const [dynamicServices, setDynamicServices] = useState<FirestoreService[]>([]);
  const [loadedDynamic, setLoadedDynamic] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) { setLoadedDynamic(true); return; }
    (async () => {
      try {
        const q = query(collection(db!, "services"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setDynamicServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreService)));
      } catch {
        try {
          const snap = await getDocs(collection(db!, "services"));
          setDynamicServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreService)));
        } catch { /* empty */ }
      }
      setLoadedDynamic(true);
    })();
  }, []);

  const useDynamic = loadedDynamic && dynamicServices.length > 0;

  return (
    <section id="services" className="py-20 md:py-28 relative overflow-hidden">
      <NebulaBg variant="emerald-amber" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="text-[10rem] sm:text-[13rem] md:text-[16rem] lg:text-[20rem] font-black tracking-tight text-white whitespace-nowrap"
          style={{ opacity: 0.025, transform: "rotate(-6deg)" }}
        >
          SOLUTIONS
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><Zap className="w-4 h-4" /></span>
            Services
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            What I <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            Comprehensive digital services that turn ideas into scalable, profitable outcomes.
          </p>
        </div>

        {useDynamic ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {dynamicServices.map((service, idx) => (
              <DynamicServiceCard key={service.id} service={service} idx={idx} />
            ))}
          </div>
        ) : (
          <>
            {/* Standard service cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {services.map((service, idx) => {
                const rgb = colorToRgb[service.color] || "99, 102, 241";
                return (
                  <div
                    key={service.title}
                    className={`reveal-card relative overflow-hidden p-6 sm:p-8 rounded-2xl border ${service.border} bg-neutral-900/70 card-hover hover:shadow-xl transition-all duration-300`}
                    style={{
                      ["--hover-border-color" as string]: `rgba(${rgb}, 0.4)`,
                    }}
                  >
                    <GeoDecor shapes={geoConfigs[idx]} rgb={rgb} />

                    {/* Header */}
                    <div className="relative z-10 flex items-start justify-between mb-5">
                      <div className={`w-11 h-11 rounded-xl ${service.bg} border ${service.border} flex items-center justify-center`}>
                        <service.icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${service.bg} ${service.color} border ${service.border}`}>
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="relative z-10 text-base sm:text-lg font-bold text-white mb-3 leading-snug">{service.title}</h3>
                    <p className="relative z-10 text-neutral-400 text-xs sm:text-sm leading-relaxed mb-5">{service.description}</p>

                    {/* Sleek bullet list */}
                    <ul className="relative z-10 space-y-2.5">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
                          <span
                            className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center"
                            style={{ background: `rgba(${rgb}, 0.1)`, border: `1px solid rgba(${rgb}, 0.2)` }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: `rgba(${rgb}, 1)` }}
                            />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/service/${service.slug}`}
                      className={`group relative z-10 mt-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold ${service.color} transition-all duration-300`}
                    >
                      Learn More
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>

                    {service.title === "Digital Subscription Business Setup" && (
                      <div className="relative z-10 mt-6 p-4 rounded-xl border border-violet-500/15 bg-violet-500/5">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 relative">
                            <div className="absolute inset-0 rounded-xl opacity-30"
                              style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%)" }} />
                            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full relative">
                              <defs>
                                <linearGradient id="chart-grad" x1="0" y1="60" x2="70" y2="10">
                                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.15)" />
                                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.5)" />
                                </linearGradient>
                                <linearGradient id="line-grad" x1="0" y1="50" x2="70" y2="10">
                                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
                                </linearGradient>
                                <filter id="glow">
                                  <feGaussianBlur stdDeviation="2" result="blur" />
                                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                              </defs>
                              <path d="M12 65 L12 60 Q20 58 28 50 Q36 40 44 36 Q52 30 58 20 Q62 14 68 10" fill="none" stroke="url(#line-grad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
                              <path d="M12 65 L12 60 Q20 58 28 50 Q36 40 44 36 Q52 30 58 20 Q62 14 68 10 L68 65 Z" fill="url(#chart-grad)" />
                              <circle cx="68" cy="10" r="4" fill="#a78bfa" opacity="0.9" filter="url(#glow)">
                                <animate attributeName="r" values="3.5;5;3.5" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                              </circle>
                              <line x1="10" y1="65" x2="72" y2="65" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
                              {[20, 35, 50, 65].map((y) => (
                                <line key={y} x1="10" y1={y} x2="72" y2={y} stroke="rgba(139,92,246,0.06)" strokeWidth="0.5" />
                              ))}
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl sm:text-3xl font-black text-violet-300">2k+</span>
                              <TrendingUp className="w-4 h-4 text-violet-400" />
                            </div>
                            <p className="text-neutral-500 text-xs mt-0.5">Active subscribers &amp; growing</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Glassmorphism premium cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {glassServices.map((service) => (
                <div
                  key={service.title}
                  className="reveal-card relative rounded-2xl card-hover overflow-hidden"
                  style={{
                    background: "rgba(var(--theme-surface-rgb), 0.6)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: `1px solid ${service.glowBorder}`,
                    boxShadow: `0 0 40px ${service.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-20"
                    style={{ background: `radial-gradient(circle, rgba(${service.rgb}, 0.6), transparent 70%)`, filter: "blur(40px)" }}
                  />
                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: service.glow, border: `1px solid ${service.glowBorder}` }}
                      >
                        <service.icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${service.tagColor}`}>
                        {service.tag}
                      </span>
                    </div>
                    <p className={`text-xs font-semibold tracking-widest uppercase ${service.color} mb-1`}>{service.tagline}</p>
                    <h3 className="text-lg sm:text-xl font-black text-white mb-3 leading-snug">{service.title}</h3>
                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">{service.description}</p>

                    <ul className="space-y-3 mb-6">
                      {service.features.map((f) => (
                        <li key={f.label} className="flex items-start gap-3">
                          <span
                            className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5"
                            style={{ background: `rgba(${service.rgb}, 0.1)`, border: `1px solid rgba(${service.rgb}, 0.2)` }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(${service.rgb}, 1)` }} />
                          </span>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-white">{f.label}</span>
                            <span className="text-neutral-500 text-xs"> — {f.detail}</span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/service/${service.slug}`}
                      className={`group inline-flex items-center gap-2 text-sm font-semibold ${service.color} transition-all duration-300`}
                    >
                      Learn More
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
