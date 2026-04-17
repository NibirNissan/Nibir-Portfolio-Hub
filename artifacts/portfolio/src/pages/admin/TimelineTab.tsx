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
import {
  Plus, Pencil, Trash2, X, Loader2, Clock3, Image as ImageIcon,
} from "lucide-react";
import type { FirestoreTimeline } from "@/lib/firestoreTypes";
import { TIMELINE_ICON_MAP, TIMELINE_ICON_NAMES } from "@/lib/timelineIcons";

/* ─────────────────────────────────────────────────────────── */
/*  Constants                                                  */
/* ─────────────────────────────────────────────────────────── */

const COLOR_PRESETS = [
  { label: "Emerald", rgb: "16,185,129" },
  { label: "Sky",     rgb: "56,189,248" },
  { label: "Violet",  rgb: "139,92,246" },
  { label: "Indigo",  rgb: "99,102,241" },
  { label: "Amber",   rgb: "245,158,11" },
  { label: "Orange",  rgb: "249,115,22" },
  { label: "Teal",    rgb: "20,184,166" },
  { label: "Rose",    rgb: "244,63,94" },
];

const EMPTY_FORM: Omit<FirestoreTimeline, "id"> = {
  year: "",
  title: "",
  description: "",
  icon: "Sparkles",
  rgb: "16,185,129",
  tag: "",
  imageUrl: "",
  order: 0,
};

/* ─────────────────────────────────────────────────────────── */
/*  Small reusable input helpers                               */
/* ─────────────────────────────────────────────────────────── */

const inputCls =
  "w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50";

/* ─────────────────────────────────────────────────────────── */
/*  Main component                                             */
/* ─────────────────────────────────────────────────────────── */

