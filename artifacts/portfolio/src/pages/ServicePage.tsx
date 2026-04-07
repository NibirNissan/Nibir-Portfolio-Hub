import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { getServiceBySlug } from "@/data/services";
import NebulaBg from "@/components/NebulaBg";
import ScanLine from "@/components/ScanLine";
import ScrollReveal from "@/components/ScrollReveal";
import BackButton from "@/components/BackButton";
import ServiceNav from "@/components/ServiceNav";
import { Sparkles, ChevronDown, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

const colorMap: Record<string, { tw: string; twBg: string; twBorder: string }> = {
  emerald: { tw: "text-emerald-400", twBg: "bg-emerald-500/10", twBorder: "border-emerald-500/20" },
  indigo: { tw: "text-indigo-400", twBg: "bg-indigo-500/10", twBorder: "border-indigo-500/20" },
  sky: { tw: "text-sky-400", twBg: "bg-sky-500/10", twBorder: "border-sky-500/20" },
  rose: { tw: "text-rose-400", twBg: "bg-rose-500/10", twBorder: "border-rose-500/20" },
  violet: { tw: "text-violet-400", twBg: "bg-violet-500/10", twBorder: "border-violet-500/20" },
  amber: { tw: "text-amber-400", twBg: "bg-amber-500/10", twBorder: "border-amber-500/20" },
  cyan: { tw: "text-cyan-400", twBg: "bg-cyan-500/10", twBorder: "border-cyan-500/20" },
};

function FAQAccordion({ question, answer, rgb }: { question: string; answer: string; rgb: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl border transition-all duration-300 overflow-hidden"
      style={{
        borderColor: open ? `rgba(${rgb}, 0.3)` : "rgba(255,255,255,0.06)",
        background: open ? `rgba(${rgb}, 0.03)` : "rgba(255,255,255,0.02)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm sm:text-base font-semibold text-white pr-4">{question}</span>
        <ChevronDown
          className="w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="transition-all duration-300 overflow-hidden"
        style={{ maxHeight: open ? "300px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="px-5 pb-5 text-sm text-neutral-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const service = getServiceBySlug(params.slug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Service Not Found</h1>
          <p className="text-neutral-400 mb-8">This service page doesn't exist.</p>
          <button onClick={() => setLocation("/")} className="px-6 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const c = colorMap[service.color] || colorMap.emerald;

  return (
    <div className="min-h-screen overflow-x-hidden grain-bg relative" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <BackButton />
      <ServiceNav />

      <a
        href={service.ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-5 bottom-20 md:bottom-24 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 hire-pulse"
        style={{ backgroundColor: "var(--theme-accent)", color: "var(--theme-accent-fg, #000)", boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.3)` }}
      >
        <MessageCircle className="w-4 h-4" />
        Get Started
      </a>

      <section id="overview" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <NebulaBg variant="green" />
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `rgba(${service.rgb}, 0.12)`, border: `1px solid rgba(${service.rgb}, 0.25)` }}
              >
                <service.icon className={`w-7 h-7 ${c.tw}`} />
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
              {service.headline}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-10">
              {service.roiLine}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={service.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full text-black font-bold text-base transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                style={{ backgroundColor: "var(--theme-accent)", boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.25)` }}
              >
                <MessageCircle className="w-5 h-5" />
                Get Started Today
              </a>
              <button
                onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-full border border-neutral-700 text-neutral-300 font-medium text-base hover:border-neutral-500 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
              >
                See My Process
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ScanLine />

      <section id="process" className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="icon-duotone"><Sparkles className="w-4 h-4" /></span>
                Process
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                How It <span className="text-gradient">Works</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            <div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: `linear-gradient(to bottom, transparent, rgba(${service.rgb}, 0.3), transparent)` }}
            />

            {service.process.map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 120} direction={idx % 2 === 0 ? "left" : "right"}>
                <div className={`relative flex items-start gap-6 mb-12 last:mb-0 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block md:w-1/2" />
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
                      style={{
                        background: `rgba(${service.rgb}, 0.15)`,
                        border: `2px solid rgba(${service.rgb}, 0.4)`,
                        color: `rgba(${service.rgb}, 1)`,
                        boxShadow: `0 0 20px rgba(${service.rgb}, 0.15)`,
                      }}
                    >
                      {idx + 1}
                    </div>
                  </div>
                  <div className="md:w-1/2 pb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ScanLine />

      <section id="deliverables" className="py-20 md:py-28 relative overflow-hidden">
        <NebulaBg variant="emerald-amber" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="icon-duotone"><Sparkles className="w-4 h-4" /></span>
                Deliverables
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                What You <span className="text-gradient">Get</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.deliverables.map((d, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div
                  className="p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] card-hover h-full"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black mb-4"
                    style={{
                      background: `rgba(${service.rgb}, 0.1)`,
                      color: `rgba(${service.rgb}, 1)`,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{d.title}</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">{d.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ScanLine />

      {service.caseStudySlug && (
        <>
          <section className="py-20 md:py-28 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
              <ScrollReveal>
                <div
                  className="p-8 sm:p-10 rounded-2xl border relative overflow-hidden"
                  style={{
                    background: "rgba(var(--theme-surface-rgb), 0.7)",
                    backdropFilter: "blur(24px)",
                    borderColor: `rgba(${service.rgb}, 0.2)`,
                    boxShadow: `0 0 60px rgba(${service.rgb}, 0.06)`,
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, rgba(${service.rgb}, 0.08), transparent 70%)`, filter: "blur(40px)" }}
                  />
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                      <span className="icon-duotone"><Sparkles className="w-4 h-4" /></span>
                      Case Study
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                      {service.caseStudyTitle}
                    </h2>
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                      {service.caseStudyResult}
                    </p>
                    <Link
                      href={`/project/${service.caseStudySlug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
                      style={{
                        background: `rgba(${service.rgb}, 0.15)`,
                        border: `1px solid rgba(${service.rgb}, 0.3)`,
                        color: `rgba(${service.rgb}, 1)`,
                      }}
                    >
                      View Full Case Study
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
          <ScanLine />
        </>
      )}

      <section id="pricing" className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="icon-duotone"><Sparkles className="w-4 h-4" /></span>
                Packages
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Investment <span className="text-gradient">Tiers</span>
              </h2>
              <p className="text-neutral-400 text-base max-w-xl mx-auto">
                Every project is unique. Reach out for a custom quote tailored to your needs.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {service.pricing.map((tier, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div
                  className={`relative p-6 sm:p-8 rounded-2xl border transition-all duration-300 h-full flex flex-col ${tier.highlight ? "scale-[1.02] md:scale-105" : ""}`}
                  style={{
                    background: tier.highlight ? `rgba(${service.rgb}, 0.04)` : "rgba(255,255,255,0.02)",
                    borderColor: tier.highlight ? `rgba(${service.rgb}, 0.3)` : "rgba(255,255,255,0.06)",
                    boxShadow: tier.highlight ? `0 0 40px rgba(${service.rgb}, 0.08)` : "none",
                  }}
                >
                  {tier.highlight && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: `rgba(${service.rgb}, 0.2)`,
                        border: `1px solid rgba(${service.rgb}, 0.4)`,
                        color: `rgba(${service.rgb}, 1)`,
                      }}
                    >
                      Recommended
                    </div>
                  )}
                  <h3 className="text-xl font-black text-white mb-1">{tier.name}</h3>
                  <p className="text-neutral-500 text-xs mb-4">{tier.description}</p>
                  <div className="mb-6">
                    <span
                      className="text-2xl font-black"
                      style={{ color: `rgba(${service.rgb}, 1)` }}
                    >
                      {tier.price}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: `rgba(${service.rgb}, 0.7)` }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={service.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
                    style={{
                      background: tier.highlight ? `rgba(${service.rgb}, 1)` : `rgba(${service.rgb}, 0.12)`,
                      color: tier.highlight ? "var(--theme-accent-fg, #000)" : `rgba(${service.rgb}, 1)`,
                      border: `1px solid rgba(${service.rgb}, ${tier.highlight ? 1 : 0.3})`,
                    }}
                  >
                    Get Started
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ScanLine />

      <section id="faq" className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
                <span className="icon-duotone"><Sparkles className="w-4 h-4" /></span>
                FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                Common <span className="text-gradient">Questions</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {service.faq.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <FAQAccordion question={item.question} answer={item.answer} rgb={service.rgb} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center mt-12">
              <p className="text-neutral-400 text-sm mb-5">Still have questions? Let's talk.</p>
              <a
                href={service.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-black font-bold text-base transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "var(--theme-accent)", boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.25)` }}
              >
                <MessageCircle className="w-5 h-5" />
                Message Me Directly
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="py-8 border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-neutral-500 text-xs">
            &copy; {new Date().getFullYear()} Nibir Nissan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
