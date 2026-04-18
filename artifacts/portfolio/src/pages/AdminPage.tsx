import { useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
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
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import QuillEditor from "@/components/QuillEditor";
import type { FirestoreProject, FirestoreBlog } from "@/lib/firestoreTypes";
import { SettingsTab } from "@/pages/admin/SettingsTab";
import { SocialsTab } from "@/pages/admin/SocialsTab";
import { SkillsTab } from "@/pages/admin/SkillsTab";
import { TestimonialsTab } from "@/pages/admin/TestimonialsTab";
import { InboxTab } from "@/pages/admin/InboxTab";
import { ServicesTab } from "@/pages/admin/ServicesTab";
import { AnalyticsTab } from "@/pages/admin/AnalyticsTab";
import { TimelineTab } from "@/pages/admin/TimelineTab";
import { getVisitCount } from "@/lib/analytics";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Layers,
  BookOpen,
  X,
  Image,
  AlignLeft,
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Settings,
  Link2,
  Zap,
  Quote,
  Inbox,
  Briefcase,
  Fingerprint,
  ShieldCheck,
  BarChart3,
  Clock3,
} from "lucide-react";
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  hasBiometricRegistered,
  registerBiometric,
} from "@/lib/webauthn";

function NotConfigured() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Firebase Not Configured</h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Set your Firebase environment variables to enable the admin panel.
          See the setup guide provided.
        </p>
        <div className="text-left bg-neutral-900 border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-300 space-y-1">
          <p className="text-neutral-500"># Required env vars</p>
          <p>VITE_FIREBASE_API_KEY</p>
          <p>VITE_FIREBASE_AUTH_DOMAIN</p>
          <p>VITE_FIREBASE_PROJECT_ID</p>
          <p>VITE_FIREBASE_STORAGE_BUCKET</p>
          <p>VITE_FIREBASE_MESSAGING_SENDER_ID</p>
          <p>VITE_FIREBASE_APP_ID</p>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onLogin(result.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(
        message.includes("invalid-credential") || message.includes("wrong-password")
          ? "Invalid email or password"
          : message.includes("user-not-found")
          ? "No account found with this email"
          : "Authentication failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-black text-emerald-400">N</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-neutral-500 text-sm">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 pr-10 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

const emptyProject: Omit<FirestoreProject, "id"> = {
  title: "", slug: "", subtitle: "", thumbnail: "", mockupImage: "", techStack: [],
  liveLink: "", repoLink: "", status: "Live", year: new Date().getFullYear().toString(),
  role: "", accent: "indigo", heroDescription: "", problem: "", solution: "",
  tags: [], features: [], stats: [], detailSections: [], createdAt: Date.now(), order: 0,
};

const emptyBlog: Omit<FirestoreBlog, "id"> = {
  title: "", slug: "", date: new Date().toISOString().split("T")[0],
  coverImage: "", content: "", excerpt: "", published: false, createdAt: Date.now(),
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
        type === "success"
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
          : "bg-red-500/10 border-red-500/20 text-red-300"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  );
}

function TagInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) { onChange([...value, v]); }
    setInput("");
  };
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-400 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-neutral-800 text-neutral-200 text-xs px-2.5 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="text-neutral-500 hover:text-red-400">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={`Add ${label.toLowerCase()}…`}
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-sm">Add</button>
      </div>
    </div>
  );
}

