import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Loader2, Inbox, Mail, MailOpen, Clock, User2, Circle } from "lucide-react";
import type { FirestoreInquiry } from "@/lib/firestoreTypes";

function formatTimestamp(ts?: number): string {
  if (!ts) return "—";
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function InboxTab({
  showToast,
}: {
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [items, setItems] = useState<FirestoreInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FirestoreInquiry | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const fetchItems = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreInquiry)));
    } catch {
      try {
        const snap = await getDocs(collection(db, "inquiries"));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreInquiry)));
      } catch { /* empty */ }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleRead = async (i: FirestoreInquiry) => {
    if (!db || !i.id) return;
    const newRead = !i.read;
    try {
      await updateDoc(doc(db, "inquiries", i.id), { read: newRead });
      setItems(list => list.map(x => x.id === i.id ? { ...x, read: newRead } : x));
      if (selected?.id === i.id) setSelected(s => s ? { ...s, read: newRead } : s);
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const markReadOnOpen = async (i: FirestoreInquiry) => {
    setSelected(i);
    if (!i.read && db && i.id) {
      const targetId = i.id;
      try {
        await updateDoc(doc(db, "inquiries", targetId), { read: true });
        setItems(list => list.map(x => x.id === targetId ? { ...x, read: true } : x));
        // Only update selected if user hasn't clicked a different message in the meantime
        setSelected(curr => (curr?.id === targetId ? { ...curr, read: true } : curr));
      } catch { /* silent */ }
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Delete this message?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "inquiries", id));
      showToast("Message deleted", "success");
      setItems(list => list.filter(x => x.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch { showToast("Delete failed", "error"); }
    setDeleting(null);
  };

  const unreadCount = items.filter(i => !i.read).length;
  const visible = filter === "all"
    ? items
    : filter === "unread"
      ? items.filter(i => !i.read)
      : items.filter(i => i.read);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Inbox className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Inbox <span className="text-neutral-600 font-normal text-sm">({items.length})</span>
            </h2>
            {unreadCount > 0 && (
              <span className="text-xs text-emerald-400">{unreadCount} unread</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(["all", "unread", "read"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${
              filter === f ? "bg-neutral-700 text-white border-neutral-600" : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {f}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-neutral-500 animate-spin" /></div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 text-neutral-600 text-sm">
          {items.length === 0 ? "No messages yet. Your inbox will appear here when visitors send messages." : "No messages in this filter."}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {visible.map(i => (
              <button
                key={i.id}
                onClick={() => markReadOnOpen(i)}
                className={`w-full text-left bg-neutral-900 border rounded-xl px-4 py-3 transition-all ${
                  selected?.id === i.id
                    ? "border-emerald-500/40 bg-neutral-800/50"
                    : i.read ? "border-neutral-800 hover:border-neutral-700" : "border-emerald-500/20 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {!i.read && <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 shrink-0 mt-1.5" />}
                  <span className={`flex-1 text-sm truncate ${i.read ? "font-medium text-neutral-300" : "font-bold text-white"}`}>
                    {i.name}
                  </span>
                  <span className="text-[10px] text-neutral-600 shrink-0">{formatTimestamp(i.createdAt)}</span>
                </div>
                <div className="text-xs text-neutral-500 truncate mb-1">{i.subject || "(no subject)"}</div>
                <div className="text-xs text-neutral-600 line-clamp-1">{i.message}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sticky top-6">
                <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <User2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{selected.name}</div>
                      <a href={`mailto:${selected.email}`} className="text-xs text-neutral-400 hover:text-emerald-400 truncate block">{selected.email}</a>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggleRead(selected)}
                      title={selected.read ? "Mark as unread" : "Mark as read"}
                      className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      {selected.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => selected.id && handleDelete(selected.id)}
                      disabled={deleting === selected.id}
                      className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      {deleting === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-neutral-500 mb-1">Subject</div>
                  <div className="text-base font-semibold text-white">{selected.subject || "(no subject)"}</div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-neutral-500 mb-1">Message</div>
                  <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-600 pt-4 border-t border-neutral-800">
                  <Clock className="w-3 h-3" />
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}
                </div>

                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "")}`}
                  className="mt-4 block text-center w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            ) : (
              <div className="bg-neutral-900/50 border border-dashed border-neutral-800 rounded-xl p-12 text-center text-neutral-600 text-sm">
                Select a message to view it
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
