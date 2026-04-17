import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Save, User2, DatabaseZap, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import type { FirestoreProfile } from "@/lib/firestoreTypes";
import { seedProjects, seedSkills, seedTimeline, seedServices } from "@/data/seedData";

const defaultProfile: FirestoreProfile = {
  heroTitle: "Nibir Nissan",
  heroSubtitle: "Entrepreneur & Developer",
  bio: "CST student turned full-stack developer & AI automation expert. Building digital products, automating workflows with n8n, and crafting premium visual experiences — from code to brand.",
  profileImageUrl: "",
  resumeLink: "",
  availability: "Available for freelance work",
};

/* Seed one collection — skips if it already has documents */
async function seedCollection(
  name: string,
  docs: object[],
): Promise<{ seeded: number; skipped: boolean }> {
  if (!db) throw new Error("Firestore not initialised");
  const snap = await getDocs(collection(db, name));
  if (!snap.empty) return { seeded: 0, skipped: true };
  for (const d of docs) {
    await addDoc(collection(db, name), d);
  }
  return { seeded: docs.length, skipped: false };
}

export function SettingsTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [form, setForm] = useState<FirestoreProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* Seed state */
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    projects: string;
    skills: string;
    timeline: string;
    services: string;
  } | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "settings", "profile"));
      if (snap.exists()) {
        setForm({ ...defaultProfile, ...(snap.data() as FirestoreProfile) });
      }
    } catch { /* use defaults */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
      showToast(
        "Save failed: " + (err instanceof Error ? err.message : "Unknown"),
        "error"
      );
    }
    setSaving(false);
  };

  const handleSeedFirebase = async () => {
    if (!db) {
      showToast("Firebase is not configured.", "error");
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      const [rProjects, rSkills, rTimeline, rServices] = await Promise.all([
        seedCollection("projects", seedProjects),
        seedCollection("skills", seedSkills),
        seedCollection("timeline", seedTimeline),
        seedCollection("services", seedServices),
      ]);

      const label = (r: { seeded: number; skipped: boolean }, total: number) =>
        r.skipped
          ? `Already had data — skipped`
          : `${r.seeded} / ${total} synced`;

      setSyncResult({
        projects: label(rProjects, seedProjects.length),
        skills: label(rSkills, seedSkills.length),
        timeline: label(rTimeline, seedTimeline.length),
        services: label(rServices, seedServices.length),
      });

      const allSkipped =
        rProjects.skipped && rSkills.skipped && rTimeline.skipped && rServices.skipped;

      if (allSkipped) {
        showToast(
          "All collections already have data — nothing was changed.",
          "error"
        );
      } else {
        showToast(
          "Data synced to Firebase! Page will reload in 2 s…",
          "success"
        );
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {
      showToast(
        "Sync failed: " + (err instanceof Error ? err.message : "Unknown"),
        "error"
      );
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
              ["heroTitle", "Hero Name", "Nibir Nissan"],
              ["heroSubtitle", "Hero Subtitle", "Entrepreneur & Developer"],
              ["availability", "Availability Badge Text", "Available for freelance work"],
              ["resumeLink", "Resume / CV Link", "https://drive.google.com/..."],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div key={key} className={key === "resumeLink" || key === "availability" ? "md:col-span-2" : ""}>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                {label}
              </label>
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
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Bio / Description
          </label>
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
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>

      {/* ── Divider ── */}
      <div className="border-t border-neutral-800" />

      {/* ── Data Migration ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <DatabaseZap className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Data Migration</h2>
            <p className="text-xs text-neutral-500 mt-0.5">One-time seed of all hardcoded content into Firebase</p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <p className="text-sm text-neutral-300 leading-relaxed">
            This will upload your hardcoded Projects, Skills, Timeline events, and Services into
            their Firestore collections. Each collection is <span className="text-white font-medium">only written to if it is currently empty</span> — existing data is never overwritten.
          </p>

          <ul className="text-xs text-neutral-500 space-y-1 pl-3 list-disc">
            <li><span className="text-neutral-300">Projects</span> — {seedProjects.length} entries (The Subspot, Jibon, Hospital Report Maker, Roshbadam, College ERP, The Cat Club)</li>
            <li><span className="text-neutral-300">Skills</span> — {seedSkills.length} entries across 5 categories</li>
            <li><span className="text-neutral-300">Timeline</span> — {seedTimeline.length} milestones (2019 → 2025)</li>
            <li><span className="text-neutral-300">Services</span> — {seedServices.length} offerings</li>
          </ul>

          <p className="text-xs text-neutral-600">
            After syncing, the page reloads automatically so every Admin tab reflects the new Firestore data. The public portfolio pages will also switch to using the live database.
          </p>
        </div>

        {/* Result rows */}
        {syncResult && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800 overflow-hidden">
            {(
              [
                ["Projects", syncResult.projects],
                ["Skills", syncResult.skills],
                ["Timeline", syncResult.timeline],
                ["Services", syncResult.services],
              ] as const
            ).map(([label, status]) => {
              const skipped = status.startsWith("Already");
              return (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-neutral-300">{label}</span>
                  <span className={`flex items-center gap-1.5 text-xs ${skipped ? "text-amber-400" : "text-emerald-400"}`}>
                    {skipped ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleSeedFirebase}
          disabled={syncing}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          {syncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {syncing ? "Syncing data…" : "Sync Local Data to Firebase"}
        </button>
      </div>
    </div>
  );
}
