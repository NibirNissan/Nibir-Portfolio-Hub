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
import { Plus, Pencil, Trash2, X, Loader2, Zap } from "lucide-react";
import type { FirestoreSkill } from "@/lib/firestoreTypes";

const emptySkill: Omit<FirestoreSkill, "id"> = {
  name: "",
  category: "Tech",
  order: 0,
};

const categories = [
  "Tech",
  "Design",
  "Automation",
  "Video",
  "Digital Marketing",
  "Backend",
  "DevOps",
  "Mobile",
  "Other",
];

const categoryColors: Record<string, string> = {
  Tech: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Design: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Automation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Video: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Digital Marketing": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Backend: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DevOps: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Mobile: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Other: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
};

export function SkillsTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [skills, setSkills] = useState<FirestoreSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreSkill | null>(null);
  const [form, setForm] = useState<Omit<FirestoreSkill, "id">>(emptySkill);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>("All");

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    if (!db) { console.warn("[Admin/Skills] Firestore not initialised"); setLoading(false); return; }
    try {
      console.log("[Admin/Skills] Fetching skills…");
      const q = query(collection(db, "skills"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSkill));
      console.log(`[Admin/Skills] Fetched ${items.length} skills`);
      setSkills(items);
    } catch (err) {
      console.warn("[Admin/Skills] orderBy query failed, retrying without order:", err);
      try {
        const snap = await getDocs(collection(db, "skills"));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSkill));
        console.log(`[Admin/Skills] Fetched ${items.length} skills (no order)`);
        setSkills(items);
      } catch (err2) {
        console.error("[Admin/Skills] Fetch failed entirely:", err2);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptySkill, order: skills.length });
    setFormOpen(true);
  };
  const openEdit = (s: FirestoreSkill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, order: s.order ?? 0 });
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
        await updateDoc(doc(db, "skills", editing.id), form);
        showToast("Skill updated!", "success");
      } else {
        await addDoc(collection(db, "skills"), form);
        showToast("Skill added!", "success");
      }
      await fetchSkills();
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
    if (!db || !confirm("Delete this skill?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "skills", id));
      showToast("Skill deleted", "success");
      await fetchSkills();
    } catch {
      showToast("Delete failed", "error");
    }
    setDeleting(null);
  };

  const groupedSkills = skills.reduce<Record<string, FirestoreSkill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const allCats = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];
  const visibleSkills =
    filterCat === "All" ? skills : skills.filter((s) => s.category === filterCat);

  if (formOpen) {
    return (
      <form onSubmit={handleSave} className="space-y-5 max-w-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {editing ? "Edit Skill" : "Add Skill"}
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
            Skill Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="React"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
            {saving ? "Saving…" : editing ? "Update Skill" : "Add Skill"}
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Skills{" "}
            <span className="text-neutral-600 font-normal text-sm">
              ({skills.length})
            </span>
          </h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <p className="text-xs text-neutral-600 mb-5">
        Skills are grouped by category on the portfolio. If the collection is empty, the site shows the default hardcoded skills.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-600 text-sm">
            No skills added yet — defaults are shown on the site.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
            {allCats.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterCat === cat
                    ? "bg-neutral-700 text-white border-neutral-600"
                    : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1 text-neutral-600">
                    ({groupedSkills[cat]?.length ?? 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {visibleSkills.map((s) => {
              const colorCls =
                categoryColors[s.category] ?? categoryColors["Other"];
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 hover:border-neutral-700 transition-colors"
                >
                  <span className="text-xs text-neutral-600 w-5 text-center">
                    {s.order ?? 0}
                  </span>
                  <span className="flex-1 text-sm font-medium text-white">
                    {s.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${colorCls}`}
                  >
                    {s.category}
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
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
