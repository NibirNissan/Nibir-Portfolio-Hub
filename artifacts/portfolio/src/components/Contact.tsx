import { useState, useRef } from "react";
import {
  Send, Github, MessageCircle, Mail, MapPin,
  Phone, ArrowRight, Linkedin, Sparkles,
} from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

/* ── animation helpers ─────────────────────────────────────── */
const FADE_UP = {
  animation: "contact-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) both",
} as React.CSSProperties;

const delay = (ms: number): React.CSSProperties => ({
  animationDelay: `${ms}ms`,
});

/* ── service options ───────────────────────────────────────── */
const SERVICES = [
  "Web Development",
  "Full-Stack Application",
  "Automation (n8n / API)",
  "UI / UX Design",
  "Database Architecture",
  "DevOps & Deployment",
  "Consultation",
  "Other",
];

/* ── direct contact cards ──────────────────────────────────── */
const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@nibirnissan.com",
    href: "mailto:contact@nibirnissan.com",
    glowRgb: "251, 191, 36",      // amber
    border: "rgba(251,191,36,0.22)",
    bg: "rgba(251,191,36,0.06)",
    iconColor: "#fbbf24",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "Message Me",
    href: "https://wa.me/8801976816697",
    glowRgb: "34, 197, 94",       // emerald
    border: "rgba(34,197,94,0.22)",
    bg: "rgba(34,197,94,0.06)",
    iconColor: "#22c55e",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Connect with me",
    href: "https://linkedin.com/in/nibirnissan",
    glowRgb: "56, 189, 248",      // sky
    border: "rgba(56,189,248,0.22)",
    bg: "rgba(56,189,248,0.06)",
    iconColor: "#38bdf8",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@NibirNissan",
    href: "https://github.com/NibirNissan",
    glowRgb: "163, 163, 163",     // neutral
    border: "rgba(163,163,163,0.18)",
    bg: "rgba(163,163,163,0.05)",
    iconColor: "#a3a3a3",
  },
];

/* ── reusable glow-focus input handler ─────────────────────── */
function glowHandlers(el: HTMLElement | null, on: boolean) {
  if (!el) return;
  el.style.borderColor = on
    ? "rgba(var(--theme-accent-rgb), 0.6)"
    : "rgba(255,255,255,0.08)";
  el.style.boxShadow = on
    ? "0 0 0 3px rgba(var(--theme-accent-rgb), 0.12), 0 0 20px rgba(var(--theme-accent-rgb), 0.06)"
    : "none";
}

/* ─────────────────────────────────────────────────────────── */

