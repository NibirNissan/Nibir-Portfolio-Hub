import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import { isStorageConfigured } from "@/lib/firebase";

interface Props {
  value: string;
  onChange: (url: string) => void;
  onUploading?: (busy: boolean) => void;
  label?: string;
  hint?: string;
  previewHeight?: number;
}

export function ImageUploader({
  value,
  onChange,
  onUploading,
  label,
  hint,
  previewHeight = 160,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported.");
        return;
      }
      setError(null);
      setUploading(true);
      setProgress(0);
      onUploading?.(true);
      try {
        const url = await uploadImage(file, (pct) => setProgress(pct));
        onChange(url);
      } catch (err) {
        setError(
          "Upload failed: " +
            (err instanceof Error ? err.message : "Unknown error"),
        );
      } finally {
        setUploading(false);
        onUploading?.(false);
      }
    },
    [onChange, onUploading],
  );

  /* ── Global paste listener (Ctrl+V / Cmd+V anywhere on page) ── */
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files[0];
      if (file?.type.startsWith("image/")) {
        e.preventDefault();
        handleFile(file);
      }
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [handleFile]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-neutral-400">
          {label}
        </label>
      )}

      {/* ── Drop zone ── */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={[
          "relative rounded-xl border-2 border-dashed transition-all overflow-hidden",
          uploading
            ? "cursor-wait"
            : "cursor-pointer",
          dragOver
            ? "border-emerald-400 bg-emerald-500/8"
            : value
            ? "border-neutral-700 hover:border-neutral-500"
            : "border-neutral-700 hover:border-emerald-500/50 bg-neutral-900/60",
        ].join(" ")}
        style={{ minHeight: previewHeight }}
      >
        {value && !uploading ? (
          /* ── Preview ── */
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full object-cover"
              style={{ maxHeight: previewHeight + 40 }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <button
              type="button"
              title="Remove image"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setError(null);
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/75 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-red-600/80 transition-all z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </>
        ) : uploading ? (
          /* ── Progress ── */
          <div
            className="flex flex-col items-center justify-center gap-3 px-4"
            style={{ minHeight: previewHeight }}
          >
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-semibold text-white">
              Uploading… {progress}%
            </p>
            <div className="w-full max-w-xs bg-neutral-800 rounded-full overflow-hidden h-1.5">
              <div
                className="h-1.5 rounded-full bg-emerald-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* ── Empty state ── */
          <div
            className="flex flex-col items-center justify-center gap-3 px-4 text-center"
            style={{ minHeight: previewHeight }}
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
              {dragOver ? (
                <ImageIcon className="w-6 h-6 text-emerald-400" />
              ) : (
                <Upload className="w-5 h-5 text-neutral-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">
                {dragOver ? "Drop to upload" : "Click, drag & drop, or paste"}
              </p>
              <p className="text-xs text-neutral-500">
                PNG, JPG, GIF, WebP supported
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[10px]">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono text-[10px]">
                V
              </kbd>
              <span>to paste from clipboard</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      {/* ── Storage not configured warning ── */}
      {!isStorageConfigured && (
        <p className="text-[11px] text-amber-400/70">
          Firebase Storage is not configured — file upload unavailable. Use the URL field below.
        </p>
      )}

      {/* ── URL fallback input ── */}
      <input
        type="url"
        value={value}
        onChange={(e) => {
          setError(null);
          onChange(e.target.value);
        }}
        placeholder="Or paste an image URL directly…"
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
      />

      {hint && <p className="text-xs text-neutral-600">{hint}</p>}

      {/* ── Hidden file input ── */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
