import { useState } from "react";
import { Send, Github, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const socials = [
    {
      icon: MessageCircle,
      label: "Telegram",
      value: "@nibir_nissan",
      href: "https://t.me/nibir_nissan",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
    {
      icon: Phone,
      label: "WhatsApp",
      value: "Message Me",
      href: "https://wa.me/1234567890",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@nibir-nissan",
      href: "https://github.com",
      color: "text-neutral-300",
      bg: "bg-neutral-500/10",
      border: "border-neutral-500/20",
    },
    {
      icon: Mail,
      label: "Email",
      value: "nibir@example.com",
      href: "mailto:nibir@example.com",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  const inputClass =
    "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-800/80 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:bg-neutral-800 transition-all text-sm";

  return (
    <section id="contact" className="py-20 md:py-28 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 accent-text text-sm font-semibold tracking-widest uppercase mb-4">
            <span className="icon-duotone"><Mail className="w-4 h-4" /></span>
            Contact
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Let's <span className="text-gradient">Work Together</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            Have a project in mind? Let's bring it to life. I typically respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border ${s.border} ${s.bg} hover:scale-105 transition-all duration-200 card-hover`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-medium">{s.label}</div>
                  <div className={`text-xs sm:text-sm font-semibold ${s.color}`}>{s.value}</div>
                </div>
              </a>
            ))}

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-white/5 bg-neutral-900/50 sm:col-span-2 lg:col-span-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-500 font-medium">Location</div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-300">Bangladesh</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: `rgba(var(--theme-accent-rgb), 0.2)`,
                    border: `1px solid rgba(var(--theme-accent-rgb), 0.3)`,
                  }}
                >
                  <Send className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: "var(--theme-accent-light)" }} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-neutral-400 text-sm sm:text-base">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 px-6 py-2.5 rounded-lg text-sm font-medium border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-400 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={inputClass}
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = `rgba(var(--theme-accent-rgb), 0.5)`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-400 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputClass}
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = `rgba(var(--theme-accent-rgb), 0.5)`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-400 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project collaboration, n8n automation..."
                    className={inputClass}
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = `rgba(var(--theme-accent-rgb), 0.5)`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-400 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className={`${inputClass} resize-none`}
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = `rgba(var(--theme-accent-rgb), 0.5)`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-black transition-all duration-200 glow-emerald hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  style={{ backgroundColor: "var(--theme-accent)" }}
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
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
