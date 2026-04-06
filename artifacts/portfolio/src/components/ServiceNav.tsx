import { useState, useEffect, useRef } from "react";
import { Eye, GitBranch, Package, HelpCircle, DollarSign, Menu, X, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

const navLinks = [
  { label: "Overview", href: "#overview", icon: Eye },
  { label: "Process", href: "#process", icon: GitBranch },
  { label: "Deliverables", href: "#deliverables", icon: Package },
  { label: "Pricing", href: "#pricing", icon: DollarSign },
  { label: "FAQ", href: "#faq", icon: HelpCircle },
];

export default function ServiceNav() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((l) => l.href.slice(1));
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleMagnetic = (e: React.MouseEvent, idx: number) => {
    const btn = linkRefs.current[idx];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMagneticLeave = (idx: number) => {
    const btn = linkRefs.current[idx];
    if (btn) btn.style.transform = "translate(0, 0)";
  };

  return (
    <>
      <nav className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 nav-capsule rounded-full px-2 py-2 items-center gap-1">
        {navLinks.map((link, idx) => {
          const isActive = activeSection === link.href.slice(1);
          return (
            <button
              key={link.label}
              ref={(el) => { linkRefs.current[idx] = el; }}
              onMouseMove={(e) => handleMagnetic(e, idx)}
              onMouseLeave={() => handleMagneticLeave(idx)}
              onClick={() => handleNavClick(link.href)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-emerald-400 bg-emerald-500/15"
                  : "text-neutral-400 hover:text-emerald-300 hover:bg-white/5"
              }`}
              style={{ transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.2s ease, background 0.2s ease" }}
            >
              <link.icon className="w-4 h-4" />
              <span className="hidden lg:inline">{link.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => {
            setLocation("/");
            setTimeout(() => {
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 500);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-200 hire-pulse"
        >
          <Sparkles className="w-4 h-4" />
          <span>Hire Me</span>
        </button>
      </nav>

      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            className="nav-capsule rounded-full px-5 py-3 flex items-center gap-2.5"
          >
            <Menu className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-neutral-300">Navigate</span>
          </button>
        )}

        {mobileOpen && (
          <div className="nav-capsule rounded-3xl p-3 w-64">
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <span className="text-sm font-semibold text-emerald-400 font-[var(--app-font-display)]">Sections</span>
              <button onClick={() => setMobileOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "text-emerald-400 bg-emerald-500/12"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setMobileOpen(false);
                setLocation("/");
                setTimeout(() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 500);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-black mt-1 hire-pulse"
            >
              <Sparkles className="w-4 h-4" />
              Hire Me
            </button>
          </div>
        )}
      </div>
    </>
  );
}
