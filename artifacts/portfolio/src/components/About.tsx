import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2, Figma, Video, Bot, Star,
  GraduationCap, Sparkles, Rocket,
} from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { FirestoreTimeline } from "@/lib/firestoreTypes";
import { TIMELINE_ICON_MAP } from "@/lib/timelineIcons";
import AboutMe from "@/components/AboutMe";

/* ─────────────────────────────────────────────────────────── */
/*  Timeline entry type (runtime, with resolved icon)          */
/* ─────────────────────────────────────────────────────────── */

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  rgb: string;
  tag: string;
  imageUrl?: string;
}

/* ─────────────────────────────────────────────────────────── */
/*  Hardcoded fallback data                                     */
/* ─────────────────────────────────────────────────────────── */

const DEFAULT_TIMELINE: TimelineEntry[] = [
  {
    year: "2019",
    title: "Started Coding",
    description:
      "Wrote my first HTML file at 15. Built a personal page that looked terrible — and was immediately obsessed with making it better. The loop began.",
    icon: Code2,
    rgb: "16,185,129",
    tag: "Origin",
  },
  {
    year: "2020",
    title: "Mastered Video Editing",
    description:
      "Spent two years inside Adobe Premiere Pro and After Effects. Developed a sharp intuition for storytelling, timing, and cinematic motion design.",
    icon: Video,
    rgb: "56,189,248",
    tag: "Creative",
  },
  {
    year: "2021",
    title: "Discovered UI/UX Design",
    description:
      "Fell into Figma and never looked back. Learned that great software isn't just used — it's felt. Started designing real products that people love.",
    icon: Figma,
    rgb: "139,92,246",
    tag: "Design",
  },
  {
    year: "2022",
    title: "Launched The Subspot",
    description:
      "Built and scaled a digital subscription platform from zero to 2,000+ active users. First real taste of full-stack entrepreneurship — product, ops, and growth at once.",
    icon: Rocket,
    rgb: "99,102,241",
    tag: "Launch",
  },
  {
    year: "2023",
    title: "Enrolled in CST Program",
    description:
      "Joined the Computer Science & Technology program. Bridged self-taught intuition with formal engineering — algorithms, data structures, and system design.",
    icon: GraduationCap,
    rgb: "245,158,11",
    tag: "Academia",
  },
  {
    year: "2024",
    title: "AI Automation Expert",
    description:
      "Became obsessed with intelligent workflow automation using n8n. Now building AI pipelines that save hundreds of hours for real businesses every single month.",
    icon: Bot,
    rgb: "249,115,22",
    tag: "AI",
  },
  {
    year: "2025 →",
    title: "Full-Stack & Beyond",
    description:
      "Operating as a full-stack developer, automation architect, and creative director. Delivering end-to-end digital products — from source code to brand identity.",
    icon: Sparkles,
    rgb: "20,184,166",
    tag: "Now",
  },
];

function firestoreToEntry(doc: FirestoreTimeline): TimelineEntry {
  return {
    year: doc.year,
    title: doc.title,
    description: doc.description,
    icon: TIMELINE_ICON_MAP[doc.icon] ?? Sparkles,
    rgb: doc.rgb,
    tag: doc.tag,
    imageUrl: doc.imageUrl,
  };
}

/* ─────────────────────────────────────────────────────────── */
/*  Stats row data (static)                                    */
/* ─────────────────────────────────────────────────────────── */

const stats = [
  { icon: Code2,       value: "4+",  label: "Years in Web Dev",   rgb: "16,185,129" },
  { icon: Figma,       value: "3+",  label: "Years in Figma",     rgb: "139,92,246" },
  { icon: Video,       value: "6",   label: "Years Editing",      rgb: "56,189,248" },
  { icon: Bot,         value: "n8n", label: "AI Expert",          rgb: "245,158,11" },
];

/* ─────────────────────────────────────────────────────────── */
/*  Sub-components                                             */
/* ─────────────────────────────────────────────────────────── */

