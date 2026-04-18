import { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Plus, Pencil, Trash2, X, Loader2, Briefcase, ImageIcon, ChevronDown, ChevronUp,
} from "lucide-react";
import type { FirestoreService } from "@/lib/firestoreTypes";

const COLORS = ["emerald", "indigo", "sky", "rose", "violet", "amber", "cyan"] as const;
type ColorKey = typeof COLORS[number];
const colorDot: Record<ColorKey, string> = {
  emerald: "#10b981", indigo: "#6366f1", sky: "#38bdf8",
  rose: "#fb7185", violet: "#8b5cf6", amber: "#f59e0b", cyan: "#22d3ee",
};

interface ProcessItem { title: string; description: string; }
interface DeliverableItem { title: string; description: string; }
interface PackageItem { name: string; subtitle: string; price: string; features: string[]; }
interface FAQItem { question: string; answer: string; }

interface FormState {
  title: string;
  description: string;
  iconUrl: string;
  price: string;
  badge: string;
  color: string;
  order: number;
  process: ProcessItem[];
  deliverables: DeliverableItem[];
  packages: PackageItem[];
  faqs: FAQItem[];
}

const emptyForm: FormState = {
  title: "", description: "", iconUrl: "", price: "", badge: "", color: "indigo",
  order: 0, process: [], deliverables: [], packages: [], faqs: [],
};

