import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bot, Code2, Video, ShoppingBag, Zap, TrendingUp,
  Globe, LayoutDashboard, Rocket, ArrowRight, ImageIcon,
} from "lucide-react";
import { Link } from "wouter";
import NebulaBg from "./NebulaBg";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { FirestoreService } from "@/lib/firestoreTypes";

/* ── color maps ─────────────────────────────────────────────── */
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

/* ── static service data ────────────────────────────────────── */
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
    color: "text-cyan-400", rgb: "34, 211, 238", tag: "WordPress",
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
    color: "text-violet-400", rgb: "139, 92, 246", tag: "Most Requested",
  },
];

/* bento column spans: alternates wide-narrow-narrow-wide-narrow-wide */
const bentoSpans = [
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-2",
];

/* ── Shared tilt + spotlight hook ───────────────────────────── */
interface TiltState { rotX: number; rotY: number; spX: number; spY: number; }
const IDLE: TiltState = { rotX: 0, rotY: 0, spX: 50, spY: 50 };

function useTiltSpotlight() {
  const [state, setState] = useState<TiltState>(IDLE);
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef<number>(0);
  const rectRef = useRef<DOMRect | null>(null);

  const onEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setHovered(true);
    rectRef.current = e.currentTarget.getBoundingClientRect();
  }, []);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = rectRef.current;
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setState({
        rotX: (0.5 - y) * 10,
        rotY: (x - 0.5) * 10,
        spX: x * 100,
        spY: y * 100,
      });
    });
  }, []);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setHovered(false);
    setState(IDLE);
    rectRef.current = null;
  }, []);

  return { state, hovered, onEnter, onMove, onLeave };
}