export function TimelineTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [entries, setEntries] = useState<FirestoreTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreTimeline | null>(null);
  const [form, setForm] = useState<Omit<FirestoreTimeline, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* ── Fetch ── */
  const fetchEntries = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "timeline"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTimeline)));
    } catch {
      try {
        const snap = await getDocs(collection(db!, "timeline"));
        setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreTimeline)));
      } catch { /* empty */ }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  /* ── Form helpers ── */
  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: entries.length });
    setFormOpen(true);
  };
  const openEdit = (e: FirestoreTimeline) => {
    setEditing(e);
    setForm({
      year: e.year,
      title: e.title,
      description: e.description,
      icon: e.icon,
      rgb: e.rgb,
      tag: e.tag,
      imageUrl: e.imageUrl ?? "",
      order: e.order ?? 0,
    });
    setFormOpen(true);
  };
  const closeForm = () => { setFormOpen(false); setEditing(null); };
  const setField = <K extends keyof Omit<FirestoreTimeline, "id">>(
    key: K,
    val: Omit<FirestoreTimeline, "id">[K],
  ) => setForm((f) => ({ ...f, [key]: val }));

  /* ── Save ── */
  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        imageUrl: form.imageUrl?.trim() || "",
      };
      if (editing?.id) {
        await updateDoc(doc(db, "timeline", editing.id), payload);
        showToast("Milestone updated!", "success");
      } else {
        await addDoc(collection(db, "timeline"), payload);
        showToast("Milestone added!", "success");
      }
      await fetchEntries();
      closeForm();
    } catch (err) {
      showToast("Save failed: " + (err instanceof Error ? err.message : "Unknown"), "error");
    }
    setSaving(false);
  };

  /* ── Delete ── */
  const handleDelete = async (id: string) => {
    if (!db || !confirm("Delete this milestone?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "timeline", id));
      showToast("Milestone deleted", "success");
      await fetchEntries();
    } catch {
      showToast("Delete failed", "error");
    }
    setDeleting(null);
  };

  /* ─────────────────────────────────────────────────────────── */
  /*  Form view                                                  */
  /* ─────────────────────────────────────────────────────────── */

  if (formOpen) {
    const SelectedIcon = TIMELINE_ICON_MAP[form.icon] ?? TIMELINE_ICON_MAP["Sparkles"];

    return (
      <form onSubmit={handleSave} className="space-y-5 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {editing ? "Edit Milestone" : "Add Milestone"}
          </h2>
          <button type="button" onClick={closeForm} className="text-neutral-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year + Tag row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Year</label>
            <input
              required
              value={form.year}
              onChange={(e) => setField("year", e.target.value)}
              placeholder="2025"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tag</label>
            <input
              required
              value={form.tag}
              onChange={(e) => setField("tag", e.target.value)}
              placeholder="Launch"
              className={inputCls}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Launched My First Product"
            className={inputCls}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="A brief story about this milestone..."
            className={inputCls + " resize-none"}
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Icon</label>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `rgba(${form.rgb},0.12)`, border: `1px solid rgba(${form.rgb},0.3)` }}
            >
              <SelectedIcon style={{ color: `rgba(${form.rgb},0.9)`, width: "18px", height: "18px" }} />
            </div>
            <select
              value={form.icon}
              onChange={(e) => setField("icon", e.target.value)}
              className={inputCls + " flex-1"}
            >
              {TIMELINE_ICON_NAMES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-2">Accent Color</label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c.rgb}
                type="button"
                onClick={() => setField("rgb", c.rgb)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
                style={{
                  background: form.rgb === c.rgb ? `rgba(${c.rgb},0.15)` : "transparent",
                  borderColor: form.rgb === c.rgb ? `rgba(${c.rgb},0.5)` : "rgba(255,255,255,0.08)",
                  color: form.rgb === c.rgb ? `rgba(${c.rgb},1)` : "rgba(255,255,255,0.4)",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: `rgb(${c.rgb})` }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Image URL */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Milestone Image URL
            <span className="ml-1.5 text-neutral-600 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={form.imageUrl ?? ""}
            onChange={(e) => setField("imageUrl", e.target.value)}
            placeholder="https://example.com/milestone.jpg"
            className={inputCls}
          />
          {/* Live preview */}
          {form.imageUrl?.trim() && (
            <div className="mt-2 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
              <img
                src={form.imageUrl.trim()}
                alt="Preview"
                className="w-full h-36 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.nextElementSibling as HTMLElement | null)!.style.display = "flex";
                }}
              />
              <div
                className="hidden w-full h-36 items-center justify-center text-xs text-neutral-600 gap-2"
                style={{ display: "none" }}
              >
                <ImageIcon className="w-4 h-4" />
                Image failed to load — check the URL
              </div>
            </div>
          )}
        </div>

        {/* Display order */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Display Order</label>
          <input
            type="number"
            value={form.order ?? 0}
            onChange={(e) => setField("order", Number(e.target.value))}
            className={inputCls}
          />
          <p className="text-[11px] text-neutral-600 mt-1">Lower numbers appear first on the timeline.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : editing ? "Update Milestone" : "Add Milestone"}
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

  /* ─────────────────────────────────────────────────────────── */
  /*  List view                                                  */
  /* ─────────────────────────────────────────────────────────── */

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Clock3 className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Timeline{" "}
            <span className="text-neutral-600 font-normal text-sm">({entries.length})</span>
          </h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Milestone
        </button>
      </div>

      <p className="text-xs text-neutral-600 mb-5">
        Milestones are ordered by the Display Order field. If the collection is empty, the site shows the default hardcoded timeline.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl">
          <Clock3 className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-600 text-sm mb-1">No milestones added yet.</p>
          <p className="text-neutral-700 text-xs">The site is showing the built-in default timeline.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const Icon = TIMELINE_ICON_MAP[entry.icon] ?? TIMELINE_ICON_MAP["Sparkles"];
            return (
              <div
                key={entry.id}
                className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 hover:border-neutral-700 transition-colors group"
              >
                {/* Order number */}
                <span className="text-xs text-neutral-600 w-5 shrink-0 text-center tabular-nums">
                  {entry.order ?? 0}
                </span>

                {/* Icon dot */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `rgba(${entry.rgb},0.1)`,
                    border: `1px solid rgba(${entry.rgb},0.25)`,
                  }}
                >
                  <Icon style={{ color: `rgba(${entry.rgb},0.9)`, width: "15px", height: "15px" }} />
                </div>

                {/* Year badge */}
                <span
                  className="text-[10px] font-black font-mono uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                  style={{
                    background: `rgba(${entry.rgb},0.08)`,
                    color: `rgba(${entry.rgb},0.8)`,
                    border: `1px solid rgba(${entry.rgb},0.2)`,
                  }}
                >
                  {entry.year}
                </span>

                {/* Title + Tag */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">{entry.title}</span>
                    <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-medium">
                      {entry.tag}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 truncate mt-0.5">{entry.description}</p>
                </div>

                {/* Image indicator */}
                {entry.imageUrl && (
                  <div
                    className="shrink-0 w-10 h-7 rounded-md overflow-hidden border border-neutral-700"
                    title={entry.imageUrl}
                  >
                    <img
                      src={entry.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => entry.id && handleDelete(entry.id)}
                    disabled={deleting === entry.id}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    {deleting === entry.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
