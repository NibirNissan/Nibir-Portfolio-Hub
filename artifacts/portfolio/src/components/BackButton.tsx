import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function BackButton() {
  const [, setLocation] = useLocation();

  return (
    <button
      onClick={() => setLocation("/")}
      className="fixed top-5 right-5 sm:top-6 sm:right-6 z-50 group flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
      style={{
        background: "rgba(var(--theme-surface-rgb), 0.75)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        boxShadow: "0 0 20px rgba(16, 185, 129, 0.08)",
      }}
    >
      <ArrowLeft
        className="w-4 h-4 text-emerald-400 transition-transform duration-300 group-hover:-translate-x-1"
        style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))" }}
      />
      <span className="text-neutral-300 group-hover:text-emerald-300 transition-colors">Back to Home</span>
    </button>
  );
}
