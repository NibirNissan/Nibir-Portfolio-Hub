import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Pencil, Trash2, X, Loader2, Quote, Star } from "lucide-react";
import type { FirestoreTestimonial } from "@/lib/firestoreTypes";

const emptyTestimonial: Omit<FirestoreTestimonial, "id"> = {
  clientName: "",
  designation: "",
  imageUrl: "",
  review: "",
  rating: 5,
  order: 0,
};

export function TestimonialsTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [items, setItems] = useState<FirestoreTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreTestimonial | null>(null);
  const [form, setForm] = useState<Omit<FirestoreTestimonial, "id">>(emptyTestimonial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTestimonial)));
    } catch {
      try {
        const snap = await getDocs(collection(db, "testimonials"));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTestimonial)));
      } catch { /* empty */ }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyTestimonial, order: items.length });
    setFormOpen(true);
  };
  const openEdit = (t: FirestoreTestimonial) => {
    setEditing(t);
    setForm({
      clientName: t.clientName,
      designation: t.designation,
      imageUrl: t.imageUrl,
      review: t.review,
      rating: t.rating ?? 5,
      order: t.order ?? 0,
    });
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      if (editing?.id) {
        await updateDoc(doc(db, "testimonials", editing.id), form);
        showToast("Testimonial updated!", "success");
      } else {
        await addDoc(collection(db, "testimonials"), { ...form, createdAt: Date.now() });
        showToast("Testimonial added!", "success");
      }
      await fetchItems();
      closeForm();
    } catch (err) {
      showToast("Save failed: " + (err instanceof Error ? err.message : "Unknown"), "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Delete this testimonial?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "testimonials", id));
      showToast("Testimonial deleted", "success");
      await fetchItems();
    } catch { showToast("Delete failed", "error"); }
    setDeleting(null);
  };

  if (formOpen) {
    return (
      <form onSubmit={handleSave} className="space-y-5 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {editing ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <button type="button" onClick={closeForm} className="text-neutral-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Client Name</label>
            <input
              required
              value={form.clientName}
              onChange={(e) => setForm(f => ({ ...f, clientName: e.target.value }))}
              placeholder="Jane Doe"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Designation</label>
            <input
              required
              value={form.designation}
              onChange={(e) => setForm(f => ({ ...f, designation: e.target.value }))}
              placeholder="CEO, Acme Corp"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Client Image URL{" "}
            <span className="text-neutral-600 font-normal">(optional)</span>
          </label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="mt-2 w-14 h-14 rounded-full object-cover border border-neutral-700" />
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Review</label>
          <textarea
            required
            rows={4}
            value={form.review}
            onChange={(e) => setForm(f => ({ ...f, review: e.target.value }))}
            placeholder="Working with Nibir was..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Rating (1-5)</label>
            <select
              value={form.rating ?? 5}
              onChange={(e) => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            >
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Display Order</label>
            <input
              type="number"
              value={form.order ?? 0}
              onChange={(e) => setForm(f => ({ ...f, order: Number(e.target.value) }))}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg text-sm">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : editing ? "Update" : "Add Testimonial"}
          </button>
          <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-lg text-sm text-neutral-400 border border-neutral-800 hover:border-neutral-700">
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
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Quote className="w-4 h-4 text-rose-400" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Testimonials <span className="text-neutral-600 font-normal text-sm">({items.length})</span>
          </h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-neutral-500 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-neutral-600 text-sm">No testimonials yet. Add your first client review.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map(t => (
            <div key={t.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
              <div className="flex items-start gap-3">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.clientName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-700" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-sm font-bold text-neutral-400">
                    {t.clientName?.charAt(0) ?? "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{t.clientName}</div>
                      <div className="text-xs text-neutral-500 truncate">{t.designation}</div>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-2">{t.review}</p>
                  <div className="flex gap-1 mt-3 pt-3 border-t border-neutral-800">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => t.id && handleDelete(t.id)} disabled={deleting === t.id} className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10">
                      {deleting === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
