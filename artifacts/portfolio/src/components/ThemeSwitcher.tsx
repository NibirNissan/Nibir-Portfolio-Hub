import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";

type ThemeKey = "emerald-stealth" | "cyber-amber" | "midnight-royal" | "mono-chrome";

interface ThemeConfig {
  label: string;
  bg: string;
  accent: string;
  accentLight: string;
  accentLighter: string;
  accentRgb: string;
  secondary: string;
  secondaryLight: string;
  secondaryRgb: string;
  text: string;
  grain: string;
  preview: string;
}

const themes: Record<ThemeKey, ThemeConfig> = {
  "emerald-stealth": {
    label: "Emerald Stealth",
    bg: "#0a0a0a",
    accent: "#10b981",
    accentLight: "#34d399",
    accentLighter: "#6ee7b7",
    accentRgb: "16, 185, 129",
    secondary: "#f59e0b",
    secondaryLight: "#fbbf24",
    secondaryRgb: "245, 158, 11",
    text: "#e5e7eb",
    grain: "0.035",
    preview: "#10b981",
  },
  "cyber-amber": {
    label: "Cyber Amber",
    bg: "#0c0a09",
    accent: "#f59e0b",
    accentLight: "#fbbf24",
    accentLighter: "#fde68a",
    accentRgb: "245, 158, 11",
    secondary: "#10b981",
    secondaryLight: "#34d399",
    secondaryRgb: "16, 185, 129",
    text: "#e5e7eb",
    grain: "0.035",
    preview: "#f59e0b",
  },
  "midnight-royal": {
    label: "Midnight Royal",
    bg: "#020617",
    accent: "#8b5cf6",
    accentLight: "#a78bfa",
    accentLighter: "#c4b5fd",
    accentRgb: "139, 92, 246",
    secondary: "#ec4899",
    secondaryLight: "#f472b6",
    secondaryRgb: "236, 72, 153",
    text: "#e5e7eb",
    grain: "0.03",
    preview: "#8b5cf6",
  },
  "mono-chrome": {
    label: "Mono Chrome",
    bg: "#000000",
    accent: "#ffffff",
    accentLight: "#e5e7eb",
    accentLighter: "#d1d5db",
    accentRgb: "255, 255, 255",
    secondary: "#a3a3a3",
    secondaryLight: "#d4d4d4",
    secondaryRgb: "163, 163, 163",
    text: "#ffffff",
    grain: "0.06",
    preview: "#ffffff",
  },
};

const THEME_KEYS = Object.keys(themes) as ThemeKey[];
const STORAGE_KEY = "portfolio-theme";

function applyTheme(key: ThemeKey) {
  const t = themes[key];
  const s = document.documentElement.style;
  s.setProperty("--theme-bg", t.bg);
  s.setProperty("--theme-accent", t.accent);
  s.setProperty("--theme-accent-light", t.accentLight);
  s.setProperty("--theme-accent-lighter", t.accentLighter);
  s.setProperty("--theme-accent-rgb", t.accentRgb);
  s.setProperty("--theme-secondary", t.secondary);
  s.setProperty("--theme-secondary-light", t.secondaryLight);
  s.setProperty("--theme-secondary-rgb", t.secondaryRgb);
  s.setProperty("--theme-text", t.text);
  s.setProperty("--theme-grain", t.grain);
  document.documentElement.setAttribute("data-theme", key);
  localStorage.setItem(STORAGE_KEY, key);
}

function getSavedTheme(): ThemeKey {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved in themes) return saved as ThemeKey;
  return "emerald-stealth";
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ThemeKey>(getSavedTheme);
  const [wipe, setWipe] = useState<{ active: boolean; x: number; y: number; bg: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme(current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const switchTheme = useCallback((key: ThemeKey, e: React.MouseEvent) => {
    if (key === current) {
      setOpen(false);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const t = themes[key];

    setWipe({ active: true, x, y, bg: t.bg });
    setOpen(false);

    requestAnimationFrame(() => {
      setTimeout(() => {
        applyTheme(key);
        setCurrent(key);
      }, 350);

      setTimeout(() => {
        setWipe(null);
      }, 750);
    });
  }, [current]);

  return (
    <>
      <div ref={menuRef} className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[60]">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: `rgba(var(--theme-accent-rgb), 0.1)`,
            border: `1px solid rgba(var(--theme-accent-rgb), 0.3)`,
            boxShadow: `0 0 20px rgba(var(--theme-accent-rgb), 0.15)`,
          }}
          aria-label="Switch theme"
        >
          <Sparkles className="w-5 h-5" style={{ color: "var(--theme-accent-light)" }} />
        </button>

        {open && (
          <div
            className="absolute top-14 right-0 w-56 rounded-2xl p-3 space-y-1"
            style={{
              background: "rgba(10, 10, 10, 0.85)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: `1px solid rgba(var(--theme-accent-rgb), 0.15)`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(var(--theme-accent-rgb), 0.08)`,
              animation: "theme-menu-in 0.25s ease-out",
            }}
          >
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Theme
            </div>
            {THEME_KEYS.map((key) => {
              const t = themes[key];
              const isActive = key === current;
              return (
                <button
                  key={key}
                  onClick={(e) => switchTheme(key, e)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left"
                  style={{
                    background: isActive ? `rgba(var(--theme-accent-rgb), 0.1)` : "transparent",
                    color: isActive ? "var(--theme-accent-light)" : "#a3a3a3",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      background: t.preview,
                      boxShadow: isActive
                        ? `0 0 0 2px rgba(10,10,10,0.9), 0 0 0 4px ${t.preview}, 0 0 8px ${t.preview}`
                        : "none",
                      border: `1px solid rgba(255,255,255,0.15)`,
                    }}
                  />
                  <span>{t.label}</span>
                  {isActive && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider opacity-50">Active</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {wipe && (
        <div
          className="theme-wipe-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9995,
            pointerEvents: "none",
            background: wipe.bg,
            clipPath: `circle(0% at ${wipe.x}px ${wipe.y}px)`,
            animation: `theme-wipe 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            ["--wipe-x" as string]: `${wipe.x}px`,
            ["--wipe-y" as string]: `${wipe.y}px`,
          }}
        />
      )}
    </>
  );
}
