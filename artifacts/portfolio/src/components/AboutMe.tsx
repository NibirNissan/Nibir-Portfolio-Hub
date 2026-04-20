import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, UserCircle2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { FirestoreProfile } from "@/lib/firestoreTypes";

/* ─── Fallback content ─────────────────────────────────────── */

const FALLBACK = {
  aboutTitle: "Who is Nibir Nissan?",
  aboutBio:
    "CST student turned full-stack developer & AI automation expert. I build digital products, automate complex workflows with n8n, and craft premium visual experiences — from raw code to polished brand identity.\n\nEntrepreneurship runs through everything I do. From launching The Subspot (a subscription platform with 2,000+ users) to designing systems that scale, I operate at the intersection of creativity, engineering, and strategy.",
  aboutImage: "",
};

/* ─── Tilt + spotlight hook (matches Services cards) ───────── */

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
        rotX: (0.5 - y) * 6,
        rotY: (x - 0.5) * 6,
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

/* ─── Image card (clean, no inner tilt — outer card handles it) ── */

function ImageCard({ src }: { src: string }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(139,92,246,0.22), rgba(16,185,129,0.1) 55%, transparent 80%)",
          filter: "blur(24px)",
          transform: "scale(1.15)",
        }}
      />

      {/* Gradient-border wrapper */}
      <div
        className="relative rounded-2xl p-px w-full max-w-[300px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.7) 0%, rgba(99,102,241,0.5) 40%, rgba(16,185,129,0.55) 100%)",
          boxShadow:
            "0 0 40px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.08)",
        }}
      >
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
          {src ? (
            <img
              src={src}
              alt="Nibir Nissan"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-3"
              style={{
                background:
                  "linear-gradient(145deg, rgba(139,92,246,0.12) 0%, rgba(16,185,129,0.08) 60%, rgba(99,102,241,0.1) 100%)",
              }}
            >
              <UserCircle2
                className="w-20 h-20 opacity-15"
                style={{ color: "var(--theme-accent)" }}
              />
              <span className="text-xs text-neutral-600 font-medium tracking-wide">
                No image set
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────── */

export default function AboutMe() {
  const [data, setData] = useState(FALLBACK);
  const { state, hovered, onEnter, onMove, onLeave } = useTiltSpotlight();

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db!, "settings", "profile"));
        if (snap.exists()) {
          const d = snap.data() as FirestoreProfile;
          setData({
            aboutTitle: d.aboutTitle?.trim() || FALLBACK.aboutTitle,
            aboutBio: d.aboutBio?.trim() || FALLBACK.aboutBio,
            aboutImage: d.aboutImage?.trim() || FALLBACK.aboutImage,
          });
        }
      } catch {
        /* stay with fallback */
      }
    })();
  }, []);

  const paragraphs = data.aboutBio
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Theme accent (purple by default) — used for the Services-style glow
  const rgb = "139, 92, 246";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 md:mb-24">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: "1200px", willChange: "transform" }}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* Gradient border + tilt wrapper (matches Services pattern) */}
        <div
          style={{
            padding: "1px",
            borderRadius: "24px",
            background: hovered
              ? `linear-gradient(135deg, rgba(${rgb},0.7) 0%, rgba(${rgb},0.15) 40%, rgba(${rgb},0.5) 100%)`
              : `linear-gradient(135deg, rgba(${rgb},0.25) 0%, rgba(255,255,255,0.04) 50%, rgba(${rgb},0.15) 100%)`,
            boxShadow: hovered
              ? `0 0 50px rgba(${rgb},0.22), 0 24px 70px rgba(0,0,0,0.55)`
              : `0 4px 28px rgba(0,0,0,0.45)`,
            transform: `perspective(1200px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg) scale(${hovered ? 1.012 : 1})`,
            transition: "transform 0.18s ease-out, background 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease",
            filter: hovered ? "blur(0px)" : "blur(0.6px)",
          }}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(10,10,10,0.9) 40%, rgba(16,185,129,0.05) 100%)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Spotlight that follows the cursor (Services pattern) */}
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={{
                borderRadius: "inherit",
                background: hovered
                  ? `radial-gradient(circle 360px at ${state.spX}% ${state.spY}%, rgba(${rgb},0.13), transparent 70%)`
                  : "transparent",
                transition: "background 0.08s linear",
              }}
            />

            {/* Corner ambient blobs */}
            <div
              className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.1), transparent 65%)",
              }}
            />
            <div
              className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.08), transparent 65%)",
              }}
            />

            <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-[340px_1fr] items-center gap-0">

              {/* ── Left: image ── */}
              <div
                className="group flex items-center justify-center p-8 lg:p-10 lg:border-r"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="w-full"
                >
                  <ImageCard src={data.aboutImage} />
                </motion.div>
              </div>

              {/* ── Right: text ── */}
              <div className="flex flex-col justify-center p-8 lg:p-12 space-y-5">

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                  className="inline-flex items-center gap-2 accent-text text-xs font-semibold tracking-widest uppercase self-start"
                >
                  <span className="icon-duotone">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  About Me
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="text-3xl sm:text-4xl font-black text-white leading-tight"
                >
                  {data.aboutTitle}
                </motion.h3>

                {/* Bio paragraphs */}
                <div className="space-y-4">
                  {paragraphs.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
                      transition={{
                        duration: 0.55,
                        ease: "easeOut",
                        delay: 0.28 + i * 0.1,
                      }}
                      className="text-neutral-400 text-base leading-relaxed"
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>

                {/* Accent rule */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0, margin: "0px 0px 200px 0px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                  className="h-px w-16 origin-left"
                  style={{
                    background:
                      "linear-gradient(to right, var(--theme-accent), transparent)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
