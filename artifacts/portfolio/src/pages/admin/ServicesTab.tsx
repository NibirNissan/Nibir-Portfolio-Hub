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
import { Plus, Pencil, Trash2, X, Loader2, Briefcase, ImageIcon } from "lucide-react";
import type { FirestoreService } from "@/lib/firestoreTypes";

const emptyService: Omit<FirestoreService, "id"> = {
  title: "",
  description: "",
  iconUrl: "",
  price: "",
  order: 0,
};

export function ServicesTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [items, setItems] = useState<FirestoreService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreService | null>(null);
  const [form, setForm] = useState<Omit<FirestoreService, "id">>(emptyService);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      if (!db) { setItems([]); return; }
      try {
        const q = query(collection(db, "services"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreService)));
      } catch {
        try {
          const snap = await getDocs(collection(db, "services"));
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreService)));
        } catch { /* empty */ }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyService, order: items.length });
    setFormOpen(true);
  };
  const openEdit = (s: FirestoreService) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description,
      iconUrl: s.iconUrl,
      price: s.price ?? "",
      order: s.order ?? 0,
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
      const payload = {
        ...form,
        price: form.price?.trim() || "",
      };
      if (editing?.id) {
        await updateDoc(doc(db, "services", editing.id), payload);
        showToast("Service updated!", "success");
      } else {
        await addDoc(collection(db, "services"), { ...payload, createdAt: Date.now() });
        showToast("Service added!", "success");
      }
      await fetchItems();
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
      await fetchItems();
    } catch { showToast("Delete failed", "error"); }
    setDeleting(null);
  };

  if (formOpen) {
    return (
      <form onSubmit={handleSave} className="space-y-5 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {editing ? "Edit Service" : "Add Service"}
          </h2>
          <button type="button" onClick={closeForm} className="text-neutral-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Service Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Web Development & UI/UX Design"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe what you offer with this service..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Icon URL</label>
          <input
            required
            value={form.iconUrl}
            onChange={(e) => setForm(f => ({ ...f, iconUrl: e.target.value }))}
            placeholder="https://... (svg or png)"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
          {form.iconUrl && (
            <div className="mt-2 w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden p-2">
              <img src={form.iconUrl} alt="icon preview" className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Starting At{" "}
              <span className="text-neutral-600 font-normal">(optional)</span>
            </label>
            <input
              value={form.price ?? ""}
              onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="e.g. $499 or From $1k"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
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
            {saving ? "Saving…" : editing ? "Update" : "Add Service"}
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
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Services <span className="text-neutral-600 font-normal text-sm">({items.length})</span>
          </h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">
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
          {items.map(s => (
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
                    {s.price && (
                      <span className="text-xs font-bold text-emerald-400 shrink-0">{s.price}</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{s.description}</p>
                  <div className="flex gap-1 mt-3 pt-3 border-t border-neutral-800">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => s.id && handleDelete(s.id)} disabled={deleting === s.id} className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10">
                      {deleting === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
