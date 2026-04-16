import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Save, User2 } from "lucide-react";
import type { FirestoreProfile } from "@/lib/firestoreTypes";

const defaultProfile: FirestoreProfile = {
  heroTitle: "Nibir Nissan",
  heroSubtitle: "Entrepreneur & Developer",
  bio: "CST student turned full-stack developer & AI automation expert. Building digital products, automating workflows with n8n, and crafting premium visual experiences — from code to brand.",
  profileImageUrl: "",
  resumeLink: "",
  availability: "Available for freelance work",
};

export function SettingsTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [form, setForm] = useState<FirestoreProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
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
  );
}
