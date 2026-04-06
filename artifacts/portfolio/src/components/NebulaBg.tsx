export default function NebulaBg({ variant = "green" }: { variant?: "green" | "emerald-amber" }) {
  if (variant === "emerald-amber") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            top: "10%",
            left: "5%",
            background: `radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.08), transparent 65%)`,
            filter: "blur(60px)",
            animation: "nebula-drift 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: "5%",
            right: "10%",
            background: `radial-gradient(circle, rgba(var(--theme-secondary-rgb), 0.06), transparent 65%)`,
            filter: "blur(80px)",
            animation: "nebula-drift-2 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.05), transparent 60%)`,
            filter: "blur(50px)",
            animation: "nebula-drift-3 18s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: "5%",
          left: "-5%",
          background: `radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.07), rgba(var(--theme-accent-rgb), 0.03) 50%, transparent 70%)`,
          filter: "blur(70px)",
          animation: "nebula-drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 450,
          height: 450,
          bottom: "0%",
          right: "0%",
          background: `radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.06), transparent 65%)`,
          filter: "blur(80px)",
          animation: "nebula-drift-2 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 350,
          height: 350,
          top: "40%",
          right: "30%",
          background: `radial-gradient(circle, rgba(var(--theme-accent-rgb), 0.04), transparent 60%)`,
          filter: "blur(60px)",
          animation: "nebula-drift-3 16s ease-in-out infinite",
        }}
      />
    </div>
  );
}
