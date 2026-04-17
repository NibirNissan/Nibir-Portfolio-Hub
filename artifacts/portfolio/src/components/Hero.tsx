import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowDown, Github, Globe, Linkedin, Twitter, Instagram, Youtube, Facebook, MessageCircle, Phone, Mail, Rss, ExternalLink } from "lucide-react";
import heroImg from "@assets/162cf2f13523cdbb8190637d39e5c469_1775426775549.webp";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { getDoc, getDocs, doc, collection, orderBy, query } from "firebase/firestore";
import type { FirestoreProfile, FirestoreSocial } from "@/lib/firestoreTypes";

const LONG_PRESS_MS = 2500;

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github, Globe, Linkedin, Twitter, Instagram, Youtube, Facebook,
  MessageCircle, Phone, Mail, Rss, ExternalLink,
};

const defaultSocials: FirestoreSocial[] = [
  { name: "GitHub", icon: "Github", url: "https://github.com/NibirNissan", order: 0 },
  { name: "Telegram", icon: "MessageCircle", url: "https://t.me/nibir_nissan", order: 1 },
  { name: "WhatsApp", icon: "Phone", url: "https://wa.me/8801976816697", order: 2 },
];

const defaultProfile: FirestoreProfile = {
  heroTitle: "Nibir Nissan",
  heroSubtitle: "Entrepreneur & Developer",
  bio: "CST student turned full-stack developer & AI automation expert. Building digital products, automating workflows with n8n, and crafting premium visual experiences — from code to brand.",
  profileImageUrl: "",
  resumeLink: "",
  availability: "Available for freelance work",
};

const stagger = (delay: number): React.CSSProperties => ({
  opacity: 0,
  animation: `hero-stagger-in 0.7s ease-out ${delay}s forwards`,
});