export default function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !db) {
      setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
      return;
    }

    try {
      await addDoc(collection(db, "inquiries"), {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        read: false,
        createdAt: Date.now(),
      });
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send. Please try again or contact me directly."
      );
    }
  };

  /* shared input base class */
  const inputBase =
    "w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-neutral-600 " +
    "focus:outline-none transition-all duration-200 resize-none";
  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative z-10 overflow-hidden">
      {/* keyframes */}
      <style>{`
        @keyframes contact-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes contact-card-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(var(--glow), 0.08); }
          50%       { box-shadow: 0 0 40px rgba(var(--glow), 0.18); }
        }
      `}</style>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: "var(--theme-accent)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px]"
          style={{ background: "var(--theme-accent)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        {/* ── Section header ── */}
        <div className="text-center mb-16 md:mb-20" style={{ ...FADE_UP, ...delay(0) }}>
          <div className="inline-flex items-center gap-2 accent-text text-xs font-bold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><Sparkles className="w-3.5 h-3.5" /></span>
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Let's build something{" "}
            <span className="text-gradient">amazing together.</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have an idea or project in mind? Reach out — I respond within 24 hours.
          </p>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ══ LEFT COLUMN — heading + contact cards ══ */}
          <div className="space-y-6" style={{ ...FADE_UP, ...delay(80) }}>

            {/* Contact channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHANNELS.map((ch, i) => (
                <ChannelCard key={ch.label} ch={ch} delay={120 + i * 60} />
              ))}
            </div>

            {/* Location chip */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border w-fit"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
                ...FADE_UP, ...delay(380),
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <MapPin className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Based In</div>
                <div className="text-sm font-semibold text-neutral-300">Bangladesh · Available Worldwide</div>
              </div>
            </div>

            {/* Telegram */}
            <a
              href="https://t.me/nibir_nissan"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "rgba(56,189,248,0.04)",
                borderColor: "rgba(56,189,248,0.15)",
                ...FADE_UP, ...delay(440),
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(56,189,248,0.35)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 28px rgba(56,189,248,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(56,189,248,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}
                >
                  <MessageCircle className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Telegram</div>
                  <div className="text-sm font-semibold text-sky-400">@nibir_nissan</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-200" />
            </a>
          </div>

          {/* ══ RIGHT COLUMN — frosted glass form ══ */}
          <div style={{ ...FADE_UP, ...delay(160) }}>
            {submitted ? (
              <SuccessState onReset={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} />
            ) : (
              <div
                className="rounded-3xl p-6 sm:p-8 border"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <h3 className="text-lg font-black text-white mb-6">Send a Message</h3>

                {error && (
                  <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl text-sm text-red-400"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputBase}
                        style={inputStyle}
                        onFocus={(e) => glowHandlers(e.currentTarget, true)}
                        onBlur={(e) => glowHandlers(e.currentTarget, false)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputBase}
                        style={inputStyle}
                        onFocus={(e) => glowHandlers(e.currentTarget, true)}
                        onBlur={(e) => glowHandlers(e.currentTarget, false)}
                      />
                    </div>
                  </div>

                  {/* Service dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Service / Subject</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputBase}
                      style={{
                        ...inputStyle,
                        color: form.subject ? "#ffffff" : "#525252",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23525252' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 14px center",
                        paddingRight: "40px",
                      }}
                      onFocus={(e) => glowHandlers(e.currentTarget, true)}
                      onBlur={(e) => glowHandlers(e.currentTarget, false)}
                    >
                      <option value="" disabled hidden>Select a service...</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s} style={{ background: "#141618", color: "#fff" }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about your project, goals, timeline..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={inputBase}
                      style={inputStyle}
                      onFocus={(e) => glowHandlers(e.currentTarget, true)}
                      onBlur={(e) => glowHandlers(e.currentTarget, false)}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    ref={btnRef}
                    type="submit"
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "var(--theme-accent)",
                      color: "var(--theme-accent-fg, #000)",
                      boxShadow: "0 8px 28px rgba(var(--theme-accent-rgb), 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 12px 40px rgba(var(--theme-accent-rgb), 0.5), 0 0 0 1px rgba(var(--theme-accent-rgb), 0.3)";
                        (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 8px 28px rgba(var(--theme-accent-rgb), 0.3)";
                      (e.currentTarget as HTMLButtonElement).style.filter = "";
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Channel Card ───────────────────────────────────────────── */
function ChannelCard({
  ch,
  delay: d,
}: {
  ch: (typeof CHANNELS)[number];
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={ch.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all duration-300"
      style={{
        background: hovered ? ch.bg : "rgba(255,255,255,0.025)",
        borderColor: hovered ? ch.border : "rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px rgba(${ch.glowRgb}, 0.15), 0 0 0 1px ${ch.border}` : "none",
        ...FADE_UP, animationDelay: `${d}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          background: hovered ? `rgba(${ch.glowRgb}, 0.15)` : "rgba(255,255,255,0.05)",
          border: `1px solid ${hovered ? ch.border : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered ? `0 0 16px rgba(${ch.glowRgb}, 0.25)` : "none",
        }}
      >
        <ch.icon className="w-4 h-4 transition-colors duration-200" style={{ color: hovered ? ch.iconColor : "#525252" }} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">{ch.label}</div>
        <div
          className="text-xs font-semibold truncate transition-colors duration-200"
          style={{ color: hovered ? ch.iconColor : "#a3a3a3" }}
        >
          {ch.value}
        </div>
      </div>
      <ArrowRight
        className="w-3.5 h-3.5 ml-auto shrink-0 transition-all duration-200"
        style={{
          color: hovered ? ch.iconColor : "#404040",
          transform: hovered ? "translate(2px, -2px)" : "translate(0,0)",
          opacity: hovered ? 1 : 0.5,
        }}
      />
    </a>
  );
}

/* ── Success State ──────────────────────────────────────────── */
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="rounded-3xl p-8 sm:p-12 border flex flex-col items-center justify-center text-center"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(var(--theme-accent-rgb), 0.2)",
        boxShadow: "0 0 60px rgba(var(--theme-accent-rgb), 0.08)",
        ...FADE_UP,
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{
          background: "rgba(var(--theme-accent-rgb), 0.12)",
          border: "1px solid rgba(var(--theme-accent-rgb), 0.3)",
          boxShadow: "0 0 40px rgba(var(--theme-accent-rgb), 0.2)",
        }}
      >
        <Send className="w-7 h-7" style={{ color: "var(--theme-accent-light)" }} />
      </div>
      <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
      <p className="text-neutral-400 text-sm mb-8 max-w-xs leading-relaxed">
        Thanks for reaching out. I'll review your message and get back to you within 24 hours.
      </p>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:-translate-y-0.5"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          color: "#a3a3a3",
          background: "rgba(255,255,255,0.04)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#a3a3a3";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >
        Send Another <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
