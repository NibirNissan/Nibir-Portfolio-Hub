import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Save, User2, DatabaseZap, CheckCircle2, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import type { FirestoreProfile } from "@/lib/firestoreTypes";
import { seedProjects, seedSkills, seedTimeline, seedServices, seedSocials } from "@/data/seedData";

const defaultProfile: FirestoreProfile = {
  heroTitle: "Nibir Nissan",
  heroSubtitle: "Entrepreneur & Developer",
  bio: "CST student turned full-stack developer & AI automation expert. Building digital products, automating workflows with n8n, and crafting premium visual experiences — from code to brand.",
  profileImageUrl: "",
  resumeLink: "",
  availability: "Available for freelance work",
  aboutTitle: "Who is Nibir Nissan?",
  aboutBio:
    "CST student turned full-stack developer & AI automation expert. I build digital products, automate complex workflows with n8n, and craft premium visual experiences — from raw code to polished brand identity.\n\nEntrepreneurship runs through everything I do. From launching The Subspot (a subscription platform with 2,000+ users) to designing systems that scale, I operate at the intersection of creativity, engineering, and strategy.",
  aboutImage: "",
};

/* ── Seed helpers ────────────────────────────────────────────── */

async function seedCollection(
  name: string,
  docs: object[],
): Promise<{ seeded: number; skipped: boolean; existing: number }> {
  if (!db) throw new Error("Firestore not initialised");
  const snap = await getDocs(collection(db, name));
  if (!snap.empty) return { seeded: 0, skipped: true, existing: snap.size };
  for (const d of docs) await addDoc(collection(db, name), d);
  return { seeded: docs.length, skipped: false, existing: 0 };
}

async function forceSeedCollection(
  name: string,
  docs: object[],
): Promise<{ seeded: number; deleted: number }> {
  if (!db) throw new Error("Firestore not initialised");
  console.log(`[Admin/Sync] Force-seeding "${name}"…`);
  const snap = await getDocs(collection(db, name));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  for (const d of docs) await addDoc(collection(db, name), d);
  console.log(`[Admin/Sync] "${name}" → deleted ${snap.size}, added ${docs.length}`);
  return { seeded: docs.length, deleted: snap.size };
}

interface SyncRow { label: string; status: string; ok: boolean }