export default function Hero() {
  const [profile, setProfile] = useState<FirestoreProfile>(defaultProfile);
  const [socials, setSocials] = useState<FirestoreSocial[]>(defaultSocials);
  const [, setLocation] = useLocation();
  const [pressing, setPressing] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a stable ref to the blocker so we can remove the exact same fn
  const contextBlocker = useRef<((e: Event) => void) | null>(null);

  const removeContextBlocker = () => {
    if (contextBlocker.current) {
      document.removeEventListener("contextmenu", contextBlocker.current);
      contextBlocker.current = null;
    }
  };

  const cancelLongPress = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      console.log("[hero-press] Timer cleared");
    }
    removeContextBlocker();
    setPressing(false);
  };

  const startLongPress = () => {
    // Guard: if a timer is already running (e.g. both touchstart + pointerdown
    // fired for the same gesture), don't restart — just keep the first timer.
    if (longPressTimer.current !== null) return;

    // Haptic pulse so the user feels the press register
    if (navigator.vibrate) navigator.vibrate(50);

    // Mount a document-level context-menu blocker for the duration of the
    // press — this catches the OS-level popup on Android before React sees it
    removeContextBlocker();
    const blocker = (e: Event) => e.preventDefault();
    contextBlocker.current = blocker;
    document.addEventListener("contextmenu", blocker, { capture: true });

    console.log("[hero-press] Timer started");
    setPressing(true);

    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      removeContextBlocker();
      setPressing(false);
      // Double-buzz pattern confirms the secret trigger
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      console.log("[hero-press] Long-press complete → /admin");
      setLocation("/admin");
    }, LONG_PRESS_MS);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current !== null) clearTimeout(longPressTimer.current);
      removeContextBlocker();
    };
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    (async () => {
      try {
        const snap = await getDoc(doc(db!, "settings", "profile"));
        if (snap.exists()) {
          setProfile({ ...defaultProfile, ...(snap.data() as FirestoreProfile) });
        }
      } catch { /* use defaults */ }

      try {
        const q = query(collection(db!, "socials"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSocial));
        if (items.length > 0) setSocials(items);
      } catch {
        try {
          const snap = await getDocs(collection(db!, "socials"));
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSocial));
          if (items.length > 0) setSocials(items);
        } catch { /* use defaults */ }
      }
    })();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const imgSrc = profile.profileImageUrl?.trim() ? profile.profileImageUrl : heroImg;

  const bioLines = (profile.bio ?? defaultProfile.bio ?? "").split(
    /full-stack developer|AI automation expert/
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-12 pb-24">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="hero-blob absolute top-1/3 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-15"
          style={{ background: `radial-gradient(circle, var(--theme-accent), var(--theme-accent))` }}
        />
        <div
          className="hero-blob-2 absolute bottom-1/3 right-1/4 w-56 h-56 md:w-80 md:h-80 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, var(--theme-secondary), var(--theme-secondary))` }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left w-full">
            <div
              style={{
                ...stagger(0.1),
                borderColor: `rgba(var(--theme-accent-rgb), 0.3)`,
                backgroundColor: `rgba(var(--theme-accent-rgb), 0.08)`,
                color: "var(--theme-accent-light)",
                border: `1px solid rgba(var(--theme-accent-rgb), 0.3)`,
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse-slow"
                style={{ backgroundColor: "var(--theme-accent-light)" }}
              />
              {profile.availability || defaultProfile.availability}
            </div>

            <h1 style={stagger(0.25)} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-none">
              {(() => {
                const parts = (profile.heroTitle || defaultProfile.heroTitle || "Nibir Nissan").split(" ");
                const first = parts[0];
                const rest = parts.slice(1).join(" ");
                return (
                  <>
                    <span className="text-white">{first}</span>{" "}
                    <span className="text-gradient">{rest}</span>
                  </>
                );
              })()}
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-300 mt-3 block">
                {(() => {
                  const sub = profile.heroSubtitle || defaultProfile.heroSubtitle || "Entrepreneur & Developer";
                  const ampIdx = sub.lastIndexOf("&");
                  if (ampIdx === -1) return sub;
                  const before = sub.slice(0, ampIdx + 1);
                  const after = sub.slice(ampIdx + 1);
                  return (
                    <>
                      {before}{" "}
                      <span className="text-gradient-amber">{after.trim()}</span>
                    </>
                  );
                })()}
              </span>
            </h1>

            <p style={stagger(0.4)} className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {profile.bio || defaultProfile.bio}
            </p>

            <div style={stagger(0.55)} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <button
                onClick={() => scrollToSection("projects")}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-200 glow-emerald hover:scale-105 text-sm sm:text-base"
                style={{ backgroundColor: "var(--theme-accent)", color: "var(--theme-accent-fg, #000)" }}
              >
                View My Work
              </button>
              {profile.resumeLink ? (
                <a
                  href={profile.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-white transition-all duration-200 text-sm sm:text-base"
                  style={{ border: "1px solid rgba(var(--theme-accent-rgb), 0.2)", color: "var(--theme-heading)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(var(--theme-accent-rgb), 0.5)`; e.currentTarget.style.backgroundColor = "rgba(var(--theme-accent-rgb), 0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(var(--theme-accent-rgb), 0.2)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  Resume
                </a>
              ) : (
                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-white transition-all duration-200 text-sm sm:text-base"
                  style={{ border: "1px solid rgba(var(--theme-accent-rgb), 0.2)", color: "var(--theme-heading)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(var(--theme-accent-rgb), 0.5)`; e.currentTarget.style.backgroundColor = "rgba(var(--theme-accent-rgb), 0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(var(--theme-accent-rgb), 0.2)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  Let's Talk
                </button>
              )}
            </div>

            <div style={stagger(0.7)} className="flex items-center justify-center lg:justify-start gap-3">
              {socials.map((social) => {
                const Icon = socialIconMap[social.icon] ?? Globe;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div style={stagger(0.55)} className="flex-shrink-0 w-full max-w-[260px] sm:max-w-[300px] lg:max-w-none lg:w-auto mx-auto lg:mx-0">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl opacity-30 blur-2xl"
                style={{ background: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent))` }}
              />
              <div
                className={`relative w-full lg:w-72 xl:w-80 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl${pressing ? " hero-press-charging" : ""}`}
                // ── Pointer events (mouse + stylus + modern touch) ──────────
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  startLongPress();
                }}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
                // ── Touch events (belt-and-suspenders for older iOS/Android) ─
                onTouchStart={(e) => { e.preventDefault(); startLongPress(); }}
                onTouchEnd={(e) => { e.preventDefault(); cancelLongPress(); }}
                onTouchCancel={cancelLongPress}
                onTouchMove={cancelLongPress}
                // ── Context menu: preventDefault in React AND document-level ─
                onContextMenu={(e) => { e.preventDefault(); cancelLongPress(); }}
                style={{
                  border: `1px solid rgba(var(--theme-accent-rgb), 0.25)`,
                  boxShadow: `0 25px 50px -12px rgba(var(--theme-accent-rgb), 0.15)`,
                  touchAction: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                  cursor: "default",
                } as React.CSSProperties}
              >
                <img
                  src={imgSrc}
                  alt={profile.heroTitle || "Nibir Nissan"}
                  className="w-full h-full object-cover object-top"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    pointerEvents: "none",       // let the wrapper own all events
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    WebkitTouchCallout: "none",
                    WebkitUserDrag: "none",
                  } as React.CSSProperties}
                />
                {/* Decorative gradient — must NOT block pointer events */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  style={{ pointerEvents: "none" }}
                />
              </div>

              <div
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center shadow-lg"
                style={{
                  border: `1px solid rgba(var(--theme-secondary-rgb), 0.3)`,
                  backgroundColor: `rgba(var(--theme-secondary-rgb), 0.1)`,
                }}
              >
                <span className="text-xl sm:text-2xl font-black" style={{ color: "var(--theme-secondary-light)" }}>2k+</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-medium text-center leading-tight">Active Users</span>
              </div>
              <div
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center shadow-lg"
                style={{
                  border: `1px solid rgba(var(--theme-accent-rgb), 0.3)`,
                  backgroundColor: `rgba(var(--theme-accent-rgb), 0.1)`,
                }}
              >
                <span className="text-base sm:text-xl font-black" style={{ color: "var(--theme-accent-light)" }}>n8n</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-medium">Expert</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => scrollToSection("about")}
          className="text-neutral-500 transition-colors animate-bounce"
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--theme-accent-light)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = ""; }}
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