function SectionBlock({
  title, count, children, defaultOpen = false,
}: { title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-900/80 hover:bg-neutral-800/60 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">{count} item{count !== 1 ? "s" : ""}</span>
          {open ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
        </div>
      </button>
      {open && <div className="p-4 bg-neutral-950/60 space-y-3">{children}</div>}
    </div>
  );
}

const inputCls = "w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors";
const textareaCls = inputCls + " resize-none";

export function ServicesTab({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [items, setItems] = useState<FirestoreService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreService | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!db) {
      console.warn("[Admin/Services] Firestore not initialised");
      setItems([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "services"), orderBy("order", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreService));
        console.log(`[Admin/Services] Real-time update: ${data.length} services`);
        setItems(data);
        setLoading(false);
      },
      (err) => {
        console.error("[Admin/Services] Snapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: items.length });
    setFormOpen(true);
  };

  const openEdit = (s: FirestoreService) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description,
      iconUrl: s.iconUrl,
      price: s.price ?? "",
      badge: s.badge ?? "",
      color: s.color ?? "indigo",
      order: s.order ?? 0,
      process: (s.process ?? []).map((p) => ({ title: p.title, description: p.description })),
      deliverables: (s.deliverables ?? []).map((d) => ({ title: d.title, description: d.description })),
      packages: (s.packages ?? []).map((p) => ({ name: p.name, subtitle: p.subtitle, price: p.price ?? "", features: [...p.features] })),
      faqs: (s.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    });
    setFormOpen(true);
  };

  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      const payload: Omit<FirestoreService, "id"> = {
        title: form.title.trim(),
        description: form.description.trim(),
        iconUrl: form.iconUrl.trim(),
        price: form.price.trim(),
        badge: form.badge.trim(),
        color: form.color,
        order: form.order,
        process: form.process.filter((p) => p.title.trim()),
        deliverables: form.deliverables.filter((d) => d.title.trim()),
        packages: form.packages
          .filter((p) => p.name.trim())
          .map((p) => ({ name: p.name.trim(), subtitle: p.subtitle.trim(), price: p.price.trim(), features: p.features.filter(Boolean) })),
        faqs: form.faqs.filter((f) => f.question.trim()),
      };
      if (editing?.id) {
        await updateDoc(doc(db, "services", editing.id), payload);
        showToast("Service updated!", "success");
      } else {
        await addDoc(collection(db, "services"), { ...payload, createdAt: Date.now() });
        showToast("Service added!", "success");
      }
      closeForm();
    } catch (err) {
      showToast("Save failed: " + (err instanceof Error ? err.message : "Unknown"), "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Delete this service?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "services", id));
      showToast("Service deleted", "success");
    } catch { showToast("Delete failed", "error"); }
    setDeleting(null);
  };

  if (formOpen) {
    return (
      <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{editing ? "Edit Service" : "Add Service"}</h2>
          <button type="button" onClick={closeForm} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* ── Basic Fields ── */}
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/40 space-y-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Basic Info</p>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Service Title <span className="text-red-400">*</span></label>
            <input required value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Web Development & UI/UX Design" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description <span className="text-red-400">*</span></label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe what you offer with this service..." className={textareaCls} />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Icon URL <span className="text-neutral-600">(optional)</span></label>
            <input value={form.iconUrl} onChange={(e) => setForm(f => ({ ...f, iconUrl: e.target.value }))}
              placeholder="https://... (svg or png)" className={inputCls} />
            {form.iconUrl && (
              <div className="mt-2 w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden p-2">
                <img src={form.iconUrl} alt="icon preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Badge <span className="text-neutral-600">(optional)</span></label>
              <input value={form.badge} onChange={(e) => setForm(f => ({ ...f, badge: e.target.value }))}
                placeholder="e.g. Most Popular" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Starting Price <span className="text-neutral-600">(optional)</span></label>
              <input value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="e.g. From $499" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    title={c}
                    className="w-7 h-7 rounded-full transition-all duration-150 flex items-center justify-center"
                    style={{
                      background: colorDot[c],
                      outline: form.color === c ? `2px solid ${colorDot[c]}` : "none",
                      outlineOffset: "2px",
                      opacity: form.color === c ? 1 : 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm(f => ({ ...f, order: Number(e.target.value) }))} className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Process Steps ── */}
        <SectionBlock title="Process Steps" count={form.process.length}>
          {form.process.map((step, i) => (
            <div key={i} className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2 relative">
              <button type="button" onClick={() => setForm(f => ({ ...f, process: f.process.filter((_, j) => j !== i) }))}
                className="absolute top-2 right-2 text-neutral-600 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Step {i + 1}</div>
              <input value={step.title} onChange={(e) => setForm(f => ({ ...f, process: f.process.map((p, j) => j === i ? { ...p, title: e.target.value } : p) }))}
                placeholder="Step title" className={inputCls} />
              <textarea rows={2} value={step.description} onChange={(e) => setForm(f => ({ ...f, process: f.process.map((p, j) => j === i ? { ...p, description: e.target.value } : p) }))}
                placeholder="Step description" className={textareaCls} />
            </div>
          ))}
          <button type="button" onClick={() => setForm(f => ({ ...f, process: [...f.process, { title: "", description: "" }] }))}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </SectionBlock>

        {/* ── Deliverables ── */}
        <SectionBlock title="Deliverables" count={form.deliverables.length}>
          {form.deliverables.map((d, i) => (
            <div key={i} className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2 relative">
              <button type="button" onClick={() => setForm(f => ({ ...f, deliverables: f.deliverables.filter((_, j) => j !== i) }))}
                className="absolute top-2 right-2 text-neutral-600 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Item {i + 1}</div>
              <input value={d.title} onChange={(e) => setForm(f => ({ ...f, deliverables: f.deliverables.map((item, j) => j === i ? { ...item, title: e.target.value } : item) }))}
                placeholder="Deliverable title" className={inputCls} />
              <textarea rows={2} value={d.description} onChange={(e) => setForm(f => ({ ...f, deliverables: f.deliverables.map((item, j) => j === i ? { ...item, description: e.target.value } : item) }))}
                placeholder="What the client gets" className={textareaCls} />
            </div>
          ))}
          <button type="button" onClick={() => setForm(f => ({ ...f, deliverables: [...f.deliverables, { title: "", description: "" }] }))}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Deliverable
          </button>
        </SectionBlock>

        {/* ── Packages ── */}
        <SectionBlock title="Packages / Pricing Tiers" count={form.packages.length}>
          {form.packages.map((pkg, pi) => (
            <div key={pi} className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-3 relative">
              <button type="button" onClick={() => setForm(f => ({ ...f, packages: f.packages.filter((_, j) => j !== pi) }))}
                className="absolute top-2 right-2 text-neutral-600 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Package {pi + 1}</div>
              <div className="grid grid-cols-2 gap-2">
                <input value={pkg.name} onChange={(e) => setForm(f => ({ ...f, packages: f.packages.map((p, j) => j === pi ? { ...p, name: e.target.value } : p) }))}
                  placeholder="Name (e.g. Starter)" className={inputCls} />
                <input value={pkg.price} onChange={(e) => setForm(f => ({ ...f, packages: f.packages.map((p, j) => j === pi ? { ...p, price: e.target.value } : p) }))}
                  placeholder="Price (e.g. Contact)" className={inputCls} />
              </div>
              <input value={pkg.subtitle} onChange={(e) => setForm(f => ({ ...f, packages: f.packages.map((p, j) => j === pi ? { ...p, subtitle: e.target.value } : p) }))}
                placeholder="Subtitle (e.g. Perfect for small teams)" className={inputCls} />
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Features</div>
                {pkg.features.map((feat, fi) => (
                  <div key={fi} className="flex gap-2">
                    <input value={feat}
                      onChange={(e) => setForm(f => ({
                        ...f, packages: f.packages.map((p, j) => j === pi
                          ? { ...p, features: p.features.map((fv, fj) => fj === fi ? e.target.value : fv) } : p),
                      }))}
                      placeholder={`Feature ${fi + 1}`} className={inputCls} />
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, packages: f.packages.map((p, j) => j === pi ? { ...p, features: p.features.filter((_, fj) => fj !== fi) } : p) }))}
                      className="text-neutral-600 hover:text-red-400 shrink-0 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button type="button"
                  onClick={() => setForm(f => ({ ...f, packages: f.packages.map((p, j) => j === pi ? { ...p, features: [...p.features, ""] } : p) }))}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors py-1">
                  <Plus className="w-3.5 h-3.5" /> Add Feature
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setForm(f => ({ ...f, packages: [...f.packages, { name: "", subtitle: "", price: "Contact", features: [] }] }))}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Package
          </button>
        </SectionBlock>

        {/* ── FAQs ── */}
        <SectionBlock title="FAQs" count={form.faqs.length}>
          {form.faqs.map((faq, i) => (
            <div key={i} className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2 relative">
              <button type="button" onClick={() => setForm(f => ({ ...f, faqs: f.faqs.filter((_, j) => j !== i) }))}
                className="absolute top-2 right-2 text-neutral-600 hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">FAQ {i + 1}</div>
              <input value={faq.question} onChange={(e) => setForm(f => ({ ...f, faqs: f.faqs.map((q, j) => j === i ? { ...q, question: e.target.value } : q) }))}
                placeholder="Question" className={inputCls} />
              <textarea rows={2} value={faq.answer} onChange={(e) => setForm(f => ({ ...f, faqs: f.faqs.map((q, j) => j === i ? { ...q, answer: e.target.value } : q) }))}
                placeholder="Answer" className={textareaCls} />
            </div>
          ))}
          <button type="button" onClick={() => setForm(f => ({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] }))}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </SectionBlock>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : editing ? "Update Service" : "Add Service"}
          </button>
          <button type="button" onClick={closeForm}
            className="px-5 py-2.5 rounded-lg text-sm text-neutral-400 border border-neutral-800 hover:border-neutral-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Services <span className="text-neutral-600 font-normal text-sm">({items.length})</span>
          </h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-neutral-500 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-neutral-600 text-sm">
          No services yet. Add your first offering — it will auto-populate the Services section on your homepage.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map(s => {
            const dot = colorDot[(s.color as ColorKey) || "indigo"] || "#6366f1";
            return (
              <div key={s.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 p-2 overflow-hidden">
                    {s.iconUrl ? (
                      <img src={s.iconUrl} alt={s.title} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-white truncate">{s.title}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        {s.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                            style={{ color: dot, borderColor: `${dot}40`, background: `${dot}15` }}>
                            {s.badge}
                          </span>
                        )}
                        {s.price && <span className="text-xs font-bold text-emerald-400">{s.price}</span>}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{s.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-600">
                      {(s.process?.length ?? 0) > 0 && <span>{s.process!.length} steps</span>}
                      {(s.deliverables?.length ?? 0) > 0 && <span>{s.deliverables!.length} deliverables</span>}
                      {(s.packages?.length ?? 0) > 0 && <span>{s.packages!.length} packages</span>}
                      {(s.faqs?.length ?? 0) > 0 && <span>{s.faqs!.length} FAQs</span>}
                    </div>
                    <div className="flex gap-1 mt-3 pt-3 border-t border-neutral-800">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => s.id && handleDelete(s.id)} disabled={deleting === s.id}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        {deleting === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
