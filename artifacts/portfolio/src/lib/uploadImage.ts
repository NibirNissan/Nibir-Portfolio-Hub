import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  if (!storage) {
    throw new Error(
      "Firebase Storage is not configured. Add VITE_FIREBASE_STORAGE_BUCKET to your environment variables.",
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `portfolio-images/${unique}.${ext}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) => {
        if (onProgress && snap.totalBytes > 0) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      (err) => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}
