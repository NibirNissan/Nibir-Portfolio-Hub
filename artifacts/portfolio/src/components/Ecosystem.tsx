import { useState } from "react";
import { Globe, Rocket, LayoutDashboard, ArrowRight } from "lucide-react";

interface NodeData {
  id: string;
  icon: typeof Globe;
  title: string;
  points: string[];
  hoverSubtitle: string;
  color: string;
  glowRgb: string;
  borderRgb: string;
}

const secondaryNodes: NodeData[] = [
  {
    id: "wordpress",
    icon: Globe,
    title: "WordPress Development",
    points: ["Custom Theme Development", "E-commerce (WooCommerce)", "SEO Optimized"],
    hoverSubtitle: "Leveraging 4+ years in Web Dev to build high-conversion sites",
    color: "text-cyan-400",
    glowRgb: "34, 211, 238",
    borderRgb: "34, 211, 238",
  },
  {
    id: "saas",
    icon: LayoutDashboard,
    title: "SaaS / Web App",
    points: ["Multi-user Dashboards", "Subscription Logic", "API Integration"],
    hoverSubtitle: "Battle-tested architecture powering 2,000+ active subscribers",
    color: "text-violet-400",
    glowRgb: "139, 92, 246",
    borderRgb: "139, 92, 246",
  },
];

const visionNode: NodeData = {
  id: "vision",
  icon: Rocket,
  title: "Agency Roadmap",
  points: ["Full-service Digital Agency", "AI Automation + Marketing", "High-end Development"],
  hoverSubtitle: "From subscription provider to a full-scale digital solution powerhouse",
  color: "text-amber-400",
  glowRgb: "251, 191, 36",
  borderRgb: "251, 191, 36",
};

function FlowNode({ node, isVision = false }: { node: NodeData; isVision?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-2xl p-5 sm:p-6 cursor-pointer overflow-hidden transition-all duration-400"
        style={{
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid rgba(${node.borderRgb}, ${hovered ? 0.6 : 0.25})`,
          boxShadow: hovered
            ? `0 0 30px rgba(${node.glowRgb}, 0.25), 0 0 60px rgba(${node.glowRgb}, 0.1)`
            : `0 0 15px rgba(${node.glowRgb}, 0.08)`,
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none transition-opacity duration-400"
          style={{
            background: `radial-gradient(circle, rgba(${node.glowRgb}, 0.15), transparent 70%)`,
            filter: "blur(20px)",
            opacity: hovered ? 1 : 0.3,
          }}
        />

        {isVision && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
              Next Step
            </span>
          </div>
        )}

        <div className="relative">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{
              background: `rgba(${node.glowRgb}, 0.12)`,
              border: `1px solid rgba(${node.borderRgb}, 0.3)`,
            }}
          >
            <node.icon className={`w-5 h-5 ${node.color}`} />
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white mb-3">{node.title}</h4>

          <ul className="space-y-1.5 mb-3">
            {node.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs text-slate-300">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: `rgba(${node.glowRgb}, 0.8)` }}
                />
                {p}
              </li>
            ))}
          </ul>

          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: hovered ? "60px" : "0",
              opacity: hovered ? 1 : 0,
            }}
          >
            <p className="text-[11px] italic text-slate-400 border-t border-slate-700/50 pt-2">
              {node.hoverSubtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Ecosystem() {
  const [hubHovered, setHubHovered] = useState(false);

  return (
    <section id="ecosystem" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #6366f1, transparent 60%)" }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <LayoutDashboard className="w-4 h-4" />
            Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Digital Product{" "}
            <span className="text-gradient">Ecosystem</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            A connected network of services, products, and vision — all flowing from one central hub.
          </p>
        </div>

        {/* ── FLOWCHART ── */}
        <div className="flex flex-col items-center gap-0">

          {/* ── CENTRAL HUB ── */}
          <div
            className="relative w-full max-w-md cursor-pointer"
            onMouseEnter={() => setHubHovered(true)}
            onMouseLeave={() => setHubHovered(false)}
          >
            <div
              className="hub-pulse-border absolute -inset-[2px] rounded-2xl pointer-events-none"
              style={{ opacity: hubHovered ? 0.9 : 0.6 }}
            />
            <div
              className="relative rounded-2xl p-6 sm:p-8 text-center transition-all duration-400"
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid transparent",
                transform: hubHovered ? "scale(1.03)" : "scale(1)",
                boxShadow: hubHovered
                  ? "0 0 50px rgba(99, 102, 241, 0.3), 0 0 100px rgba(139, 92, 246, 0.15)"
                  : "0 0 30px rgba(99, 102, 241, 0.12), 0 0 60px rgba(139, 92, 246, 0.06)",
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-1">
                Nibir's Digital Product Hub
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Central platform powering all services & products
              </p>
              <div
                className="overflow-hidden transition-all duration-300 mx-auto max-w-xs"
                style={{
                  maxHeight: hubHovered ? "40px" : "0",
                  opacity: hubHovered ? 1 : 0,
                }}
              >
                <p className="text-[11px] italic text-indigo-300 mt-2">
                  The core SaaS product that connects every service offering
                </p>
              </div>
            </div>
          </div>

          {/* ── FLOW LINE DOWN ── */}
          <div className="flex flex-col items-center">
            <div className="w-px h-10 sm:h-14 flow-line-solid" />
            <div className="flow-arrow-down" />
          </div>

          {/* ── SECONDARY NODES ROW ── */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
            {/* Horizontal connector — hidden on mobile */}
            <div className="hidden sm:block absolute top-0 left-1/4 right-1/4 h-px flow-line-solid" style={{ top: "-1px" }} />
            <div className="hidden sm:block absolute top-0 left-1/4 w-px h-3 flow-line-solid" style={{ top: "-1px" }} />
            <div className="hidden sm:block absolute top-0 right-1/4 w-px h-3 flow-line-solid" style={{ top: "-1px" }} />

            {secondaryNodes.map((node) => (
              <FlowNode key={node.id} node={node} />
            ))}
          </div>

          {/* ── FLOW LINE TO VISION (dotted) ── */}
          <div className="flex flex-col items-center">
            <div className="w-px h-10 sm:h-14 flow-line-dotted" />
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400/60 rotate-90" />
            </div>
          </div>

          {/* ── FUTURE VISION NODE ── */}
          <div className="w-full max-w-md">
            <FlowNode node={visionNode} isVision />
          </div>
        </div>
      </div>
    </section>
  );
}
