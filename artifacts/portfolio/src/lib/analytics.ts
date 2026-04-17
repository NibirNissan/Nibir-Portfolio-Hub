import {
  doc,
  getDoc,
  setDoc,
  increment,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

/* ─────────────────────────────────────────────────────────── */
/*  Legacy homepage visit counter (kept for dashboard card)    */
/* ─────────────────────────────────────────────────────────── */

const VISIT_SESSION_KEY = "nn_visit_counted";

export async function trackHomepageVisit(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(VISIT_SESSION_KEY)) return;
  sessionStorage.setItem(VISIT_SESSION_KEY, "1");
  try {
    await setDoc(
      doc(db, "analytics", "visits"),
      { count: increment(1), lastVisit: Date.now() },
      { merge: true },
    );
  } catch {
    sessionStorage.removeItem(VISIT_SESSION_KEY);
  }
}

export async function getVisitCount(): Promise<number> {
  if (!isFirebaseConfigured || !db) return 0;
  try {
    const snap = await getDoc(doc(db, "analytics", "visits"));
    if (!snap.exists()) return 0;
    const data = snap.data() as { count?: number };
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

/* ─────────────────────────────────────────────────────────── */
/*  Tracking event type                                        */
/* ─────────────────────────────────────────────────────────── */

export interface TrackingEvent {
  id?: string;
  eventType: string;
  eventTarget: string;
  timeSpent: number | null;
  userAgent: string;
  localTime: string;
  timezone: string;
  createdAt: number;
}

/* ─────────────────────────────────────────────────────────── */
/*  trackEvent — fire-and-forget, never throws                 */
/* ─────────────────────────────────────────────────────────── */

export async function trackEvent(params: {
  eventType: string;
  eventTarget: string;
  timeSpent?: number;
}): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  if (typeof window === "undefined") return;
  try {
    const now = new Date();
    await addDoc(collection(db, "tracking_events"), {
      eventType: params.eventType,
      eventTarget: params.eventTarget,
      timeSpent: params.timeSpent ?? null,
      userAgent: navigator.userAgent,
      localTime: now.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: Date.now(),
    } satisfies Omit<TrackingEvent, "id">);
  } catch {
    /* tracking must never break the app — fail silently */
  }
}

/* ─────────────────────────────────────────────────────────── */
/*  Admin helpers                                              */
/* ─────────────────────────────────────────────────────────── */

export async function getRecentEvents(n = 60): Promise<TrackingEvent[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(
      collection(db, "tracking_events"),
      orderBy("createdAt", "desc"),
      limit(n),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TrackingEvent));
  } catch {
    return [];
  }
}

export async function deleteTrackingEvent(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, "tracking_events", id));
}

export async function clearAllTrackingEvents(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const snap = await getDocs(collection(db, "tracking_events"));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}