function ProjectsTab({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreProject | null>(null);
  const [form, setForm] = useState<Omit<FirestoreProject, "id">>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    if (!db) { console.warn("[Admin/Projects] Firestore not initialised"); setLoading(false); return; }
    try {
      console.log("[Admin/Projects] Fetching projects…");
      const q = query(collection(db, "projects"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProject));
      console.log(`[Admin/Projects] Fetched ${items.length} projects`);
      setProjects(items);
    } catch (err) {
      console.warn("[Admin/Projects] orderBy query failed, retrying without order:", err);
      try {
        const snap = await getDocs(collection(db, "projects"));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProject));
        console.log(`[Admin/Projects] Fetched ${items.length} projects (no order)`);
        setProjects(items);
      } catch (err2) {
        console.error("[Admin/Projects] Fetch failed entirely:", err2);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openAdd = () => { setEditing(null); setForm({ ...emptyProject, createdAt: Date.now() }); setFormOpen(true); };
  const openEdit = (p: FirestoreProject) => { setEditing(p); setForm({ ...p }); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const setField = (key: keyof Omit<FirestoreProject, "id">, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      const data = { ...form, slug: form.slug || slugify(form.title) };
      if (editing?.id) {
        await updateDoc(doc(db, "projects", editing.id), data);
        showToast("Project updated!", "success");
      } else {
        await addDoc(collection(db, "projects"), data);
        showToast("Project added!", "success");
      }
      await fetchProjects();
      closeForm();
    } catch (err) {
      showToast("Save failed: " + (err instanceof Error ? err.message : "Unknown error"), "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Delete this project?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "projects", id));
      showToast("Project deleted", "success");
      await fetchProjects();
    } catch {
      showToast("Delete failed", "error");
    }
    setDeleting(null);
  };

  const addFeature = () => setForm((f) => ({ ...f, features: [...f.features, { title: "", description: "", imageUrl: "" }] }));
  const removeFeature = (i: number) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  const setFeature = (i: number, key: "title" | "description" | "imageUrl", val: string) =>
    setForm((f) => ({ ...f, features: f.features.map((feat, idx) => idx === i ? { ...feat, [key]: val } : feat) }));

  const addStat = () => setForm((f) => ({ ...f, stats: [...f.stats, { value: "", label: "" }] }));
  const removeStat = (i: number) => setForm((f) => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }));
  const setStat = (i: number, key: "value" | "label", val: string) =>
    setForm((f) => ({ ...f, stats: f.stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s) }));

  const addDetailSection = (type: "text" | "image") =>
    setForm((f) => ({ ...f, detailSections: [...f.detailSections, { type, content: "" }] }));
  const removeDetailSection = (i: number) =>
    setForm((f) => ({ ...f, detailSections: f.detailSections.filter((_, idx) => idx !== i) }));
  const setDetailSection = (i: number, content: string) =>
    setForm((f) => ({ ...f, detailSections: f.detailSections.map((s, idx) => idx === i ? { ...s, content } : s) }));

  const accentOptions = ["indigo", "red", "sky", "orange", "violet", "teal", "green", "amber"];

  if (formOpen) {
    return (
      <form onSubmit={handleSave} className="space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{editing ? "Edit Project" : "Add Project"}</h2>
          <button type="button" onClick={closeForm} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Project Image — dedicated section with live preview */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
          <label className="block text-xs font-semibold text-neutral-300 tracking-wide uppercase">Project Image</label>
          <div className="flex gap-4 items-start">
            <div className="w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
              {form.thumbnail ? (
                <img
                  src={form.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-neutral-600">
                  <Image className="w-6 h-6" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <input
                value={form.thumbnail}
                onChange={(e) => setField("thumbnail", e.target.value)}
                placeholder="https://example.com/project-cover.jpg"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <p className="text-xs text-neutral-600">Paste any public image URL. Shown as the card thumbnail on the portfolio and at the top of the project detail page.</p>
            </div>
          </div>
        </div>

        {/* Mockup / Hero Image — shown on the Case Study page hero section */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
          <label className="block text-xs font-semibold text-neutral-300 tracking-wide uppercase">Mockup / Hero Image</label>
          <div className="flex gap-4 items-start">
            <div className="w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
              {form.mockupImage ? (
                <img
                  src={form.mockupImage}
                  alt="Mockup preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-neutral-600">
                  <Image className="w-6 h-6" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <input
                value={form.mockupImage ?? ""}
                onChange={(e) => setField("mockupImage", e.target.value)}
                placeholder="https://example.com/project-mockup.jpg"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <p className="text-xs text-neutral-600">Displayed as the large hero image on the full Case Study page. If left blank, an animated placeholder is shown instead.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {([
            ["title", "Project Title", "The Subspot"],
            ["slug", "Slug (auto-generated if blank)", "the-subspot"],
            ["subtitle", "Subtitle", "Digital Management Platform"],
            ["year", "Year", "2025"],
            ["role", "Your Role", "Lead Developer"],
            ["liveLink", "Live URL", "https://..."],
            ["repoLink", "GitHub Repo URL", "https://github.com/..."],
            ["status", "Status", "Live"],
          ] as const).map(([key, label, placeholder]) => (
            <div key={key} className={key === "slug" ? "md:col-span-2" : ""}>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">{label}</label>
              <input
                value={(form as Record<string, unknown>)[key] as string ?? ""}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Accent Color</label>
            <select
              value={form.accent}
              onChange={(e) => setField("accent", e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            >
              {accentOptions.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Display Order</label>
            <input
              type="number"
              value={form.order ?? 0}
              onChange={(e) => setField("order", Number(e.target.value))}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {[
          ["heroDescription", "Hero Description"],
          ["problem", "Problem Statement"],
          ["solution", "Solution"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">{label}</label>
            <textarea
              rows={3}
              value={(form as Record<string, unknown>)[key] as string ?? ""}
              onChange={(e) => setField(key as keyof typeof form, e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
        ))}

        <TagInput label="Tech Stack" value={form.techStack} onChange={(v) => setField("techStack", v)} />
        <TagInput label="Tags" value={form.tags} onChange={(v) => setField("tags", v)} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-neutral-300 tracking-wide uppercase">Features / Key Capabilities</label>
            <button type="button" onClick={addFeature} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Feature
            </button>
          </div>
          <div className="space-y-3">
            {form.features.map((feat, i) => (
              <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Feature {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-neutral-600 hover:text-red-400 transition-colors"
                    title="Remove feature"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">Title</label>
                  <input
                    value={feat.title}
                    onChange={(e) => setFeature(i, "title", e.target.value)}
                    placeholder="e.g. Real-time Notifications"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={feat.description}
                    onChange={(e) => setFeature(i, "description", e.target.value)}
                    placeholder="Briefly describe what this feature does and why it matters."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Feature Image URL + live preview */}
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">Feature Image URL <span className="text-neutral-600 normal-case font-normal">(optional)</span></label>
                  <div className="flex gap-3 items-start">
                    {/* Preview thumbnail */}
                    <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                      {feat.imageUrl ? (
                        <img
                          src={feat.imageUrl}
                          alt={`Feature ${i + 1} preview`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-neutral-700">
                          <Image className="w-5 h-5" />
                          <span className="text-[9px]">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        value={feat.imageUrl ?? ""}
                        onChange={(e) => setFeature(i, "imageUrl", e.target.value)}
                        placeholder="https://example.com/feature-screenshot.jpg"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                      <p className="text-[10px] text-neutral-600">Shown alongside the feature in the project overlay and case study page.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {form.features.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-800 py-8 text-center text-neutral-600 text-sm">
                No features added yet — click <span className="text-emerald-500">Add Feature</span> to start.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-neutral-400">Stats</label>
            <button type="button" onClick={addStat} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
              <Plus className="w-3.5 h-3.5" /> Add Stat
            </button>
          </div>
          {form.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={stat.value} onChange={(e) => setStat(i, "value", e.target.value)} placeholder="Value (e.g. 2.8k+)" className="w-1/3 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              <input value={stat.label} onChange={(e) => setStat(i, "label", e.target.value)} placeholder="Label (e.g. Active Users)" className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
              <button type="button" onClick={() => removeStat(i)} className="text-neutral-600 hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-neutral-400">Detail Sections (deep-dive content)</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => addDetailSection("text")} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
                <AlignLeft className="w-3.5 h-3.5" /> Text
              </button>
              <button type="button" onClick={() => addDetailSection("image")} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300">
                <Image className="w-3.5 h-3.5" /> Image
              </button>
            </div>
          </div>
          {form.detailSections.map((sec, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <span className={`mt-2.5 text-xs font-medium px-1.5 py-0.5 rounded ${sec.type === "text" ? "bg-neutral-800 text-neutral-400" : "bg-sky-900/30 text-sky-400"}`}>
                {sec.type}
              </span>
              {sec.type === "text" ? (
                <textarea
                  rows={3}
                  value={sec.content}
                  onChange={(e) => setDetailSection(i, e.target.value)}
                  placeholder="Write a paragraph about this project…"
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              ) : (
                <input
                  value={sec.content}
                  onChange={(e) => setDetailSection(i, e.target.value)}
                  placeholder="Image URL"
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
                />
              )}
              <button type="button" onClick={() => removeDetailSection(i)} className="mt-2.5 text-neutral-600 hover:text-red-400"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : editing ? "Update Project" : "Add Project"}
          </button>
          <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Projects <span className="text-neutral-600 font-normal text-sm">({projects.length})</span></h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-600 text-sm">No projects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors group">
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0 bg-neutral-800" />
              ) : (
                <div className="w-12 h-12 rounded-lg shrink-0 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <Image className="w-5 h-5 text-neutral-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-white truncate">{p.title}</h3>
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{p.status}</span>
                </div>
                <p className="text-xs text-neutral-500 truncate">{p.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => p.id && handleDelete(p.id)} disabled={deleting === p.id} className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogsTab({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [blogs, setBlogs] = useState<FirestoreBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirestoreBlog | null>(null);
  const [form, setForm] = useState<Omit<FirestoreBlog, "id">>(emptyBlog);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreBlog)));
    } catch {
      try {
        const snap = await getDocs(collection(db, "blogs"));
        setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreBlog)));
      } catch { /* empty */ }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const openAdd = () => { setEditing(null); setForm({ ...emptyBlog, createdAt: Date.now() }); setFormOpen(true); };
  const openEdit = (b: FirestoreBlog) => { setEditing(b); setForm({ ...b }); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };
  const setField = (key: keyof Omit<FirestoreBlog, "id">, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      const data = {
        ...form,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || form.content.replace(/<[^>]+>/g, "").slice(0, 160) + "…",
      };
      if (editing?.id) {
        await updateDoc(doc(db, "blogs", editing.id), data);
        showToast("Post updated!", "success");
      } else {
        await addDoc(collection(db, "blogs"), data);
        showToast("Post published!", "success");
      }
      await fetchBlogs();
      closeForm();
    } catch (err) {
      showToast("Save failed: " + (err instanceof Error ? err.message : "Unknown error"), "error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Delete this blog post?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "blogs", id));
      showToast("Post deleted", "success");
      await fetchBlogs();
    } catch { showToast("Delete failed", "error"); }
    setDeleting(null);
  };

  if (formOpen) {
    return (
      <form onSubmit={handleSave} className="space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{editing ? "Edit Post" : "New Post"}</h2>
          <button type="button" onClick={closeForm} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="My Blog Post Title"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Slug (auto if blank)</label>
            <input
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="my-blog-post-title"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Cover Image URL</label>
            <input
              value={form.coverImage}
              onChange={(e) => setField("coverImage", e.target.value)}
              placeholder="https://..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Excerpt (optional — auto-generated if blank)</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              placeholder="A short summary of your post…"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Content</label>
          <div className="quill-admin-wrapper rounded-xl overflow-hidden border border-neutral-800">
            <QuillEditor
              value={form.content}
              onChange={(html) => setField("content", html)}
              placeholder="Write your post here…"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField("published", !form.published)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
              form.published
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "border-neutral-800 text-neutral-500"
            }`}
          >
            {form.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {form.published ? "Published" : "Draft"}
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : editing ? "Update Post" : "Publish Post"}
          </button>
          <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Blog Posts <span className="text-neutral-600 font-normal text-sm">({blogs.length})</span></h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-600 text-sm">No posts yet. Write your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((b) => (
            <div key={b.id} className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
              {b.coverImage && (
                <img src={b.coverImage} alt={b.title} className="w-12 h-12 rounded-lg object-cover shrink-0 bg-neutral-800" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-white truncate">{b.title}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${b.published ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-neutral-800 text-neutral-500 border-neutral-700"}`}>
                    {b.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">{b.date}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(b)} className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => b.id && handleDelete(b.id)} disabled={deleting === b.id} className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  {deleting === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<"settings" | "socials" | "skills" | "testimonials" | "services" | "projects" | "blogs" | "inbox" | "analytics" | "timeline">("inbox");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [biometricBanner, setBiometricBanner] = useState<"idle" | "enrolling" | "success" | "hidden">("idle");
  /* Incrementing this key remounts the active tab, forcing a fresh fetch */
  const [refreshKey, setRefreshKey] = useState(0);
  const handleSyncComplete = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    getVisitCount().then(setVisitCount);
  }, []);

  // Show biometric enrollment banner only if WebAuthn is supported on this
  // device AND a credential hasn't been registered yet.
  useEffect(() => {
    if (!isWebAuthnSupported() || hasBiometricRegistered()) {
      setBiometricBanner("hidden");
      return;
    }
    isPlatformAuthenticatorAvailable().then((available) => {
      setBiometricBanner(available ? "idle" : "hidden");
    });
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleEnrollBiometric = async () => {
    setBiometricBanner("enrolling");
    const ok = await registerBiometric(user.uid, user.email ?? "admin");
    if (ok) {
      setBiometricBanner("success");
      showToast("Biometric login enabled! Long-press your photo to unlock.", "success");
      setTimeout(() => setBiometricBanner("hidden"), 3500);
    } else {
      setBiometricBanner("idle");
      showToast("Biometric registration cancelled or unavailable.", "error");
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <header className="border-b border-neutral-900 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="text-sm font-black text-emerald-400">N</span>
            </div>
            <div>
              <span className="text-sm font-bold text-white">Admin Panel</span>
              <ChevronRight className="inline w-3 h-3 text-neutral-600 mx-1" />
              <span className="text-sm text-neutral-500">{user.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider">Total Profile Views</div>
              <div className="text-2xl font-black text-white leading-tight tabular-nums">
                {visitCount === null ? (
                  <span className="inline-block w-10 h-6 bg-neutral-800 rounded animate-pulse" />
                ) : (
                  visitCount.toLocaleString()
                )}
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Inbox</div>
              <button
                onClick={() => setTab("inbox")}
                className="text-sm text-neutral-300 hover:text-white font-medium"
              >
                Open messages →
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Services</div>
              <button
                onClick={() => setTab("services")}
                className="text-sm text-neutral-300 hover:text-white font-medium"
              >
                Manage offerings →
              </button>
            </div>
          </div>
        </div>

        {/* Biometric enrollment banner — only shown once on devices that
            support WebAuthn and haven't registered a credential yet */}
        {biometricBanner !== "hidden" && (
          <div className="mb-6 flex items-center gap-4 bg-neutral-900 border border-emerald-500/20 rounded-xl p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              {biometricBanner === "success"
                ? <ShieldCheck className="w-5 h-5 text-emerald-400" />
                : <Fingerprint className="w-5 h-5 text-emerald-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              {biometricBanner === "success" ? (
                <>
                  <p className="text-sm font-semibold text-white">Biometric login activated</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Long-press your hero photo for 2.5s to unlock the admin panel with your fingerprint or PIN.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-white">Enable biometric unlock</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Register your fingerprint or device PIN to access the admin panel via the secret long-press.
                  </p>
                </>
              )}
            </div>
            {biometricBanner !== "success" && (
              <button
                onClick={handleEnrollBiometric}
                disabled={biometricBanner === "enrolling"}
                className="shrink-0 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                {biometricBanner === "enrolling"
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enrolling…</>
                  : <><Fingerprint className="w-3.5 h-3.5" /> Enable</>
                }
              </button>
            )}
            <button
              onClick={() => setBiometricBanner("hidden")}
              className="shrink-0 text-neutral-600 hover:text-neutral-300 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-8 bg-neutral-900 border border-neutral-800 p-1 rounded-xl w-fit">
          {(
            [
              { key: "inbox", icon: Inbox, label: "Inbox" },
              { key: "settings", icon: Settings, label: "General" },
              { key: "socials", icon: Link2, label: "Social Links" },
              { key: "skills", icon: Zap, label: "Skills" },
              { key: "testimonials", icon: Quote, label: "Testimonials" },
              { key: "services", icon: Briefcase, label: "Services" },
              { key: "projects", icon: Layers, label: "Projects" },
              { key: "blogs", icon: BookOpen, label: "Blogs" },
              { key: "timeline", icon: Clock3, label: "Timeline" },
              { key: "analytics", icon: BarChart3, label: "Analytics" },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "inbox"        && <InboxTab        key={refreshKey} showToast={showToast} />}
        {tab === "settings"     && <SettingsTab     key={refreshKey} showToast={showToast} onSyncComplete={handleSyncComplete} />}
        {tab === "socials"      && <SocialsTab      key={refreshKey} showToast={showToast} />}
        {tab === "skills"       && <SkillsTab       key={refreshKey} showToast={showToast} />}
        {tab === "testimonials" && <TestimonialsTab key={refreshKey} showToast={showToast} />}
        {tab === "services"     && <ServicesTab     key={refreshKey} showToast={showToast} />}
        {tab === "projects"     && <ProjectsTab     key={refreshKey} showToast={showToast} />}
        {tab === "blogs"        && <BlogsTab        key={refreshKey} showToast={showToast} />}
        {tab === "timeline"     && <TimelineTab     key={refreshKey} showToast={showToast} />}
        {tab === "analytics"    && <AnalyticsTab    key={refreshKey} showToast={showToast} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setAuthLoading(false); return; }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  if (!isFirebaseConfigured) return <NotConfigured />;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
      </div>
    );
  }

  if (!user) return <AdminLogin onLogin={setUser} />;
  return <AdminDashboard user={user} />;
}
