import { useState, useEffect, useRef } from "react";
import { User, Briefcase, Code2, Layers, Mail, Menu, X } from "lucide-react";
import { useLocation } from "wouter";

const navLinks = [
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Code2 },
  { label: "Projects", href: "#projects", icon: Briefcase },
  { label: "Services", href: "#services", icon: Layers },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function Nav() {
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
      <button
        onClick={() => { setLocation("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        className="fixed top-5 left-5 sm:top-6 sm:left-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all group"
        style={{
          backgroundColor: `rgba(var(--theme-accent-rgb), 0.1)`,
          border: `1px solid rgba(var(--theme-accent-rgb), 0.3)`,
        }}
      >
        <span className="text-sm sm:text-base font-black tracking-tighter font-[var(--app-font-display)]" style={{ color: "var(--theme-accent-light)" }}>NN</span>
      </button>

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
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.2s ease, background 0.2s ease",
                color: isActive ? "var(--theme-accent-light)" : "#a3a3a3",
                backgroundColor: isActive ? `rgba(var(--theme-accent-rgb), 0.15)` : "transparent",
              }}
            >
              <link.icon className="w-4 h-4" />
              <span className="hidden lg:inline">{link.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => handleNavClick("#contact")}
          className="ml-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all glow-emerald"
          style={{ backgroundColor: "var(--theme-accent)", color: "var(--theme-accent-fg, #000)" }}
        >
          Hire Me
        </button>
      </nav>

      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        {!mobileOpen && (
          <button
            onClick={() => setMobileOpen(true)}
            className="nav-capsule rounded-full px-5 py-3 flex items-center gap-2.5"
          >
            <Menu className="w-5 h-5" style={{ color: "var(--theme-accent-light)" }} />
            <span className="text-sm font-medium text-neutral-300">Menu</span>
          </button>
        )}

        {mobileOpen && (
          <div className="nav-capsule rounded-3xl p-3 w-64">
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <span className="text-sm font-semibold font-[var(--app-font-display)]" style={{ color: "var(--theme-accent-light)" }}>NN</span>
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: isActive ? "var(--theme-accent-light)" : "#a3a3a3",
                    backgroundColor: isActive ? `rgba(var(--theme-accent-rgb), 0.12)` : "transparent",
                  }}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick("#contact")}
              className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-center"
              style={{ backgroundColor: "var(--theme-accent)", color: "var(--theme-accent-fg, #000)" }}
            >
              Hire Me
            </button>
          </div>
        )}
      </div>
    </>
  );
}