/* ── Neon badge ─────────────────────────────────────────────── */
function NeonBadge({ label, rgb }: { label: string; rgb: string }) {
  return (
    <span
      style={{
        padding: "3px 11px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: `rgba(${rgb},1)`,
        background: `rgba(${rgb},0.08)`,
        border: `1px solid rgba(${rgb},0.4)`,
        boxShadow: `0 0 8px rgba(${rgb},0.35), 0 0 20px rgba(${rgb},0.15)`,
        textShadow: `0 0 8px rgba(${rgb},0.7)`,
        whiteSpace: "nowrap" as const,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

/* ── Animated arrow ─────────────────────────────────────────── */
function AnimatedArrow({ rgb }: { rgb: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest group/arr"
      style={{ color: `rgba(${rgb},0.8)` }}
    >
      Learn More
      <span className="relative inline-block w-4 h-4 overflow-hidden">
        <ArrowRight
          className="absolute w-4 h-4 transition-all duration-300 ease-out"
          style={{ top: 0, left: 0 }}
        />
        <ArrowRight
          className="absolute w-4 h-4 transition-all duration-300 ease-out"
          style={{ top: 0, left: "-100%", opacity: 0 }}
        />
      </span>
      <style>{`
        .group\\/arr:hover span > svg:first-child { transform: translateX(120%); opacity: 0; }
        .group\\/arr:hover span > svg:last-child  { transform: translateX(100%); opacity: 1; }
      `}</style>
    </span>
  );
}

/* ── Bento card (static services) ───────────────────────────── */
function BentoServiceCard({
  service, idx,
}: {
  service: typeof services[number]; idx: number;
}) {
  const { state, hovered, onEnter, onMove, onLeave } = useTiltSpotlight();
  const rgb = colorToRgb[service.color] || "99,102,241";
  const Icon = service.icon;
  const isFeatured = bentoSpans[idx] === "lg:col-span-2";

  return (
    <div
      className={`${bentoSpans[idx]} relative`}
      style={{
        perspective: "1000px",
        willChange: "transform",
      }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Gradient border wrapper */}
      <div
        className="h-full"
        style={{
          padding: "1px",
          borderRadius: "20px",
          background: hovered
            ? `linear-gradient(135deg, rgba(${rgb},0.7) 0%, rgba(${rgb},0.15) 40%, rgba(${rgb},0.5) 100%)`
            : `linear-gradient(135deg, rgba(${rgb},0.2) 0%, rgba(255,255,255,0.04) 50%, rgba(${rgb},0.12) 100%)`,
          transition: "background 0.4s ease, box-shadow 0.4s ease",
          boxShadow: hovered
            ? `0 0 40px rgba(${rgb},0.2), 0 20px 60px rgba(0,0,0,0.5)`
            : `0 4px 24px rgba(0,0,0,0.4)`,
          transform: `perspective(1000px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`,
          transition2: "transform 0.15s ease-out, background 0.4s ease, box-shadow 0.4s ease",
        } as React.CSSProperties}
      >
        <div
          className="relative h-full flex flex-col p-6 sm:p-7 overflow-hidden"
          style={{
            borderRadius: "19px",
            background: "rgba(8,8,14,0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Spotlight that follows cursor */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "19px",
              background: hovered
                ? `radial-gradient(circle 250px at ${state.spX}% ${state.spY}%, rgba(${rgb},0.13), transparent 70%)`
                : "transparent",
              transition: "background 0.08s linear",
            }}
          />

          {/* Ghost index number */}
          <div
            className="absolute bottom-3 right-4 select-none pointer-events-none font-black leading-none"
            aria-hidden="true"
            style={{
              fontSize: isFeatured ? "7rem" : "5.5rem",
              color: `rgba(${rgb},1)`,
              opacity: hovered ? 0.07 : 0.035,
              fontFamily: "var(--app-font-display, system-ui)",
              transition: "opacity 0.4s ease",
            }}
          >
            {String(idx + 1).padStart(2, "0")}
          </div>

          {/* Header: icon + badge */}
          <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
            {/* Floating icon */}
            <div
              style={{
                width: 48, height: 48,
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                background: `rgba(${rgb},0.1)`,
                border: `1px solid rgba(${rgb},0.28)`,
                boxShadow: hovered ? `0 0 24px rgba(${rgb},0.3), inset 0 0 12px rgba(${rgb},0.08)` : "none",
                animation: hovered ? "svc-float 2.8s ease-in-out infinite" : "none",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: `rgba(${rgb},1)` }} />
            </div>
            <NeonBadge label={service.tag} rgb={rgb} />
          </div>

          {/* Title */}
          <h3
            className="relative z-10 font-black leading-snug mb-3"
            style={{
              fontSize: isFeatured ? "1.1rem" : "1rem",
              color: "#ffffff",
            }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p
            className="relative z-10 text-xs leading-relaxed mb-5 flex-1"
            style={{ color: "rgba(163,163,163,0.85)" }}
          >
            {service.description}
          </p>

          {/* Feature bullets */}
          <ul className="relative z-10 space-y-2 mb-5">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-xs" style={{ color: "rgba(212,212,212,0.8)" }}>
                <span
                  style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `rgba(${rgb},0.1)`,
                    border: `1px solid rgba(${rgb},0.22)`,
                  }}
                >
                  <span
                    style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: `rgba(${rgb},1)`,
                      boxShadow: `0 0 4px rgba(${rgb},0.7)`,
                    }}
                  />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div style={{ height: 1, background: `rgba(${rgb},0.12)`, marginBottom: 16 }} />

          {/* Learn More */}
          <div className="relative z-10">
            <Link href={`/service/${service.slug}`}>
              <AnimatedArrow rgb={rgb} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Premium glass card (glassServices) ─────────────────────── */
function PremiumServiceCard({ service }: { service: typeof glassServices[number] }) {
  const { state, hovered, onEnter, onMove, onLeave } = useTiltSpotlight();
  const { rgb } = service;
  const Icon = service.icon;

  return (
    <div
      style={{ perspective: "1000px", willChange: "transform" }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        style={{
          padding: "1px",
          borderRadius: "22px",
          background: hovered
            ? `linear-gradient(135deg, rgba(${rgb},0.7) 0%, rgba(${rgb},0.12) 40%, rgba(${rgb},0.5) 100%)`
            : `linear-gradient(135deg, rgba(${rgb},0.25) 0%, rgba(255,255,255,0.04) 50%, rgba(${rgb},0.15) 100%)`,
          boxShadow: hovered
            ? `0 0 50px rgba(${rgb},0.22), 0 24px 70px rgba(0,0,0,0.55)`
            : `0 4px 28px rgba(0,0,0,0.45)`,
          transform: `perspective(1000px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`,
          transition: "transform 0.15s ease-out, background 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <div
          className="relative overflow-hidden p-6 sm:p-8"
          style={{
            borderRadius: "21px",
            background: "rgba(8,8,14,0.9)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
          }}
        >
          {/* Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "21px",
              background: hovered
                ? `radial-gradient(circle 280px at ${state.spX}% ${state.spY}%, rgba(${rgb},0.14), transparent 70%)`
                : "transparent",
              transition: "background 0.08s linear",
            }}
          />

          {/* Corner ambient glow */}
          <div
            className="absolute -top-12 -right-12 w-56 h-56 pointer-events-none rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${rgb},${hovered ? 0.18 : 0.07}), transparent 65%)`,
              filter: "blur(32px)",
              transition: "all 0.5s ease",
            }}
          />

          {/* Ghost index */}
          <div
            className="absolute bottom-4 right-6 select-none pointer-events-none font-black leading-none"
            aria-hidden="true"
            style={{
              fontSize: "7rem",
              color: `rgba(${rgb},1)`,
              opacity: hovered ? 0.07 : 0.035,
              fontFamily: "var(--app-font-display, system-ui)",
              transition: "opacity 0.4s ease",
            }}
          >
            {service.slug === "wordpress-development" ? "07" : "08"}
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
            <div
              style={{
                width: 52, height: 52, borderRadius: 15,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                background: `rgba(${rgb},0.1)`,
                border: `1px solid rgba(${rgb},0.28)`,
                boxShadow: hovered ? `0 0 28px rgba(${rgb},0.32), inset 0 0 14px rgba(${rgb},0.08)` : "none",
                animation: hovered ? "svc-float 2.8s ease-in-out infinite" : "none",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <Icon className="w-6 h-6" style={{ color: `rgba(${rgb},1)` }} />
            </div>
            <NeonBadge label={service.tag} rgb={rgb} />
          </div>

          {/* Tagline */}
          <div
            className="relative z-10 text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: `rgba(${rgb},0.8)` }}
          >
            {service.tagline}
          </div>

          {/* Title */}
          <h3 className="relative z-10 text-lg sm:text-xl font-black text-white mb-3 leading-snug">
            {service.title}
          </h3>

          {/* Description */}
          <p className="relative z-10 text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "rgba(163,163,163,0.85)" }}>
            {service.description}
          </p>

          {/* Feature list */}
          <ul className="relative z-10 space-y-3 mb-6">
            {service.features.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `rgba(${rgb},0.1)`,
                    border: `1px solid rgba(${rgb},0.22)`,
                  }}
                >
                  <span
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: `rgba(${rgb},1)`,
                      boxShadow: `0 0 5px rgba(${rgb},0.8)`,
                    }}
                  />
                </span>
                <div>
                  <div className="text-xs font-semibold text-white">{f.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(115,115,115,0.9)" }}>{f.detail}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* Divider + CTA */}
          <div style={{ height: 1, background: `rgba(${rgb},0.12)`, marginBottom: 16 }} />
          <div className="relative z-10">
            <Link href={`/service/${service.slug}`}>
              <AnimatedArrow rgb={rgb} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dynamic service card (Firestore) ───────────────────────── */
function DynamicServiceCard({ service, idx }: { service: FirestoreService; idx: number }) {
  const { state, hovered, onEnter, onMove, onLeave } = useTiltSpotlight();
  const rgb = colorKeyToRgb[service.color || "indigo"] || "99, 102, 241";
  const isFeatured = bentoSpans[idx % bentoSpans.length] === "lg:col-span-2";
  /* Resolve icon URL from either field name */
  const iconSrc = (service.iconUrl || service.icon || "").trim();
  /* Normalise features — guard against missing field */
  const features: string[] = Array.isArray(service.features) ? service.features : [];

  return (
    <div
      className={`${bentoSpans[idx % bentoSpans.length]} relative`}
      style={{ perspective: "1000px", willChange: "transform" }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        style={{
          padding: "1px",
          borderRadius: "20px",
          height: "100%",
          background: hovered
            ? `linear-gradient(135deg, rgba(${rgb},0.7) 0%, rgba(${rgb},0.12) 40%, rgba(${rgb},0.5) 100%)`
            : `linear-gradient(135deg, rgba(${rgb},0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(${rgb},0.1) 100%)`,
          boxShadow: hovered
            ? `0 0 40px rgba(${rgb},0.2), 0 20px 60px rgba(0,0,0,0.5)`
            : `0 4px 24px rgba(0,0,0,0.4)`,
          transform: `perspective(1000px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`,
          transition: "transform 0.15s ease-out, background 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <div
          className="relative h-full flex flex-col p-6 sm:p-7 overflow-hidden"
          style={{
            borderRadius: "19px",
            background: "rgba(8,8,14,0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "19px",
              background: hovered
                ? `radial-gradient(circle 240px at ${state.spX}% ${state.spY}%, rgba(${rgb},0.13), transparent 70%)`
                : "transparent",
              transition: "background 0.08s linear",
            }}
          />

          {/* Ghost index */}
          <div
            className="absolute bottom-3 right-4 select-none pointer-events-none font-black leading-none"
            aria-hidden="true"
            style={{
              fontSize: isFeatured ? "7rem" : "5.5rem",
              color: `rgba(${rgb},1)`,
              opacity: hovered ? 0.07 : 0.035,
              fontFamily: "var(--app-font-display, system-ui)",
              transition: "opacity 0.4s ease",
            }}
          >
            {String(idx + 1).padStart(2, "0")}
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
            <div
              style={{
                width: isFeatured ? 52 : 46,
                height: isFeatured ? 52 : 46,
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                background: `rgba(${rgb},0.1)`,
                border: `1px solid rgba(${rgb},0.28)`,
                boxShadow: hovered ? `0 0 24px rgba(${rgb},0.3), inset 0 0 12px rgba(${rgb},0.08)` : "none",
                animation: hovered ? "svc-float 2.8s ease-in-out infinite" : "none",
                transition: "box-shadow 0.3s ease",
                overflow: "hidden",
              }}
            >
              {iconSrc
                ? <img
                    src={iconSrc}
                    alt={service.title}
                    className="rounded-md object-contain"
                    style={{ width: isFeatured ? 28 : 24, height: isFeatured ? 28 : 24 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                : <ImageIcon
                    style={{ width: isFeatured ? 22 : 20, height: isFeatured ? 22 : 20, color: `rgba(${rgb},1)` }}
                  />
              }
            </div>
            {(service.badge || service.price) && (
              <NeonBadge label={service.badge || service.price || ""} rgb={rgb} />
            )}
          </div>

          {/* Title */}
          <h3
            className="relative z-10 font-black text-white mb-3 leading-snug"
            style={{ fontSize: isFeatured ? "1.15rem" : "1rem" }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p className="relative z-10 text-xs leading-relaxed mb-5" style={{ color: "rgba(163,163,163,0.85)" }}>
            {service.description}
          </p>

          {/* Feature bullet points */}
          {features.length > 0 && (
            <ul className="relative z-10 mt-4 space-y-2 mb-5 flex-1">
              {features.slice(0, 4).map((feat, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <span
                    className="shrink-0"
                    style={{
                      width: 18, height: 18, borderRadius: 5,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `rgba(${rgb},0.1)`,
                      border: `1px solid rgba(${rgb},0.22)`,
                    }}
                  >
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: `rgba(${rgb},1)`,
                        boxShadow: `0 0 8px rgba(${rgb},0.8)`,
                      }}
                    />
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          )}
          {features.length === 0 && <div className="flex-1" />}

          {/* Divider + CTA */}
          <div style={{ height: 1, background: `rgba(${rgb},0.12)`, marginBottom: 14 }} />
          <div className="relative z-10">
            <Link href={`/service/${service.id}`}>
              <AnimatedArrow rgb={rgb} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────── */
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
    <section id="services" className="py-20 md:py-28 relative overflow-x-clip">
      {/* global keyframe for floating icon */}
      <style>{`
        @keyframes svc-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
      `}</style>

      <NebulaBg variant="emerald-amber" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="text-[9rem] sm:text-[13rem] md:text-[17rem] font-black tracking-tight text-white whitespace-nowrap"
          style={{ opacity: 0.018, transform: "rotate(-6deg)" }}
        >
          SOLUTIONS
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Header */}
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
          /* ── Firestore dynamic layout — bento grid matching static layout ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {dynamicServices.map((service, idx) => (
              <DynamicServiceCard key={service.id} service={service} idx={idx} />
            ))}
          </div>
        ) : (
          <>
            {/* ── Bento grid of static services ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">
              {services.map((service, idx) => (
                <BentoServiceCard key={service.slug} service={service} idx={idx} />
              ))}
            </div>

            {/* ── Premium glass cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {glassServices.map((service) => (
                <PremiumServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
