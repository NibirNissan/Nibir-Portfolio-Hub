import { useRef, useMemo, useEffect, useState, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useScroll } from "framer-motion";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

/* ─── Error boundary (silently swallows WebGL failures) ──────── */

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(_err: Error, _info: ErrorInfo) {
    // intentionally silent — WebGL unavailable is non-fatal
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/* ─── Helpers ───────────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function readCssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

/** Subscribe to changes of the active theme via the `data-theme` attribute. */
function useThemeColors() {
  const [colors, setColors] = useState(() => ({
    accent: readCssVar("--theme-accent", "#8b5cf6"),
    accentLight: readCssVar("--theme-accent-light", "#a78bfa"),
    secondary: readCssVar("--theme-secondary", "#ec4899"),
  }));

  useEffect(() => {
    const update = () => {
      setColors({
        accent: readCssVar("--theme-accent", "#8b5cf6"),
        accentLight: readCssVar("--theme-accent-light", "#a78bfa"),
        secondary: readCssVar("--theme-secondary", "#ec4899"),
      });
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

/* ─── Cluster: central icosahedron + orbiting octahedrons ───── */

interface SatelliteSpec {
  radius: number;
  speed: number;
  tilt: number;
  phase: number;
  size: number;
  altSpeed: number;
}

const SATELLITES: SatelliteSpec[] = [
  { radius: 1.9, speed: 0.35,  tilt: 0.0, phase: 0.0, size: 0.22, altSpeed: 1.30 },
  { radius: 2.2, speed: -0.28, tilt: 1.1, phase: 1.7, size: 0.18, altSpeed: 1.05 },
  { radius: 2.5, speed: 0.22,  tilt: 2.2, phase: 3.4, size: 0.16, altSpeed: 0.85 },
  { radius: 1.7, speed: -0.42, tilt: 0.6, phase: 5.0, size: 0.20, altSpeed: 1.45 },
  { radius: 2.8, speed: 0.18,  tilt: 1.7, phase: 2.2, size: 0.14, altSpeed: 0.70 },
];

function NodeCluster({
  scrollProgress,
  accent,
  accentLight,
  secondary,
}: {
  scrollProgress: MotionValue<number>;
  accent: string;
  accentLight: string;
  secondary: string;
}) {
  const centerRef = useRef<THREE.Mesh>(null!);
  const satRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const s = scrollProgress.get();
    const t = clock.getElapsedTime();

    // Central icosahedron — scroll drives rotation, slow auto-spin layered on
    if (centerRef.current) {
      centerRef.current.rotation.y = s * Math.PI * 4 + t * 0.08;
      centerRef.current.rotation.x = s * Math.PI * 2 + t * 0.04;
      centerRef.current.rotation.z = s * Math.PI * 1.2 + t * 0.02;

      const breathe = 1 + Math.sin(t * 0.6) * 0.04;
      centerRef.current.scale.setScalar(breathe);

      centerRef.current.position.x = lerp(2.4, -2.4, s);
      centerRef.current.position.y = lerp(0.7, -0.9, s);
      centerRef.current.position.z = lerp(0, -0.6, s);
    }

    // Satellites orbit the center
    const cx = centerRef.current?.position.x ?? 0;
    const cy = centerRef.current?.position.y ?? 0;
    const cz = centerRef.current?.position.z ?? 0;

    for (let i = 0; i < SATELLITES.length; i++) {
      const sat = satRefs.current[i];
      if (!sat) continue;
      const spec = SATELLITES[i];
      const angle = t * spec.speed + spec.phase;

      const x = Math.cos(angle) * spec.radius;
      const z = Math.sin(angle) * spec.radius;
      const y = Math.sin(angle * spec.altSpeed + spec.tilt) * spec.radius * 0.35;

      sat.position.set(cx + x, cy + y, cz + z);
      sat.rotation.x = t * 0.6 + i;
      sat.rotation.y = t * 0.4 + i;
    }
  });

  return (
    <>
      <mesh ref={centerRef} position={[2.4, 0.7, 0]}>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accentLight}
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1.4}
        />
      </mesh>

      {SATELLITES.map((spec, i) => (
        <mesh
          key={i}
          ref={(el) => {
            satRefs.current[i] = el;
          }}
        >
          <octahedronGeometry args={[spec.size, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? accentLight : secondary}
            emissive={i % 2 === 0 ? accent : secondary}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}
    </>
  );
}

/* ─── Particle cloud (themed) ───────────────────────────────── */

function ParticleCloud({
  scrollProgress,
  color,
}: {
  scrollProgress: MotionValue<number>;
  color: string;
}) {
  const pointsRef = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 6.5;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const s = scrollProgress.get();
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.035 + s * Math.PI * 0.8;
    pointsRef.current.rotation.x = t * 0.018 + s * 0.4;
    const scale = 1 + s * 0.18;
    pointsRef.current.scale.setScalar(scale);
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.022}
        color={color}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Scene wrapper ─────────────────────────────────────────── */

function Scene({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const { accent, accentLight, secondary } = useThemeColors();

  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight position={[-5, 4, 3]}  color={accent}      intensity={18} />
      <pointLight position={[5, -3, -1]} color={secondary}   intensity={12} />
      <pointLight position={[0, 0, 5]}   color={accentLight} intensity={8} />

      {/* Provides reflections for the metallic surfaces */}
      <Environment preset="city" />

      <NodeCluster
        scrollProgress={scrollProgress}
        accent={accent}
        accentLight={accentLight}
        secondary={secondary}
      />
      <ParticleCloud scrollProgress={scrollProgress} color={accentLight} />
    </>
  );
}

/* ─── WebGL capability check ─────────────────────────────────── */

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/* ─── Root export ────────────────────────────────────────────── */

export default function Scroll3DBackground() {
  const { scrollYProgress } = useScroll();
  const [supported] = useState(() =>
    typeof window !== "undefined" ? isWebGLAvailable() : false
  );

  if (!supported) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <CanvasErrorBoundary>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7.5], fov: 52 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
            });
          }}
        >
          <Scene scrollProgress={scrollYProgress} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