export function SettingsTab({
  showToast,
  onSyncComplete,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
  onSyncComplete?: () => void;
}) {
  const [form, setForm] = useState<FirestoreProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [forceMode, setForceMode] = useState(false);
  const [syncRows, setSyncRows] = useState<SyncRow[]>([]);

  const fetchProfile = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "settings", "profile"));
      if (snap.exists()) setForm({ ...defaultProfile, ...(snap.data() as FirestoreProfile) });
    } catch (err) {
      console.warn("[Admin/Settings] Profile fetch failed:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const setField = (key: keyof FirestoreProfile, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "profile"), form, { merge: true });
      showToast("Settings saved!", "success");
    } catch (err) {
      showToast("Save failed: " + (err instanceof Error ? err.message : "Unknown"), "error");
    }
    setSaving(false);
  };

  const handleSync = async () => {
    if (!db) { showToast("Firebase is not configured.", "error"); return; }
    setSyncing(true);
    setSyncRows([]);

    const collections: Array<{ name: string; label: string; data: object[] }> = [
      { name: "projects",  label: "Projects",     data: seedProjects  },
      { name: "skills",    label: "Skills",       data: seedSkills    },
      { name: "timeline",  label: "Timeline",     data: seedTimeline  },
      { name: "services",  label: "Services",     data: seedServices  },
      { name: "socials",   label: "Social Links", data: seedSocials   },
    ];

    const rows: SyncRow[] = [];
    let anyWritten = false;

    try {
      for (const col of collections) {
        try {
          if (forceMode) {
            const r = await forceSeedCollection(col.name, col.data);
            rows.push({
              label: col.label,
              status: `Force-synced: deleted ${r.deleted}, added ${r.seeded}`,
              ok: true,
            });
            anyWritten = true;
          } else {
            const r = await seedCollection(col.name, col.data);
            if (r.skipped) {
              rows.push({
                label: col.label,
                status: `Already has ${r.existing} doc${r.existing !== 1 ? "s" : ""} — skipped`,
                ok: false,
              });
            } else {
              rows.push({ label: col.label, status: `${r.seeded} docs added`, ok: true });
              anyWritten = true;
            }
          }
        } catch (colErr) {
          console.error(`[Admin/Sync] "${col.name}" failed:`, colErr);
          rows.push({
            label: col.label,
            status: "Error: " + (colErr instanceof Error ? colErr.message : "Unknown"),
            ok: false,
          });
        }
      }

      setSyncRows(rows);

      if (anyWritten) {
        showToast("Sync complete! Refreshing data…", "success");
        onSyncComplete?.();
      } else {
        showToast(
          forceMode
            ? "Nothing was written — check console for errors."
            : "All collections already have data. Enable Force Re-sync to overwrite.",
          "error",
        );
      }
    } catch (err) {
      showToast("Sync failed: " + (err instanceof Error ? err.message : "Unknown"), "error");
    }

    setSyncing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-2xl">
      {/* ── Profile form ── */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <User2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Hero / Profile Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              ["heroTitle",    "Hero Name",              "Nibir Nissan"],
              ["heroSubtitle", "Hero Subtitle",          "Entrepreneur & Developer"],
              ["availability", "Availability Badge Text","Available for freelance work"],
              ["resumeLink",   "Resume / CV Link",       "https://drive.google.com/..."],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div key={key} className={key === "resumeLink" || key === "availability" ? "md:col-span-2" : ""}>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">{label}</label>
              <input
                value={form[key] ?? ""}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Profile Image URL{" "}
            <span className="text-neutral-600 font-normal">(leave blank to use the default photo)</span>
          </label>
          <input
            value={form.profileImageUrl ?? ""}
            onChange={(e) => setField("profileImageUrl", e.target.value)}
            placeholder="https://example.com/your-photo.jpg"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {form.profileImageUrl && (
            <img
              src={form.profileImageUrl}
              alt="Preview"
              className="mt-2 w-20 h-20 rounded-xl object-cover border border-neutral-700"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Bio / Description</label>
          <textarea
            rows={5}
            value={form.bio ?? ""}
            onChange={(e) => setField("bio", e.target.value)}
            placeholder="Write your bio here..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 resize-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>

      <div className="border-t border-neutral-800" />

      {/* ── Data Sync ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <DatabaseZap className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Data Migration</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Seed all hardcoded content into Firestore</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <p className="text-sm text-neutral-300 leading-relaxed">
            Uploads Projects, Skills, Timeline, Services, and Social Links into their Firestore
            collections. By default, <span className="text-white font-medium">existing collections are skipped</span>.
            Enable <span className="text-rose-300 font-medium">Force Re-sync</span> to wipe and re-seed a collection regardless.
          </p>

          <ul className="text-xs text-neutral-500 space-y-1 pl-3 list-disc">
            <li><span className="text-neutral-300">Projects</span> — {seedProjects.length} entries</li>
            <li><span className="text-neutral-300">Skills</span> — {seedSkills.length} entries across 5 categories</li>
            <li><span className="text-neutral-300">Timeline</span> — {seedTimeline.length} milestones</li>
            <li><span className="text-neutral-300">Services</span> — {seedServices.length} offerings</li>
            <li><span className="text-neutral-300">Social Links</span> — {seedSocials.length} links (GitHub, Telegram, WhatsApp)</li>
          </ul>
        </div>

        {/* Force toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${forceMode ? "bg-rose-600" : "bg-neutral-700"}`}
            onClick={() => setForceMode((v) => !v)}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${forceMode ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
          <span className="text-sm font-medium text-neutral-300">
            Force Re-sync{" "}
            <span className="text-neutral-500 font-normal text-xs">
              (deletes existing docs first — use with care)
            </span>
          </span>
        </label>

        {/* Result rows */}
        {syncRows.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800 overflow-hidden">
            {syncRows.map(({ label, status, ok }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3 gap-3">
                <span className="text-sm font-medium text-neutral-300 shrink-0">{label}</span>
                <span className={`flex items-center gap-1.5 text-xs text-right ${ok ? "text-emerald-400" : "text-amber-400"}`}>
                  {ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  {status}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 ${
              forceMode
                ? "bg-rose-700 hover:bg-rose-600 text-white"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            {syncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : forceMode ? (
              <Trash2 className="w-4 h-4" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {syncing
              ? "Syncing…"
              : forceMode
              ? "Force Re-sync All Collections"
              : "Sync Local Data to Firebase"}
          </button>
        </div>

        {forceMode && (
          <p className="text-xs text-rose-400/80 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Force mode will permanently delete all existing documents in each collection before re-seeding.
            Any data you added manually will be lost.
          </p>
        )}
      </div>
    </div>
  );
}
