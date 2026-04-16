import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const VISIT_SESSION_KEY = "nn_visit_counted";

export async function trackHomepageVisit(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  if (typeof window === "undefined") return;
  // Set the session lock BEFORE awaiting the network call. This prevents
  // double-increments from React StrictMode double effects or rapid remounts
  // where two calls could both pass the check before either resolves.
  if (sessionStorage.getItem(VISIT_SESSION_KEY)) return;
  sessionStorage.setItem(VISIT_SESSION_KEY, "1");
  try {
    await setDoc(
      doc(db, "analytics", "visits"),
      { count: increment(1), lastVisit: Date.now() },
      { merge: true },
    );
  } catch {
    // If the write fails, release the lock so a future navigation can retry
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
