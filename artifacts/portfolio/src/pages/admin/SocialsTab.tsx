import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Pencil, Trash2, X, Loader2, Link2 } from "lucide-react";
import type { FirestoreSocial } from "@/lib/firestoreTypes";

const emptySocial: Omit<FirestoreSocial, "id"> = {
  name: "",
  icon: "Github",
  url: "",
  order: 0,
};

const iconOptions = [
  "Github",
  "Globe",
  "Linkedin",
  "Twitter",
  "Instagram",
  "Youtube",
  "Facebook",
  "MessageCircle",
  "Phone",
  "Mail",
  "Rss",
  "ExternalLink",
];

export function SocialsTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [socials, setSocials] = useState<FirestoreSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreSocial | null>(null);
  const [form, setForm] = useState<Omit<FirestoreSocial, "id">>(emptySocial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!db) {
      console.warn("[Admin/Socials] Firestore not initialised");
      setLoading(false);
      return;
    }

    const q = query(collection(db, "socials"), orderBy("order", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSocial));
        console.log(`[Admin/Socials] Real-time update: ${items.length} links`);
        setSocials(items);
        setLoading(false);
      },
      (err) => {
        console.error("[Admin/Socials] Snapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptySocial, order: socials.length });
    setFormOpen(true);
  };
  const openEdit = (s: FirestoreSocial) => {
    setEditing(s);
    setForm({ name: s.name, icon: s.icon, url: s.url, order: s.order ?? 0 });
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
        await updateDoc(doc(db, "socials", editing.id), form);
        showToast("Link updated!", "success");
      } else {
        await addDoc(collection(db, "socials"), form);
        showToast("Link added!", "success");
      }
      closeForm();
    } catch (err) {
      showToast(
        "Save failed: " + (err instanceof Error ? err.message : "Unknown"),
        "error"
      );
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Delete this social link?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "socials", id));
      showToast("Link deleted", "success");
    } catch {
      showToast("Delete failed", "error");
    }
    setDeleting(null);
  };

  if (formOpen) {
    return (
      <form onSubmit={handleSave} className="space-y-5 max-w-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {editing ? "Edit Link" : "Add Social Link"}
          </h2>
          <button
            type="button"
            onClick={closeForm}
            className="text-neutral-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Platform Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="GitHub"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Icon
          </label>
          <select
            value={form.icon}
            onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            {iconOptions.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            URL
          </label>
          <input
            required
            type="url"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Display Order
          </label>
          <input
            type="number"
            value={form.order ?? 0}
            onChange={(e) =>
              setForm((f) => ({ ...f, order: Number(e.target.value) }))
            }
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : editing ? "Update" : "Add Link"}
          </button>
          <button
            type="button"
            onClick={closeForm}
            className="px-5 py-2.5 rounded-lg text-sm text-neutral-400 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
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
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Social Links{" "}
            <span className="text-neutral-600 font-normal text-sm">
              ({socials.length})
            </span>
          </h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      <p className="text-xs text-neutral-600 mb-5">
        These links appear in the Hero section and Contact section of your portfolio.
        Use Order to control display sequence (lower = first).
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
        </div>
      ) : socials.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-600 text-sm">
            No social links yet — defaults will be shown on the site.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {socials.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 hover:border-neutral-700 transition-colors"
            >
              <span className="text-xs text-neutral-600 w-5 text-center">
                {s.order ?? 0}
              </span>
              <span className="text-sm font-semibold text-white flex-1">
                {s.name}
              </span>
              <span className="text-xs font-mono text-neutral-500 hidden sm:block">
                {s.icon}
              </span>
              <span className="text-xs text-neutral-600 truncate max-w-[140px] hidden md:block">
                {s.url}
              </span>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => openEdit(s)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => s.id && handleDelete(s.id)}
                  disabled={deleting === s.id}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  {deleting === s.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
