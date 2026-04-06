export default function ScanLine() {
  return (
    <div className="relative h-8 w-full z-10" aria-hidden="true">
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[2px] rounded-full will-change-transform"
        style={{
          background: "linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)",
          boxShadow: "0 0 12px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.2)",
          animation: "scan-line 8s ease-in-out infinite",
        }}
      />
    </div>
  );
}
