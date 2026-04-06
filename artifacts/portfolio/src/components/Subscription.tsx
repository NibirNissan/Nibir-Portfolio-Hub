import { RefreshCw, Users, Package, Headphones, Gem } from "lucide-react";

const offerCards = [
  {
    icon: RefreshCw,
    title: "Automated Subscription Management",
    description:
      "Seamless digital product delivery with fully automated renewal tracking. Customers receive instant access, zero manual intervention — the system runs itself.",
    features: ["Instant Delivery", "Auto Renewal Tracking", "User Dashboard", "Revocation System"],
    color: "text-emerald-400",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/25",
  },
  {
    icon: Users,
    title: "B2B & Bulk Solutions",
    description:
      "Specialized pricing structures for teams, agencies, and businesses looking for premium digital tools at scale. Custom packages designed around your workflow.",
    features: ["Bulk Seat Pricing", "Agency Whitelabel", "Dedicated Manager", "SLA Support"],
    color: "text-violet-400",
    bg: "bg-violet-500/8",
    border: "border-violet-500/25",
  },
];

const highlights = [
  {
    icon: Gem,
    title: "Premium Asset Sourcing",
    description: "High-end design assets, software licenses, and digital tools — curated and delivered to your workflow.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Headphones,
    title: "24/7 Priority Support",
    description: "Customer-centric model with round-the-clock support. Every subscriber gets treated like a priority account.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Package,
    title: "2,000+ Active Customers",
    description: "A proven, battle-tested ecosystem that has delivered digital products to thousands of satisfied customers.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
];

export default function Subscription() {
  return (
    <section id="subscription" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none opacity-8"
        style={{ background: `radial-gradient(ellipse, var(--theme-accent), transparent 70%)` }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><Package className="w-4 h-4" /></span>
            The Subspot
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Digital Product &amp;{" "}
            <span className="text-gradient">Subscription Ecosystem</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            Scaled to <span className="text-emerald-300 font-semibold">2,000+ customers</span> — a fully automated platform
            delivering premium digital tools, software, and assets with zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {offerCards.map((card) => (
            <div
              key={card.title}
              className={`reveal-card relative p-7 rounded-2xl border ${card.border} card-hover overflow-hidden`}
              style={{
                background: "rgba(var(--theme-surface-rgb), 0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className={`w-11 h-11 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center mb-5`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-5">{card.description}</p>
              <ul className="grid grid-cols-2 gap-2">
                {card.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-neutral-300">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${card.color.replace("text-", "bg-")}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h) => (
            <div
              key={h.title}
              className={`reveal-card relative p-5 rounded-2xl border ${h.border} card-hover overflow-hidden`}
              style={{
                background: "rgba(var(--theme-surface-rgb), 0.5)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div className={`w-10 h-10 rounded-xl ${h.bg} border ${h.border} flex items-center justify-center mb-4`}>
                <h.icon className={`w-5 h-5 ${h.color}`} />
              </div>
              <h4 className={`text-sm font-bold ${h.color} mb-2`}>{h.title}</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
