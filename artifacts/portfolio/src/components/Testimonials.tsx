import { useState, useEffect, useRef } from "react";
import { Quote, Star, ChevronLeft, ChevronRight, User2 } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { FirestoreTestimonial } from "@/lib/firestoreTypes";

export default function Testimonials() {
  const [items, setItems] = useState<FirestoreTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) { setLoading(false); return; }

    (async () => {
      try {
        const q = query(collection(db!, "testimonials"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTestimonial)));
      } catch {
        try {
          const snap = await getDocs(collection(db!, "testimonials"));
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTestimonial)));
        } catch { /* empty */ }
      }
      setLoading(false);
    })();
  }, []);

  // Don't render the section at all if no testimonials and not loading
  if (!loading && items.length === 0) return null;

  const scrollToIdx = (idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    setActiveIdx(clamped);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[clamped] as HTMLElement | undefined;
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const children = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    children.forEach((c, i) => {
      const cardCenter = c.offsetLeft + c.clientWidth / 2 - track.offsetLeft;
      const d = Math.abs(cardCenter - center);
      if (d < minDist) { minDist = d; closest = i; }
    });
    setActiveIdx(closest);
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><Quote className="w-4 h-4" /></span>
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Client <span className="text-gradient">Love</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            What people I've worked with have to say.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-neutral-700 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 -mx-4 px-4 testimonial-track"
              style={{ scrollbarWidth: "none" }}
            >
              {items.map((t) => (
                <article
                  key={t.id}
                  className="snap-center shrink-0 w-[88vw] sm:w-[440px] md:w-[480px] rounded-3xl p-6 sm:p-8 relative overflow-hidden group"
                  style={{
                    border: `1px solid rgba(var(--theme-accent-rgb), 0.18)`,
                    background: `linear-gradient(135deg, rgba(var(--theme-surface-rgb), 0.85), rgba(var(--theme-surface-rgb), 0.45))`,
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <div
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
                    style={{ background: "var(--theme-accent)" }}
                  />

                  <Quote
                    className="w-10 h-10 opacity-20 mb-4"
                    style={{ color: "var(--theme-accent-light)" }}
                  />

                  <p className="text-neutral-200 text-base sm:text-lg leading-relaxed mb-6 min-h-[120px]">
                    "{t.review}"
                  </p>

                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                    {t.imageUrl ? (
                      <img
                        src={t.imageUrl}
                        alt={t.clientName}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                        style={{ border: `2px solid rgba(var(--theme-accent-rgb), 0.3)` }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                        style={{
                          background: `rgba(var(--theme-accent-rgb), 0.15)`,
                          border: `2px solid rgba(var(--theme-accent-rgb), 0.3)`,
                          color: "var(--theme-accent-light)",
                        }}
                      >
                        {t.clientName?.charAt(0) ?? <User2 className="w-5 h-5" />}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-sm">{t.clientName}</div>
                      <div className="text-xs text-neutral-500">{t.designation}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {items.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => scrollToIdx(activeIdx - 1)}
                  disabled={activeIdx === 0}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1.5">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToIdx(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeIdx ? "w-8" : "w-1.5 opacity-40 hover:opacity-70"
                      }`}
                      style={{ background: "var(--theme-accent)" }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => scrollToIdx(activeIdx + 1)}
                  disabled={activeIdx === items.length - 1}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`.testimonial-track::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
