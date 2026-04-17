import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, Trash2, MousePointerClick, Eye,
  LogOut, BarChart3, Clock, Loader2, AlertTriangle,
} from "lucide-react";
import {
  getRecentEvents,
  clearAllTrackingEvents,
  deleteTrackingEvent,
  getVisitCount,
  type TrackingEvent,
} from "@/lib/analytics";

/* ─────────────────────────────────────────────────────────── */
/*  Helpers                                                    */
/* ─────────────────────────────────────────────────────────── */

function parseUA(ua: string): { device: string; os: string; browser: string } {
  let device = "Desktop";
  if (/iPhone/i.test(ua)) device = "iPhone";
  else if (/iPad/i.test(ua)) device = "iPad";
  else if (/Android.*Mobile/i.test(ua)) device = "Android Phone";
  else if (/Android/i.test(ua)) device = "Android Tablet";

  let os = "Unknown OS";
  if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Unknown";
  if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua)) browser = "Opera";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua)) browser = "Safari";

  return { device, os, browser };
}

function formatDuration(secs: number | null | undefined): string {
  if (secs == null || secs <= 0) return "—";
  if (secs < 60) return `${Math.round(secs)}s`;
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

const EVENT_STYLES: Record<string, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  button_click:  { label: "Click",        bg: "bg-amber-500/10",  text: "text-amber-400",  icon: MousePointerClick },
  project_view:  { label: "Project View", bg: "bg-indigo-500/10", text: "text-indigo-400", icon: Eye },
  page_leave:    { label: "Page Leave",   bg: "bg-rose-500/10",   text: "text-rose-400",   icon: LogOut },
  page_enter:    { label: "Page Enter",   bg: "bg-emerald-500/10",text: "text-emerald-400",icon: Eye },
};

function EventBadge({ type }: { type: string }) {
  const s = EVENT_STYLES[type] ?? {
    label: type, bg: "bg-neutral-800", text: "text-neutral-400", icon: BarChart3,
  };
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text} whitespace-nowrap`}>
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main component                                             */
/* ─────────────────────────────────────────────────────────── */

export function AnalyticsTab({ showToast }: { showToast: (msg: string, type: "success" | "error") => void }) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [evts, visits] = await Promise.all([getRecentEvents(60), getVisitCount()]);
    setEvents(evts);
    setVisitCount(visits);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleClearAll = async () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    setClearing(true);
    try {
      await clearAllTrackingEvents();
      setEvents([]);
      showToast("All events cleared", "success");
    } catch {
      showToast("Failed to clear events", "error");
    }
    setClearing(false);
    setConfirmClear(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTrackingEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      showToast("Delete failed", "error");
    }
    setDeletingId(null);
  };

  /* Derived stats */
  const totalClicks = events.filter((e) => e.eventType === "button_click").length;
  const totalViews = events.filter((e) => e.eventType === "project_view").length;
  const totalLeaves = events.filter((e) => e.eventType === "page_leave").length;
  const avgTime = (() => {
    const withTime = events.filter((e) => e.timeSpent != null && e.timeSpent > 0);
    if (!withTime.length) return null;
    return withTime.reduce((acc, e) => acc + (e.timeSpent ?? 0), 0) / withTime.length;
  })();

  const summaryCards = [
    { label: "Profile Views",   value: visitCount?.toLocaleString() ?? "—", rgb: "16,185,129",  icon: Eye },
    { label: "Button Clicks",   value: totalClicks,                          rgb: "245,158,11",  icon: MousePointerClick },
    { label: "Project Views",   value: totalViews,                           rgb: "99,102,241",  icon: Eye },
    { label: "Avg Time on Page", value: formatDuration(avgTime),             rgb: "56,189,248",  icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Analytics</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Last 60 tracking events — newest first</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleClearAll}
            disabled={clearing || events.length === 0}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              confirmClear
                ? "bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
                : "border-neutral-800 text-neutral-500 hover:text-rose-400 hover:border-rose-500/30"
            } disabled:opacity-30`}
            onBlur={() => setConfirmClear(false)}
          >
            {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            {confirmClear ? "Confirm clear?" : "Clear All"}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border p-4"
            style={{ background: `rgba(${c.rgb},0.05)`, borderColor: `rgba(${c.rgb},0.15)` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="w-3.5 h-3.5" style={{ color: `rgba(${c.rgb},0.8)` }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{c.label}</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {visitCount === null && c.label === "Profile Views"
                ? <span className="inline-block w-10 h-6 bg-neutral-800 rounded animate-pulse" />
                : c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Events table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 text-neutral-600 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 py-16 flex flex-col items-center gap-3 text-neutral-600">
          <BarChart3 className="w-8 h-8" />
          <p className="text-sm">No tracking events yet. Interact with the portfolio to generate data.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800">
            {["Event", "Target", "Device", "Time Spent", "When", ""].map((h) => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">{h}</span>
            ))}
          </div>

          {/* Table rows */}
          <div className="divide-y divide-neutral-800/60">
            {events.map((ev) => {
              const ua = parseUA(ev.userAgent);
              return (
                <div
                  key={ev.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center hover:bg-neutral-900/40 transition-colors group"
                >
                  {/* Event type badge */}
                  <EventBadge type={ev.eventType} />

                  {/* Target */}
                  <span className="text-sm text-neutral-300 font-medium truncate" title={ev.eventTarget}>
                    {ev.eventTarget}
                  </span>

                  {/* Device */}
                  <div className="text-right min-w-[140px]">
                    <div className="text-xs text-neutral-400 font-medium">{ua.device}</div>
                    <div className="text-[11px] text-neutral-600">{ua.os} · {ua.browser}</div>
                  </div>

                  {/* Time spent */}
                  <div className="text-center w-16">
                    {ev.timeSpent != null && ev.timeSpent > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        {formatDuration(ev.timeSpent)}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-700">—</span>
                    )}
                  </div>

                  {/* When */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-xs text-neutral-400" title={ev.localTime}>
                      {relativeTime(ev.createdAt)}
                    </div>
                    <div className="text-[11px] text-neutral-700">{ev.timezone}</div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => ev.id && handleDelete(ev.id)}
                    disabled={deletingId === ev.id}
                    className="opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-rose-400 transition-all"
                    title="Delete event"
                  >
                    {deletingId === ev.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2.5 bg-neutral-900/40 border-t border-neutral-800 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-neutral-700" />
            <span className="text-[11px] text-neutral-700">
              Showing last {events.length} of up to 60 events. Oldest events are not displayed.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
