export default function ScanLine() {
  return (
    <div className="relative h-8 w-full z-10" aria-hidden="true">
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px"
        style={{ background: `linear-gradient(to right, transparent, rgba(var(--theme-accent-rgb), 0.15), transparent)` }}
      />
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[2px] rounded-full will-change-transform"
        style={{
          background: `linear-gradient(90deg, transparent, var(--theme-accent), var(--theme-accent-light), var(--theme-accent), transparent)`,
          boxShadow: `0 0 12px rgba(var(--theme-accent-rgb), 0.5), 0 0 30px rgba(var(--theme-accent-rgb), 0.2)`,
          animation: "scan-line 8s ease-in-out infinite",
        }}
      />
    </div>
  );
}