function TimelineDot({ entry, inView }: { entry: TimelineEntry; inView: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.05 }}
      className="relative z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shrink-0"
      style={{
        background: `rgba(${entry.rgb},0.1)`,
        border: `1px solid rgba(${entry.rgb},0.35)`,
        boxShadow: `0 0 18px rgba(${entry.rgb},0.22), 0 0 6px rgba(${entry.rgb},0.1)`,
      }}
    >
      <entry.icon
        style={{ color: `rgba(${entry.rgb},0.9)`, width: "18px", height: "18px" }}
      />
      <motion.span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `1px solid rgba(${entry.rgb},0.5)` }}
        animate={{ scale: [1, 1.65], opacity: [0.6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      />
    </motion.div>
  );
}

function YearBadge({ entry, inView, delay = 0.2 }: { entry: TimelineEntry; inView: boolean; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className="text-[10px] font-black font-mono uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{
        background: `rgba(${entry.rgb},0.08)`,
        color: `rgba(${entry.rgb},0.8)`,
        border: `1px solid rgba(${entry.rgb},0.2)`,
      }}
    >
      {entry.year}
    </motion.span>
  );
}

function TimelineCard({
  entry,
  inView,
  direction,
  align,
}: {
  entry: TimelineEntry;
  inView: boolean;
  direction: "left" | "right";
  align: "start" | "end";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -36 : 36 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      className="relative rounded-2xl border p-5 sm:p-6 w-full max-w-sm cursor-default overflow-hidden"
      style={{
        background: `rgba(${entry.rgb},0.03)`,
        borderColor: hovered ? `rgba(${entry.rgb},0.4)` : `rgba(${entry.rgb},0.13)`,
        boxShadow: hovered
          ? `0 12px 40px rgba(${entry.rgb},0.1), 0 0 0 1px rgba(${entry.rgb},0.18)`
          : "none",
        textAlign: align === "end" ? "right" : "left",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner accent glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            align === "end"
              ? `radial-gradient(ellipse at top right, rgba(${entry.rgb},0.08), transparent 60%)`
              : `radial-gradient(ellipse at top left, rgba(${entry.rgb},0.08), transparent 60%)`,
        }}
      />

      {/* Tag */}
      <div
        className="text-[10px] font-black uppercase tracking-widest mb-2"
        style={{ color: `rgba(${entry.rgb},0.65)` }}
      >
        {entry.tag}
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-[17px] font-black text-white leading-snug mb-2">
        {entry.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-neutral-400 leading-relaxed">{entry.description}</p>

      {/* Hover accent bottom bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
        style={{ background: `linear-gradient(to right, transparent, rgba(${entry.rgb},0.5), transparent)` }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Milestone image frame                                      */
/* ─────────────────────────────────────────────────────────── */

function TimelineImage({
  entry,
  inView,
  direction,
}: {
  entry: TimelineEntry;
  inView: boolean;
  direction: "left" | "right";
}) {
  const [imgError, setImgError] = useState(false);
  if (imgError || !entry.imageUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -28 : 28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
      className="relative rounded-2xl overflow-hidden w-full max-w-sm"
      style={{
        aspectRatio: "4 / 3",
        border: `1px solid rgba(${entry.rgb},0.18)`,
        boxShadow: `0 8px 32px rgba(${entry.rgb},0.1), 0 2px 8px rgba(0,0,0,0.4)`,
      }}
    >
      <img
        src={entry.imageUrl}
        alt={entry.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setImgError(true)}
      />

      {/* Scan-line texture overlay — matches site grain aesthetic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
        }}
      />

      {/* Bottom dark-to-transparent gradient for legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
        }}
      />

      {/* Accent radial glow at the base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 115%, rgba(${entry.rgb},0.2), transparent 60%)` }}
      />

      {/* Floating tag pill */}
      <div
        className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none"
        style={{
          background: `rgba(0,0,0,0.45)`,
          border: `1px solid rgba(${entry.rgb},0.45)`,
          color: `rgba(${entry.rgb},1)`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {entry.tag}
      </div>

      {/* Inset accent border shimmer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px rgba(${entry.rgb},0.12)` }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Single timeline row                                        */
/* ─────────────────────────────────────────────────────────── */

function TimelineRow({ entry, index }: { entry: TimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative">
      {/* ── Mobile layout (< lg): dot left, card right ── */}
      <div className="flex gap-5 lg:hidden items-start">
        <div className="flex flex-col items-center gap-2 pt-1 shrink-0 w-10">
          <TimelineDot entry={entry} inView={inView} />
          <YearBadge entry={entry} inView={inView} delay={0.25} />
        </div>
        <div className="flex-1 pt-1 pb-2 space-y-3">
          <TimelineCard entry={entry} inView={inView} direction="right" align="start" />
          {entry.imageUrl && (
            <TimelineImage entry={entry} inView={inView} direction="right" />
          )}
        </div>
      </div>

      {/* ── Desktop layout (lg+): alternating 3-col grid ── */}
      <div className="hidden lg:grid items-center gap-6" style={{ gridTemplateColumns: "1fr 80px 1fr" }}>
        {/* Left column: card when isLeft, or image when !isLeft and image exists */}
        <div className="flex justify-end">
          {isLeft
            ? <TimelineCard entry={entry} inView={inView} direction="left" align="end" />
            : entry.imageUrl
              ? <TimelineImage entry={entry} inView={inView} direction="left" />
              : null
          }
        </div>

        {/* Center: dot + year */}
        <div className="flex flex-col items-center gap-2.5 py-4">
          <TimelineDot entry={entry} inView={inView} />
          <YearBadge entry={entry} inView={inView} delay={0.22} />
        </div>

        {/* Right column: card when !isLeft, or image when isLeft and image exists */}
        <div className="flex justify-start">
          {!isLeft
            ? <TimelineCard entry={entry} inView={inView} direction="right" align="start" />
            : entry.imageUrl
              ? <TimelineImage entry={entry} inView={inView} direction="right" />
              : null
          }
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main section                                               */
/* ─────────────────────────────────────────────────────────── */

export default function About() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>(DEFAULT_TIMELINE);

  const lineInView = useInView(timelineRef, { once: false, amount: 0.15 });

  /* Fetch timeline from Firestore — fall back to defaults if empty or error */
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    (async () => {
      try {
        const q = query(collection(db!, "timeline"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setTimeline(
            snap.docs.map((d) =>
              firestoreToEntry({ id: d.id, ...d.data() } as FirestoreTimeline)
            )
          );
        }
      } catch {
        try {
          const snap = await getDocs(collection(db!, "timeline"));
          if (!snap.empty) {
            setTimeline(
              snap.docs.map((d) =>
                firestoreToEntry({ id: d.id, ...d.data() } as FirestoreTimeline)
              )
            );
          }
        } catch { /* stay with defaults */ }
      }
    })();
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">

      {/* ── About Me card (image + bio) ── */}
      <AboutMe />

      {/* ── Section header ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-14 md:mb-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><Star className="w-4 h-4" /></span>
            About Me
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            The Journey Behind{" "}
            <span className="text-gradient">the Work</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            From writing a first HTML tag to shipping AI-powered systems at scale —
            every milestone shaped how I build today.
          </p>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div ref={timelineRef} className="max-w-5xl mx-auto px-4 sm:px-6 relative">

        {/* The drawing vertical line */}
        <div
          className="absolute top-0 bottom-0 w-px pointer-events-none"
          style={{ left: "calc(20px + 1rem)" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 80%, transparent)" }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 origin-top"
            initial={{ scaleY: 0 }}
            animate={lineInView ? { scaleY: 1 } : {}}
            transition={{ duration: 3.6, ease: "linear" }}
            style={{
              height: "100%",
              background: "linear-gradient(to bottom, var(--theme-accent), rgba(var(--theme-accent-rgb),0.3) 60%, transparent)",
              opacity: 0.6,
            }}
          />
        </div>

        {/* Desktop center line */}
        <div
          className="absolute top-0 bottom-0 w-px pointer-events-none hidden lg:block"
          style={{ left: "50%", transform: "translateX(-0.5px)" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 80%, transparent)" }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 origin-top"
            initial={{ scaleY: 0 }}
            animate={lineInView ? { scaleY: 1 } : {}}
            transition={{ duration: 3.6, ease: "linear" }}
            style={{
              height: "100%",
              background: "linear-gradient(to bottom, var(--theme-accent), rgba(var(--theme-accent-rgb),0.3) 60%, transparent)",
              opacity: 0.6,
            }}
          />
        </div>

        <div className="space-y-2 lg:space-y-0">
          {timeline.map((entry, i) => (
            <TimelineRow key={entry.year + i} entry={entry} index={i} />
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative p-5 rounded-2xl border text-center overflow-hidden cursor-default"
              style={{
                background: `rgba(${s.rgb},0.04)`,
                borderColor: `rgba(${s.rgb},0.14)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(${s.rgb},0.1), transparent 70%)` }}
              />
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{
                  background: `rgba(${s.rgb},0.1)`,
                  border: `1px solid rgba(${s.rgb},0.22)`,
                  boxShadow: `0 0 16px rgba(${s.rgb},0.12)`,
                }}
              >
                <s.icon style={{ width: "16px", height: "16px", color: `rgba(${s.rgb},0.9)` }} />
              </div>
              <div className="text-2xl font-black mb-0.5" style={{ color: `rgba(${s.rgb},1)` }}>
                {s.value}
              </div>
              <div className="text-xs text-neutral-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
